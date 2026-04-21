// Admin API: passphrase auth + content/asset write operations
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_PASSPHRASE = Deno.env.get("ADMIN_PASSPHRASE") ?? "";
const TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

// --- Token helpers (HMAC-signed) ---
async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(TOKEN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function createToken(): Promise<string> {
  const payload = btoa(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS }));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

async function verifyToken(token: string | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload);
  if (sig !== expected) return false;
  try {
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!ADMIN_PASSPHRASE || !TOKEN_SECRET) {
    return json({ error: "Server not configured" }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const action = body?.action as string;

  // --- LOGIN ---
  if (action === "login") {
    const passphrase = String(body?.passphrase ?? "");
    if (passphrase !== ADMIN_PASSPHRASE) {
      // small delay to slow brute force
      await new Promise((r) => setTimeout(r, 500));
      return json({ error: "Invalid passphrase" }, 401);
    }
    const token = await createToken();
    return json({ token, expiresAt: Date.now() + TOKEN_TTL_MS });
  }

  // --- All other actions require valid token ---
  const token = req.headers.get("x-admin-token");
  const ok = await verifyToken(token);
  if (!ok) return json({ error: "Unauthorized" }, 401);

  // --- LIST CONTENT KEYS ---
  if (action === "list") {
    const { data, error } = await supabase
      .from("site_content")
      .select("content_key, updated_at")
      .order("content_key");
    if (error) return json({ error: error.message }, 500);
    return json({ items: data });
  }

  // --- GET ONE ---
  if (action === "get") {
    const key = String(body?.key ?? "");
    if (!key) return json({ error: "Missing key" }, 400);
    const { data, error } = await supabase
      .from("site_content")
      .select("content_value, updated_at")
      .eq("content_key", key)
      .maybeSingle();
    if (error) return json({ error: error.message }, 500);
    return json({ value: data?.content_value ?? null, updatedAt: data?.updated_at });
  }

  // --- UPSERT CONTENT ---
  if (action === "save") {
    const key = String(body?.key ?? "");
    const value = body?.value;
    if (!key || value === undefined) {
      return json({ error: "Missing key or value" }, 400);
    }
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { content_key: key, content_value: value, updated_at: new Date().toISOString() },
        { onConflict: "content_key" },
      );
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  // --- UPLOAD CV (base64 PDF) ---
  if (action === "upload_cv") {
    const base64 = String(body?.fileBase64 ?? "");
    if (!base64) return json({ error: "Missing file" }, 400);
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    if (bytes.length > 10 * 1024 * 1024) {
      return json({ error: "File too large (max 10MB)" }, 400);
    }
    const path = "cv/Abu_Sufyan_CV.pdf";
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, bytes, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (error) return json({ error: error.message }, 500);
    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
    // store URL in site_content for the frontend to read
    await supabase
      .from("site_content")
      .upsert(
        { content_key: "cv_url", content_value: { url: pub.publicUrl, updatedAt: Date.now() } },
        { onConflict: "content_key" },
      );
    return json({ ok: true, url: pub.publicUrl });
  }

  return json({ error: "Unknown action" }, 400);
});

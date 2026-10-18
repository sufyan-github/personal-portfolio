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
const loginAttempts = new Map<string, { count: number; until: number }>();
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;   // 5 MB
const ALLOWED_CATEGORIES = ["gallery", "hero", "profile", "asset"];

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

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const action = body?.action as string;

  // --- LOGIN ---
  if (action === "login") {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    let bucket = loginAttempts.get(ip);
    if (!bucket || bucket.until < Date.now()) { bucket = { count: 0, until: Date.now() + 15 * 60_000 }; loginAttempts.set(ip, bucket); }
    if (bucket.count >= 8) return json({ error: 'Too many login attempts. Try again later.' }, 429);
    const passphrase = String(body?.passphrase ?? "");
    if (passphrase !== ADMIN_PASSPHRASE) {
      bucket.count++;
      await new Promise((r) => setTimeout(r, 500));
      return json({ error: "Invalid passphrase" }, 401);
    }
    loginAttempts.delete(ip);
    const token = await createToken();
    return json({ token, expiresAt: Date.now() + TOKEN_TTL_MS });
  }

  // --- All other actions require valid token ---
  const token = req.headers.get("x-admin-token");
  const ok = await verifyToken(token);
  if (!ok) return json({ error: "Unauthorized" }, 401);

  if (action === "list_records") {
    const table = String(body?.table ?? "");
    if (!["contacts", "blog_posts", "testimonials"].includes(table)) return json({ error: "Unknown collection" }, 400);
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(100);
    if (error) return json({ error: error.message }, 500);
    return json({ records: data });
  }
  if (action === "save_record") {
    const table = String(body?.table ?? "");
    const columns: Record<string, string[]> = {
      blog_posts: ["title", "slug", "excerpt", "content", "featured_image", "tags", "published"],
      testimonials: ["name", "position", "company", "content", "avatar_url", "rating", "published"],
    };
    if (!columns[table]) return json({ error: "This collection is read-only or unknown" }, 400);
    const value = body?.value;
    if (!value || typeof value !== "object" || Array.isArray(value)) return json({ error: "Invalid record" }, 400);
    const row = Object.fromEntries(columns[table].filter(key => key in value).map(key => [key, value[key]]));
    if (typeof row.content !== "string" || !row.content.trim()) return json({ error: "Content is required" }, 400);
    const titleKey = table === "blog_posts" ? "title" : "name";
    if (typeof row[titleKey] !== "string" || !(row[titleKey] as string).trim()) return json({ error: "Title or name is required" }, 400);
    if (table === "blog_posts" && (typeof row.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug))) return json({ error: "Use a lowercase hyphenated slug" }, 400);
    if (table === 'testimonials' && row.rating !== undefined && (!Number.isInteger(row.rating) || Number(row.rating) < 1 || Number(row.rating) > 5)) return json({ error: 'Rating must be between 1 and 5' }, 400);
    if (table === 'blog_posts' && row.tags !== undefined && (!Array.isArray(row.tags) || !row.tags.every(tag => typeof tag === 'string'))) return json({ error: 'Tags must be a list of text values' }, 400);
    if (row.published !== undefined && typeof row.published !== "boolean") return json({ error: "Published must be true or false" }, 400);
    if (value.id) {
      const { error } = await supabase.from(table).update({ ...row, updated_at: new Date().toISOString() }).eq("id", value.id);
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }
    const { error } = await supabase.from(table).insert(row);
    return error ? json({ error: error.message }, 500) : json({ ok: true });
  }

  // --- LIST CONTENT KEYS ---
  if (action === "list") {
    const { data, error } = await supabase
      .from("site_content")
      .select("content_key, updated_at")
      .order("content_key");
    if (error) return json({ error: error.message }, 500);
    return json({ items: data });
  }

  // --- GET ONE CONTENT KEY---
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
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') return json({ error: 'A valid PDF is required' }, 400);
    const path = "cv/Abu_Sufyan_CV.pdf";
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, bytes, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (error) return json({ error: error.message }, 500);
    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
    await supabase
      .from("site_content")
      .upsert(
        { content_key: "cv_url", content_value: { url: pub.publicUrl, updatedAt: Date.now() } },
        { onConflict: "content_key" },
      );
    return json({ ok: true, url: pub.publicUrl });
  }

  // ─── PHOTO ACTIONS ─────────────────────────────────────────────────────────

  // --- UPLOAD PHOTO (base64 image) ---
  if (action === "upload_photo") {
    const base64     = String(body?.fileBase64 ?? "");
    const caption    = String(body?.caption ?? "").trim();
    const tagline    = String(body?.tagline ?? "").trim();
    const category   = String(body?.category ?? "gallery");
    const eventName  = String(body?.eventName ?? "").trim() || null;
    const mimeType   = String(body?.mimeType ?? "image/jpeg");

    if (!base64)       return json({ error: "Missing file" }, 400);
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return json({ error: "Invalid category" }, 400);
    }

    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    if (bytes.length > MAX_PHOTO_SIZE) {
      return json({ error: "File too large (max 5MB)" }, 400);
    }

    const validImage = mimeType === 'image/png' ? bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
      : mimeType === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : mimeType === 'image/webp' ? new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP' : false;
    if (!validImage) return json({ error: 'Upload a valid JPG, PNG, or WebP image' }, 400);
    if (!caption) return json({ error: 'Caption required' }, 400);
    const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1];
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const path     = `photos/${category}/${filename}`;

    const { error: uploadErr } = await supabase.storage
      .from("site-assets")
      .upload(path, bytes, { contentType: mimeType, upsert: false });
    if (uploadErr) return json({ error: uploadErr.message }, 500);

    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);

    // Get current max display_order for this category
    const { data: orderData } = await supabase
      .from("portfolio_photos")
      .select("display_order")
      .eq("category", category)
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (orderData?.display_order ?? 0) + 1;

    const { data: insertedRow, error: dbErr } = await supabase
      .from("portfolio_photos")
      .insert({
        url:           pub.publicUrl,
        caption,
        tagline,
        category,
        event_name:    eventName,
        display_order: nextOrder,
        published:     true,
      })
      .select()
      .single();
    if (dbErr) {
      // Cleanup orphan storage file if DB fails
      await supabase.storage.from("site-assets").remove([path]);
      return json({ error: dbErr.message }, 500);
    }

    return json({ ok: true, photo: insertedRow });
  }

  // --- LIST PHOTOS ---
  if (action === "list_photos") {
    const category = body?.category as string | undefined;
    let query = supabase
      .from("portfolio_photos")
      .select("*")
      .order("category")
      .order("display_order");
    if (category && ALLOWED_CATEGORIES.includes(category)) {
      query = query.eq("category", category);
    }
    const { data, error } = await query;
    if (error) return json({ error: error.message }, 500);
    return json({ photos: data });
  }

  // --- DELETE PHOTO ---
  if (action === "delete_photo") {
    const id = String(body?.id ?? "");
    if (!id) return json({ error: "Missing id" }, 400);

    // Fetch the row to get storage path (if it's from our storage)
    const { data: row, error: fetchErr } = await supabase
      .from("portfolio_photos")
      .select("url")
      .eq("id", id)
      .maybeSingle();
    if (fetchErr || !row) return json({ error: "Photo not found" }, 404);

    // Try to remove from storage if it's a Supabase Storage URL
    const urlObj = new URL(row.url, SUPABASE_URL);
    const storagePrefix = "/storage/v1/object/public/site-assets/";
    if (urlObj.pathname.startsWith(storagePrefix)) {
      const storagePath = urlObj.pathname.slice(storagePrefix.length);
      await supabase.storage.from("site-assets").remove([storagePath]);
    }

    const { error: delErr } = await supabase
      .from("portfolio_photos")
      .delete()
      .eq("id", id);
    if (delErr) return json({ error: delErr.message }, 500);
    return json({ ok: true });
  }

  // --- UPDATE PHOTO (caption, tagline, published) ---
  if (action === "update_photo") {
    const id = String(body?.id ?? "");
    if (!id) return json({ error: "Missing id" }, 400);
    const updates: Record<string, unknown> = {};
    if (body?.caption   !== undefined) updates.caption    = String(body.caption).trim();
    if (body?.tagline   !== undefined) updates.tagline    = String(body.tagline).trim();
    if (body?.published !== undefined) updates.published = Boolean(body.published);
    if (body?.display_order !== undefined) updates.display_order = Number(body.display_order);

    const { error } = await supabase
      .from("portfolio_photos")
      .update(updates)
      .eq("id", id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  return json({ error: "Unknown action" }, 400);
});

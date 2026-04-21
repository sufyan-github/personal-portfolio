import { supabase } from "@/integrations/supabase/client";

// Centralised reader for editable site content.
// Falls back to bundled JSON if the DB row doesn't exist yet.
export async function fetchContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await (supabase.from as any)("site_content")
      .select("content_value")
      .eq("content_key", key)
      .maybeSingle();
    if (error || !data) return fallback;
    return (data.content_value ?? fallback) as T;
  } catch {
    return fallback;
  }
}

// React hook
import { useEffect, useState } from "react";

export function useContent<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchContent<T>(key, fallback).then((v) => {
      if (!cancelled) {
        setValue(v);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { value, loading };
}

// Admin client — calls the edge function
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`;
const TOKEN_KEY = "admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setAdminToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function adminCall(body: Record<string, unknown>) {
  const token = getAdminToken();
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { "x-admin-token": token } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

export async function adminLogin(passphrase: string) {
  const r = await adminCall({ action: "login", passphrase });
  setAdminToken(r.token);
  return r;
}
export async function adminList() {
  return (await adminCall({ action: "list" })).items as { content_key: string; updated_at: string }[];
}
export async function adminGet(key: string) {
  return await adminCall({ action: "get", key });
}
export async function adminSave(key: string, value: unknown) {
  return await adminCall({ action: "save", key, value });
}
export async function adminUploadCV(file: File) {
  const buf = await file.arrayBuffer();
  const bin = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < bin.length; i++) str += String.fromCharCode(bin[i]);
  const base64 = btoa(str);
  return await adminCall({ action: "upload_cv", fileBase64: base64 });
}

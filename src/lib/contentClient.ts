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

// ─── Admin client — calls the edge function ────────────────────────────────
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

// ─── Content management ────────────────────────────────────────────────────
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

// ─── Photo management ──────────────────────────────────────────────────────
export type PhotoCategory = "gallery" | "hero" | "profile";

export interface PortfolioPhoto {
  id: string;
  url: string;
  caption: string;
  tagline: string;
  category: PhotoCategory;
  event_name: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function adminUploadPhoto(
  file: File,
  caption: string,
  tagline: string,
  category: PhotoCategory,
  eventName?: string,
): Promise<{ ok: boolean; photo: PortfolioPhoto }> {
  if (file.size > 5 * 1024 * 1024) throw new Error("File too large (max 5MB)");
  const base64 = await fileToBase64(file);
  return await adminCall({
    action:     "upload_photo",
    fileBase64: base64,
    mimeType:   file.type,
    caption,
    tagline,
    category,
    eventName:  eventName ?? "",
  }) as { ok: boolean; photo: PortfolioPhoto };
}

export async function adminListPhotos(category?: PhotoCategory): Promise<PortfolioPhoto[]> {
  const r = await adminCall({ action: "list_photos", ...(category ? { category } : {}) });
  return r.photos as PortfolioPhoto[];
}

export async function adminDeletePhoto(id: string): Promise<void> {
  await adminCall({ action: "delete_photo", id });
}

export async function adminUpdatePhoto(
  id: string,
  updates: Partial<Pick<PortfolioPhoto, "caption" | "tagline" | "published" | "display_order">>,
): Promise<void> {
  await adminCall({ action: "update_photo", id, ...updates });
}

// ─── Public photo fetcher (no auth needed — uses RLS public SELECT) ────────
export async function fetchPublicPhotos(category?: PhotoCategory): Promise<PortfolioPhoto[]> {
  try {
    let query = (supabase.from as any)("portfolio_photos")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error || !data) return [];
    return data as PortfolioPhoto[];
  } catch {
    return [];
  }
}

-- 1. Prevent listing all files in the public site-assets bucket.
-- Public URLs (/object/public/...) still serve files without RLS.
DROP POLICY IF EXISTS "Public can read site assets" ON storage.objects;

-- 2. Replace overly permissive `WITH CHECK (true)` insert policies with
--    validated versions that enforce length limits.
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contacts;
CREATE POLICY "Anyone can submit contact form"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(subject) BETWEEN 1 AND 200
  AND length(message) BETWEEN 1 AND 5000
);

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics;
CREATE POLICY "Anyone can insert analytics"
ON public.analytics
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(event_type) BETWEEN 1 AND 100
  AND (page_path IS NULL OR length(page_path) <= 500)
  AND (session_id IS NULL OR length(session_id) <= 100)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);

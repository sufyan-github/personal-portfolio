-- Portfolio Photos table for scalable image management
-- Supports: gallery photos, hero achievement slider, profile photos
-- Admin-managed via edge function with Supabase Storage

CREATE TABLE public.portfolio_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'gallery',  -- 'gallery' | 'hero' | 'profile'
  event_name TEXT,                            -- optional grouping by event
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_photos ENABLE ROW LEVEL SECURITY;

-- Public can read published photos
CREATE POLICY "Anyone can view published photos"
  ON public.portfolio_photos
  FOR SELECT
  USING (published = true);

-- Auto-update timestamp trigger
CREATE TRIGGER update_portfolio_photos_updated_at
  BEFORE UPDATE ON public.portfolio_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast category + order queries
CREATE INDEX idx_portfolio_photos_category ON public.portfolio_photos(category, display_order);
CREATE INDEX idx_portfolio_photos_published ON public.portfolio_photos(published, category);

-- Storage policy: allow admin (service role) to upload photos
CREATE POLICY "Admin can upload photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND (storage.foldername(name))[1] = 'photos');

CREATE POLICY "Admin can delete photos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'site-assets' AND (storage.foldername(name))[1] = 'photos');

-- Seed initial workshop photos (VU ML/AI Workshop Oct 30, 2025)
-- 6 images exist: vu-ml-workshop-1.jpg through vu-ml-workshop-6.jpg
-- workshop-5.jpg = Token of Appreciation award photo
INSERT INTO public.portfolio_photos (url, caption, tagline, category, event_name, display_order) VALUES
('/gallery/vu-ml-workshop-1.jpg', 'ML Workshop Trainers - VU CSE', 'Conducting Hands-on ML & AI Workshop at Varendra University as ML Instructor, AI Bangladesh', 'hero', 'VU ML Workshop 2025', 1),
('/gallery/vu-ml-workshop-2.jpg', 'Workshop at Dept. of CSE, Varendra University', 'Proud to deliver practical AI knowledge to the next generation of engineers', 'hero', 'VU ML Workshop 2025', 2),
('/gallery/vu-ml-workshop-3.jpg', 'Workshop Participants Group Photo', 'Empowering students with real-world Machine Learning and AI skills', 'hero', 'VU ML Workshop 2025', 3),
('/gallery/vu-ml-workshop-4.jpg', 'Certificate Distribution Ceremony', 'Recognizing outstanding performance and dedication of workshop participants', 'hero', 'VU ML Workshop 2025', 4),
('/gallery/vu-ml-workshop-5.jpg', 'Token of Appreciation - Varendra University', 'Honored with Token of Appreciation by Dept. of CSE, Varendra University for conducting ML & AI workshop', 'hero', 'VU ML Workshop 2025', 5),
('/gallery/vu-ml-workshop-6.jpg', 'VU Workshop Session', 'Hands-on Machine Learning training session at Varendra University', 'hero', 'VU ML Workshop 2025', 6),

-- Seed Tree Plantation Event photos
('/gallery/tree-plantation-1.jpg', 'Tree Plantation Event', 'Rooting for a Greener Future — Actively participating in campus tree plantation drive', 'hero', 'Tree Plantation Drive', 7),
('/gallery/tree-plantation-2.jpg', 'Planting Saplings', 'Building a sustainable environment through collective action and environmental awareness', 'hero', 'Tree Plantation Drive', 8),
('/gallery/tree-plantation-3.jpg', 'Volunteer Team Photo', 'The passionate volunteers behind the campus green initiative', 'hero', 'Tree Plantation Drive', 9),
('/gallery/tree-plantation-4.jpg', 'Community Engagement', 'Engaging with the community to promote environmental stewardship', 'hero', 'Tree Plantation Drive', 10),
('/gallery/tree-plantation-5.jpg', 'Nurturing Nature', 'Taking responsibility for our planet, one tree at a time', 'hero', 'Tree Plantation Drive', 11),

-- Gallery category (same photos in gallery section)
('/gallery/vu-ml-workshop-1.jpg', 'ML Workshop Trainers - VU CSE', 'Hands-on Workshop on Machine Learning and Artificial Intelligence — October 30, 2025', 'gallery', 'VU ML Workshop 2025', 1),
('/gallery/vu-ml-workshop-2.jpg', 'Dept. of CSE, Varendra University', 'Workshop conducted in collaboration with AI Bangladesh and CSE Department', 'gallery', 'VU ML Workshop 2025', 2),
('/gallery/vu-ml-workshop-3.jpg', 'Workshop Group Photo', 'Participants of the Hands-on ML & AI Workshop at Varendra University', 'gallery', 'VU ML Workshop 2025', 3),
('/gallery/vu-ml-workshop-4.jpg', 'Certificate Distribution', 'Presenting certificates to workshop participants', 'gallery', 'VU ML Workshop 2025', 4),
('/gallery/vu-ml-workshop-5.jpg', 'Token of Appreciation', 'Received Token of Appreciation from Dept. of CSE, Varendra University for ML & AI instruction', 'gallery', 'VU ML Workshop 2025', 5),
('/gallery/vu-ml-workshop-6.jpg', 'VU ML Workshop - Session Photo', 'Hands-on Machine Learning training session at Varendra University CSE Department', 'gallery', 'VU ML Workshop 2025', 6),

-- Gallery Tree Plantation
('/gallery/tree-plantation-1.jpg', 'Tree Plantation Drive', 'Actively participating in tree plantation event to advocate for environmental sustainability', 'gallery', 'Tree Plantation Drive', 7),
('/gallery/tree-plantation-2.jpg', 'Planting Seedlings', 'Hands-on participation in campus environmental initiatives', 'gallery', 'Tree Plantation Drive', 8),
('/gallery/tree-plantation-3.jpg', 'Team Volunteers', 'A group of dedicated individuals working towards a greener campus', 'gallery', 'Tree Plantation Drive', 9),
('/gallery/tree-plantation-4.jpg', 'Environmental Awareness', 'Spreading message of conservation through active participation', 'gallery', 'Tree Plantation Drive', 10),
('/gallery/tree-plantation-5.jpg', 'Campus Green Initiative', 'Nurturing newly planted trees for a sustainable future', 'gallery', 'Tree Plantation Drive', 11);

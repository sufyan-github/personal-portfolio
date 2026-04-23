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
('/gallery/vu-ml-workshop-1.jpg', 'ML Workshop Trainers - VU CSE', 'Conducting Hands-on ML & AI Workshop at Varendra University as ML Instructor, AI Bangladesh', 'hero', 'Machine Learning Instructional Sessions', 1),
('/gallery/vu-ml-workshop-2.jpg', 'Workshop at Dept. of CSE, Varendra University', 'Proud to deliver practical AI knowledge to the next generation of engineers', 'hero', 'Machine Learning Instructional Sessions', 2),
('/gallery/vu-ml-workshop-3.jpg', 'Workshop Participants Group Photo', 'Empowering students with real-world Machine Learning and AI skills', 'hero', 'Machine Learning Instructional Sessions', 3),
('/gallery/vu-ml-workshop-4.jpg', 'Certificate Distribution Ceremony', 'Recognizing outstanding performance and dedication of workshop participants', 'hero', 'Machine Learning Instructional Sessions', 4),
('/gallery/vu-ml-workshop-5.jpg', 'Token of Appreciation - Varendra University', 'Honored with Token of Appreciation by Dept. of CSE, Varendra University for conducting ML & AI workshop', 'hero', 'Machine Learning Instructional Sessions', 5),
('/gallery/vu-ml-workshop-6.jpg', 'VU Workshop Session', 'Hands-on Machine Learning training session at Varendra University', 'hero', 'Machine Learning Instructional Sessions', 6),

-- Seed Tree Plantation Event photos
('/gallery/tree-plantation-1.jpg', 'Tree Plantation Event', 'Rooting for a Greener Future — Actively participating in campus tree plantation drive', 'hero', 'Tree Plantation Drive', 7),
('/gallery/tree-plantation-2.jpg', 'Planting Saplings', 'Building a sustainable environment through collective action and environmental awareness', 'hero', 'Tree Plantation Drive', 8),
('/gallery/tree-plantation-3.jpg', 'Volunteer Team Photo', 'The passionate volunteers behind the campus green initiative', 'hero', 'Tree Plantation Drive', 9),
('/gallery/tree-plantation-4.jpg', 'Community Engagement', 'Engaging with the community to promote environmental stewardship', 'hero', 'Tree Plantation Drive', 10),
('/gallery/tree-plantation-5.jpg', 'Nurturing Nature', 'Taking responsibility for our planet, one tree at a time', 'hero', 'Tree Plantation Drive', 11),

-- Gallery category (same photos in gallery section)
('/gallery/vu-ml-workshop-1.jpg', 'ML Workshop Trainers - VU CSE', 'Hands-on Workshop on Machine Learning and Artificial Intelligence — October 30, 2025', 'gallery', 'Machine Learning Instructional Sessions', 1),
('/gallery/vu-ml-workshop-2.jpg', 'Dept. of CSE, Varendra University', 'Workshop conducted in collaboration with AI Bangladesh and CSE Department', 'gallery', 'Machine Learning Instructional Sessions', 2),
('/gallery/vu-ml-workshop-3.jpg', 'Workshop Group Photo', 'Participants of the Hands-on ML & AI Workshop at Varendra University', 'gallery', 'Machine Learning Instructional Sessions', 3),
('/gallery/vu-ml-workshop-4.jpg', 'Certificate Distribution', 'Presenting certificates to workshop participants', 'gallery', 'Machine Learning Instructional Sessions', 4),
('/gallery/vu-ml-workshop-5.jpg', 'Token of Appreciation', 'Received Token of Appreciation from Dept. of CSE, Varendra University for ML & AI instruction', 'gallery', 'Machine Learning Instructional Sessions', 5),
('/gallery/vu-ml-workshop-6.jpg', 'VU ML Workshop - Session Photo', 'Hands-on Machine Learning training session at Varendra University CSE Department', 'gallery', 'Machine Learning Instructional Sessions', 6),

-- Gallery Tree Plantation
('/gallery/tree-plantation-1.jpg', 'Tree Plantation Drive', 'Actively participating in tree plantation event to advocate for environmental sustainability', 'gallery', 'Tree Plantation Drive', 7),
('/gallery/tree-plantation-2.jpg', 'Planting Seedlings', 'Hands-on participation in campus environmental initiatives', 'gallery', 'Tree Plantation Drive', 8),
('/gallery/tree-plantation-3.jpg', 'Team Volunteers', 'A group of dedicated individuals working towards a greener campus', 'gallery', 'Tree Plantation Drive', 9),
('/gallery/tree-plantation-4.jpg', 'Environmental Awareness', 'Spreading message of conservation through active participation', 'gallery', 'Tree Plantation Drive', 10),
('/gallery/tree-plantation-5.jpg', 'Campus Green Initiative', 'Nurturing newly planted trees for a sustainable future', 'gallery', 'Tree Plantation Drive', 11),

-- Gallery Pedal for Planet
('/gallery/pedal-for-planet-1.jpg', 'Pedal for Planet Event', 'Cycling for a greener world and raising awareness about environmental issues', 'gallery', 'Pedal for Planet', 12),
('/gallery/pedal-for-planet-2.jpg', 'Community Cycling', 'Promoting sustainable transportation through collective cycling initiatives', 'gallery', 'Pedal for Planet', 13),
('/gallery/pedal-for-planet-3.jpg', 'Environmental Awareness Drive', 'Spreading awareness about climate change and environmental sustainability', 'gallery', 'Pedal for Planet', 14),

-- Gallery Social/Volunteering
('/gallery/vbd-volunteers-1.jpg', 'VBD Volunteers Meeting', 'Team members celebrating Great Kindness Day and discussing social impact', 'gallery', 'VBD Meetup', 15),
('/gallery/vbd-volunteers-2.jpg', 'Social Project Discussion', 'Volunteers for Bangladesh (VBD) team meeting at the regional office', 'gallery', 'VBD Meetup', 16),

-- Gallery RUET ML Session
('/gallery/ruet-ml-session-1.jpg', 'RUET Computing Society ML Session', 'Machine Learning instruction session conducted for students at RUET Computing Society', 'gallery', 'Machine Learning Instructional Sessions', 17),
('/gallery/ruet-ml-session-2.jpg', 'RUET ML Hall Session', 'Engaging audience in a deep-dive session on AI and ML fundamentals', 'gallery', 'Machine Learning Instructional Sessions', 18),
('/gallery/ruet-ml-session-3.jpg', 'Podium Session - RUET', 'Sharing practical ML engineering insights at RUET Computing Society', 'gallery', 'Machine Learning Instructional Sessions', 19),

-- Gallery RUET CS Orientation
('/gallery/ruet-cs-orientation-1.jpg', 'Crest Recognition - Orientation', 'Receiving crest of appreciation during the orientation program', 'gallery', 'RUET CS Orientation 2025', 20),
('/gallery/ruet-cs-orientation-2.jpg', 'Recognition of Excellence', 'Sharing moments of achievement with society members and speakers', 'gallery', 'RUET CS Orientation 2025', 21),
('/gallery/ruet-cs-orientation-3.jpg', 'Presidential Speech', 'Addressing the newly joined members of the RUET Computing Society', 'gallery', 'RUET CS Orientation 2025', 22),
('/gallery/ruet-cs-orientation-4.jpg', 'Vision & Strategy', 'Detailing the missions and upcoming roadmap of the RUET Computing Society', 'gallery', 'RUET CS Orientation 2025', 23),
('/gallery/ruet-cs-orientation-5.jpg', 'RUET CS orientation Group Photo', 'The vibrant community of the RUET Computing Society at the 2025 Orientation', 'gallery', 'RUET CS Orientation 2025', 24),

-- Hero Slider highlight for President role
('/gallery/ruet-cs-orientation-5.jpg', 'President – RUET Computing Society', 'Presiding over the Members Orientation for tech community growth', 'hero', 'RUET CS Orientation 2025', 12);

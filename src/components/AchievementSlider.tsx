import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, Pause, Play } from "lucide-react";
import { fetchPublicPhotos, PortfolioPhoto } from "@/lib/contentClient";

// Static fallback slides if DB is empty
const FALLBACK_SLIDES: Omit<PortfolioPhoto, "id" | "created_at" | "updated_at">[] = [
  {
    url: "/gallery/vu-ml-workshop-1.jpg",
    caption: "ML Workshop Trainers – VU CSE",
    tagline: "Conducting Hands-on ML & AI Workshop at Varendra University as ML Instructor, AI Bangladesh",
    category: "hero",
    event_name: "VU ML Workshop 2025",
    display_order: 1,
    published: true,
  },
  {
    url: "/gallery/vu-ml-workshop-2.jpg",
    caption: "Dept. of CSE, Varendra University",
    tagline: "Proud to deliver practical AI knowledge to the next generation of engineers",
    category: "hero",
    event_name: "VU ML Workshop 2025",
    display_order: 2,
    published: true,
  },
  {
    url: "/gallery/vu-ml-workshop-3.jpg",
    caption: "Workshop Participants Group Photo",
    tagline: "Empowering students with real-world Machine Learning and AI skills",
    category: "hero",
    event_name: "VU ML Workshop 2025",
    display_order: 3,
    published: true,
  },
  {
    url: "/gallery/vu-ml-workshop-4.jpg",
    caption: "Certificate Distribution Ceremony",
    tagline: "Recognizing outstanding performance and dedication of workshop participants",
    category: "hero",
    event_name: "VU ML Workshop 2025",
    display_order: 4,
    published: true,
  },
  {
    url: "/gallery/vu-ml-workshop-5.jpg",
    caption: "Token of Appreciation – Varendra University",
    tagline: "Honored with Token of Appreciation by Dept. of CSE, Varendra University for delivering ML & AI workshop",
    category: "hero",
    event_name: "VU ML Workshop 2025",
    display_order: 5,
    published: true,
  },
  {
    url: "/gallery/vu-ml-workshop-6.jpg",
    caption: "VU Workshop Session",
    tagline: "Hands-on Machine Learning training session at Varendra University",
    category: "hero",
    event_name: "VU ML Workshop 2025",
    display_order: 6,
    published: true,
  },
  {
    url: "/gallery/tree-plantation-1.jpg",
    caption: "Tree Plantation Event",
    tagline: "Rooting for a Greener Future — Actively participating in campus tree plantation drive",
    category: "hero",
    event_name: "Tree Plantation Drive",
    display_order: 7,
    published: true,
  },
  {
    url: "/gallery/tree-plantation-2.jpg",
    caption: "Planting Saplings",
    tagline: "Building a sustainable environment through collective action and environmental awareness",
    category: "hero",
    event_name: "Tree Plantation Drive",
    display_order: 8,
    published: true,
  },
  {
    url: "/gallery/tree-plantation-3.jpg",
    caption: "Volunteer Team Photo",
    tagline: "The passionate volunteers behind the campus green initiative",
    category: "hero",
    event_name: "Tree Plantation Drive",
    display_order: 9,
    published: true,
  },
  {
    url: "/gallery/tree-plantation-4.jpg",
    caption: "Community Engagement",
    tagline: "Engaging with the community to promote environmental stewardship",
    category: "hero",
    event_name: "Tree Plantation Drive",
    display_order: 10,
    published: true,
  },
  {
    url: "/gallery/tree-plantation-5.jpg",
    caption: "Nurturing Nature",
    tagline: "Taking responsibility for our planet, one tree at a time",
    category: "hero",
    event_name: "Tree Plantation Drive",
    display_order: 11,
    published: true,
  },
  {
    url: "/gallery/ruet-cs-orientation-5.jpg",
    caption: "President – RUET Computing Society",
    tagline: "Presiding over the Members Orientation program, welcoming 100+ new tech enthusiasts to the society",
    category: "hero",
    event_name: "RUET CS Orientation 2025",
    display_order: 12,
    published: true,
  },
];

const SLIDE_INTERVAL = 5000; // 5 seconds

const AchievementSlider: React.FC = () => {
  const [slides, setSlides] = useState<(PortfolioPhoto | typeof FALLBACK_SLIDES[0])[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  // Load from DB (falls back to static if empty)
  useEffect(() => {
    fetchPublicPhotos("hero").then((photos) => {
      if (photos.length > 0) setSlides(photos);
    });
  }, []);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  const slide = slides[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5, ease: "easeIn" },
    }),
  };

  return (
    <div className="w-full">
      {/* Slider */}
      <motion.div
        className="relative mx-auto w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Main slide area */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gradient-to-br from-card/80 to-card/40 ring-2 ring-primary/20 shadow-2xl shadow-primary/30">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {!imgErrors.has(current) ? (
                <img
                  src={slide.url}
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                  onError={() => setImgErrors((s) => new Set(s).add(current))}
                />
              ) : (
                /* Fallback gradient card if image fails */
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                  <Trophy className="h-20 w-20 text-primary/40" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

              {/* Caption text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.event_name && (
                    <span className="inline-block mb-2 px-3 py-1 rounded-full bg-primary/30 backdrop-blur-sm text-primary text-xs font-semibold border border-primary/40">
                      {slide.event_name}
                    </span>
                  )}
                  <h3 className="text-white text-lg sm:text-2xl font-bold mb-1 leading-tight drop-shadow-lg">
                    {slide.caption}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl drop-shadow">
                    {slide.tagline}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next buttons */}
          <button
            onClick={prev}
            aria-label="Previous achievement"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:scale-110 transition-all border border-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next achievement"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:scale-110 transition-all border border-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pause / play */}
          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all border border-white/10"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Dot indicators + thumbnails row */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          {slides.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              className={`relative rounded-full transition-all duration-300 overflow-hidden ${
                i === current
                  ? "w-8 h-3 bg-primary shadow-glow ring-2 ring-primary/50"
                  : "w-3 h-3 bg-white/30 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Progress bar */}
        {!paused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: SLIDE_INTERVAL / 1000, ease: "linear" }}
            key={`progress-${current}`}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AchievementSlider;

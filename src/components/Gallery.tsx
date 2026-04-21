import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Camera,
  Calendar,
  MapPin,
  Images,
  Sparkles,
} from "lucide-react";
import { fetchPublicPhotos, PortfolioPhoto } from "@/lib/contentClient";
import galleryFallback from "@/data/gallery.json";

// ─── Types ─────────────────────────────────────────────────────────────────

type GalleryItem = {
  id: string;
  url: string;
  caption: string;
  tagline: string;
  category: string;
  event_name: string | null;
};

// ─── Static fallback derived from gallery.json events ─────────────────────

function buildFallbackItems(): GalleryItem[] {
  const items: GalleryItem[] = [];
  galleryFallback.events.forEach((event, ei) => {
    event.images.forEach((img, ii) => {
      items.push({
        id:         `static-${ei}-${ii}`,
        url:        img,
        caption:    event.title,
        tagline:    event.description,
        category:   event.category,
        event_name: event.title,
      });
    });
  });
  return items;
}

// ─── Category colour helpers ───────────────────────────────────────────────

const CATEGORY_COLOURS: Record<string, string> = {
  Workshop:   "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Conference: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Award:      "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  Exhibition: "bg-green-500/20 text-green-300 border-green-500/40",
  Hackathon:  "bg-red-500/20 text-red-300 border-red-500/40",
  gallery:    "bg-primary/20 text-primary border-primary/40",
  hero:       "bg-accent/20 text-accent border-accent/40",
};
const catColour = (c: string) =>
  CATEGORY_COLOURS[c] ?? "bg-muted/20 text-muted-foreground border-border";

// ─── Lightbox ──────────────────────────────────────────────────────────────

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, index, onClose, onPrev, onNext }) => {
  const item = items[index];

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 text-white/80 text-sm backdrop-blur-sm">
        {index + 1} / {items.length}
      </div>

      {/* Image + caption */}
      <motion.div
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={item.url}
            alt={item.caption}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Caption panel */}
        <div className="w-full max-w-2xl bg-black/60 backdrop-blur rounded-xl p-4 text-center">
          <h3 className="text-white font-bold text-lg mb-1">{item.caption}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{item.tagline}</p>
          {item.event_name && (
            <Badge className={`mt-2 text-xs ${catColour(item.category)} border`}>
              {item.event_name}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Prev / Next */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </motion.div>
  );
};

// ─── Gallery Card ──────────────────────────────────────────────────────────

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  // Varying heights for masonry feel
  const heightClass = index % 5 === 0
    ? "h-72"
    : index % 3 === 0
    ? "h-56"
    : "h-64";

  return (
    <motion.div
      className={`relative group cursor-pointer rounded-2xl overflow-hidden ${heightClass} bg-gradient-to-br from-primary/10 to-accent/10`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      onClick={onClick}
    >
      {/* Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 to-muted/20" />
      )}

      {/* Image */}
      {!error ? (
        <img
          src={item.url}
          alt={item.caption}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
          <Camera className="h-12 w-12 text-primary/40" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hover content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
          {item.caption}
        </h3>
        <p className="text-white/70 text-xs line-clamp-2 leading-relaxed">
          {item.tagline}
        </p>
        <Badge className={`mt-2 w-fit text-xs ${catColour(item.category)} border`}>
          {item.event_name || item.category}
        </Badge>
      </div>

      {/* Zoom icon top-right */}
      <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
        <ZoomIn className="h-4 w-4" />
      </div>
    </motion.div>
  );
};

// ─── Main Gallery ──────────────────────────────────────────────────────────

const Gallery: React.FC = () => {
  const [allItems, setAllItems]       = useState<GalleryItem[]>([]);
  const [activeCategory, setCategory] = useState("All");
  const [lightboxIdx, setLightbox]    = useState<number | null>(null);

  // Load photos from DB (or fall back to static)
  useEffect(() => {
    fetchPublicPhotos("gallery").then((photos) => {
      if (photos.length > 0) {
        setAllItems(
          photos.map((p: PortfolioPhoto) => ({
            id:         p.id,
            url:        p.url,
            caption:    p.caption,
            tagline:    p.tagline,
            category:   p.event_name ?? p.category,
            event_name: p.event_name,
          })),
        );
      } else {
        setAllItems(buildFallbackItems());
      }
    });
  }, []);

  const categories   = ["All", ...Array.from(new Set(allItems.map((i) => i.event_name ?? i.category).filter(Boolean)))];
  const filtered     = activeCategory === "All" ? allItems : allItems.filter((i) => (i.event_name ?? i.category) === activeCategory);
  const lightboxItems = filtered;

  const openLightbox  = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevLight     = useCallback(() => setLightbox((i) => i !== null ? (i - 1 + lightboxItems.length) % lightboxItems.length : null), [lightboxItems.length]);
  const nextLight     = useCallback(() => setLightbox((i) => i !== null ? (i + 1) % lightboxItems.length : null), [lightboxItems.length]);

  return (
    <section id="gallery" className="py-20 relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 14, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gallery & Events
            </h2>
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Moments from workshops, conferences, and technology community events
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="flex justify-center gap-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">{allItems.length}</div>
            <div className="text-xs text-muted-foreground">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">{categories.length - 1}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">3+</div>
            <div className="text-xs text-muted-foreground">Years Active</div>
          </div>
        </motion.div>

        {/* Category filter */}
        {categories.length > 1 && (
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-lg shadow-primary/30"
                    : "bg-card/60 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-primary backdrop-blur-sm"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Masonry grid */}
        {filtered.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((item, idx) => (
              <div key={item.id} className="break-inside-avoid mb-4">
                <GalleryCard
                  item={item}
                  index={idx}
                  onClick={() => openLightbox(idx)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Images className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">No photos in this category yet</p>
          </div>
        )}

        {/* Caption */}
        <motion.p
          className="text-center text-muted-foreground text-sm mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Camera className="inline h-4 w-4 mr-1 mb-0.5" />
          Click any photo to view full size
        </motion.p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            items={lightboxItems}
            index={lightboxIdx}
            onClose={closeLightbox}
            onPrev={prevLight}
            onNext={nextLight}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;

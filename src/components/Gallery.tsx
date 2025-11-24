import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import galleryData from "@/data/gallery.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  images: string[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Conference":
      return "bg-primary/20 text-primary border-primary/50";
    case "Workshop":
      return "bg-secondary/20 text-secondary border-secondary/50";
    case "Exhibition":
      return "bg-accent/20 text-accent border-accent/50";
    case "Hackathon":
      return "bg-purple-500/20 text-purple-300 border-purple-500/50";
    default:
      return "bg-muted/20 text-muted-foreground border-border";
  }
};

const Gallery = () => {
  const events = galleryData.events as Event[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality - wait for all images to cycle before moving to next event
  useEffect(() => {
    if (isHovered || events.length === 0) {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
      return;
    }

    // Calculate delay based on number of images in current event
    // Each image shows for 3 seconds, so total delay = images * 3000ms
    const currentEvent = events[currentIndex];
    const imageCount = currentEvent?.images?.length || 1;
    const totalDelay = imageCount * 3000; // 3 seconds per image

    autoPlayRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, totalDelay);

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [isHovered, events.length, currentIndex, events]);

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const getVisibleEvents = () => {
    const visible = [];
    const totalEvents = events.length;
    
    // Show 5 events: 2 left + 1 center + 2 right
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalEvents) % totalEvents;
      visible.push({
        event: events[index],
        position: i,
        index
      });
    }
    return visible;
  };

  return (
    <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-40 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {galleryData.title}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {galleryData.subtitle}
          </p>
        </motion.div>

        {/* 3D Curved Carousel */}
        <div 
          className="relative h-[600px] flex items-center justify-center perspective-1000 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {getVisibleEvents().map(({ event, position, index }) => {
              const isCenter = position === 0;
              const isVisible = Math.abs(position) <= 2;
              
              if (!isVisible) return null;

              // 3D Curved positioning
              const angle = position * 28; // Degrees
              const radius = 350; // Distance from center
              const translateX = Math.sin((angle * Math.PI) / 180) * radius;
              const translateZ = Math.cos((angle * Math.PI) / 180) * radius - radius;
              const rotateY = -angle;
              const scale = isCenter ? 1 : 0.8 - Math.abs(position) * 0.08;
              const opacity = isCenter ? 1 : 0.65 - Math.abs(position) * 0.12;
              
              return (
                <div
                  key={`${event.id}-${index}`}
                  className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                    isCenter ? 'z-30' : 'z-10'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                  }}
                  onClick={() => {
                    if (!isCenter) {
                      if (position > 0) {
                        nextEvent();
                      } else {
                        prevEvent();
                      }
                    }
                  }}
                >
                  <Card className={`w-[420px] h-[520px] overflow-hidden bg-card/80 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 flex flex-col ${
                    isCenter ? 'shadow-2xl shadow-primary/30' : 'shadow-lg shadow-black/10'
                  }`}>
                    {/* Title and Badge */}
                    <div className="p-4 pb-2 flex items-start justify-between border-b border-border/50">
                      <h3 className={`${isCenter ? 'text-lg' : 'text-base'} font-bold text-foreground line-clamp-2 flex-1 pr-2`}>
                        {event.title}
                      </h3>
                      <Badge className={`${getCategoryColor(event.category)} border-2 shrink-0`}>
                        {event.category}
                      </Badge>
                    </div>

                    {/* Nested Images Carousel */}
                    <div className="relative w-full flex-shrink-0">
                      <Carousel
                        opts={{
                          align: "center",
                          loop: true,
                        }}
                        plugins={[
                          Autoplay({
                            delay: 3000,
                            stopOnInteraction: false,
                          }),
                        ]}
                        className="w-full"
                      >
                        <CarouselContent>
                          {event.images.map((image, idx) => (
                            <CarouselItem key={idx}>
                              <div className="relative w-full h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"
                                  animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.05, 1],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-primary/40 font-semibold text-sm">
                                  Photo {idx + 1} of {event.images.length}
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {isCenter && (
                          <>
                            <CarouselPrevious className="left-2 h-7 w-7 border-primary/50 bg-background/90 backdrop-blur-sm hover:bg-primary/20" />
                            <CarouselNext className="right-2 h-7 w-7 border-primary/50 bg-background/90 backdrop-blur-sm hover:bg-primary/20" />
                          </>
                        )}
                      </Carousel>
                    </div>

                    {/* Event Info */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <p className={`text-muted-foreground ${isCenter ? 'text-sm' : 'text-xs'} leading-relaxed line-clamp-3 mb-4 flex-1`}>
                        {event.description}
                      </p>

                      <div className={`flex flex-col gap-2 ${isCenter ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
                        <div className="flex items-center gap-2">
                          <Calendar className={`${isCenter ? 'h-4 w-4' : 'h-3 w-3'} text-primary shrink-0`} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className={`${isCenter ? 'h-4 w-4' : 'h-3 w-3'} text-primary shrink-0`} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevEvent}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextEvent}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-1">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

        {/* Event count */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {events.length} events
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;

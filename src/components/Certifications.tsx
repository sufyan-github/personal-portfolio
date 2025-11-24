import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Building, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import rawCerts from "@/data/certifications.json";

type RawCert = {
  id: number | string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  credentialId?: string;
  verificationUrl?: string;
  skills?: string[];
  image?: string;
  images?: { center?: string };
};

type Cert = Omit<RawCert, "image" | "images"> & { images: { center: string } };

const PLACEHOLDER = "/certs/placeholder.png";

const Certifications: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const certifications = React.useMemo<Cert[]>(
    () =>
      (rawCerts as RawCert[]).map((c) => ({
        ...c,
        images: {
          center: c.images?.center ?? c.image ?? PLACEHOLDER,
        },
      })),
    []
  );

  // Auto-play functionality
  useEffect(() => {
    if (isHovered || certifications.length === 0) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certifications.length);
    }, 3000); // 3 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, certifications.length]);

  const nextCert = () => {
    setCurrentIndex((prev) => (prev + 1) % certifications.length);
  };

  const prevCert = () => {
    setCurrentIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
  };

  const getVisibleCerts = () => {
    const visible = [];
    const totalCerts = certifications.length;
    
    // Show 5 certificates: 2 left + 1 center + 2 right
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalCerts) % totalCerts;
      visible.push({
        cert: certifications[index],
        position: i,
        index
      });
    }
    return visible;
  };

  if (!certifications.length) return null;

  return (
    <section id="certifications" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Certifications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional certifications and continuous learning achievements
          </p>
        </div>

        {/* 3D Curved Carousel */}
        <div 
          className="relative h-[600px] flex items-center justify-center perspective-1000 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {getVisibleCerts().map(({ cert, position, index }) => {
              const isCenter = position === 0;
              const isVisible = Math.abs(position) <= 2;
              
              if (!isVisible) return null;

              // 3D Curved positioning with larger cards
              const angle = position * 28; // Degrees
              const radius = 350; // Distance from center (increased for larger cards)
              const translateX = Math.sin((angle * Math.PI) / 180) * radius;
              const translateZ = Math.cos((angle * Math.PI) / 180) * radius - radius;
              const rotateY = -angle;
              const scale = isCenter ? 1 : 0.8 - Math.abs(position) * 0.08;
              const opacity = isCenter ? 1 : 0.65 - Math.abs(position) * 0.12;
              
              return (
                <div
                  key={`${cert.id}-${index}`}
                  className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                    isCenter ? 'z-30' : 'z-10'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                  }}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedCert(cert);
                    } else if (position > 0) {
                      nextCert();
                    } else {
                      prevCert();
                    }
                  }}
                >
                  <Card className={`w-[420px] h-[520px] hover-lift glow-border bg-card/50 backdrop-blur-sm transition-all duration-300 ${
                    isCenter ? 'shadow-2xl shadow-primary/20' : 'shadow-lg shadow-black/10'
                  }`}>
                    <CardHeader className="text-center pb-2">
                      <div className="flex justify-center mb-2">
                        <Award className={`${isCenter ? 'h-6 w-6' : 'h-5 w-5'} text-primary`} />
                      </div>
                      <CardTitle className={`${isCenter ? 'text-lg' : 'text-base'} leading-tight line-clamp-2 gradient-text font-display`}>
                        {cert.title}
                      </CardTitle>
                      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {cert.issuer}
                        </span>
                        <span className="inline-flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {cert.date}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4">
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border mx-auto mb-3">
                        <img
                          src={cert.images.center}
                          alt={`${cert.title} certificate`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER;
                          }}
                        />
                      </div>

                      {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1">
                          {cert.skills.slice(0, isCenter ? 3 : 2).map((skill, i) => (
                            <Badge
                              key={`${cert.id}-${skill}-${i}`}
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary border-primary/20"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {cert.skills.length > (isCenter ? 3 : 2) && (
                            <Badge variant="secondary" className="text-xs">
                              +{cert.skills.length - (isCenter ? 3 : 2)} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevCert}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextCert}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-1">
          {certifications.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

        {/* Certificate count */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {certifications.length} certificates
          </p>
        </div>

        {/* Fullscreen Dialog */}
        <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
          <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0">
            {selectedCert && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{selectedCert.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <span className="inline-flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        {selectedCert.issuer}
                      </span>
                      <span className="inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {selectedCert.date}
                      </span>
                      {selectedCert.credentialId && (
                        <Badge variant="secondary" className="border-primary/20">
                          ID: {selectedCert.credentialId}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex-1 p-6 overflow-auto">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={selectedCert.images.center}
                      alt={`${selectedCert.title} certificate`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </div>
                </div>

                <div className="p-6 border-t bg-muted/20">
                  {selectedCert.description && (
                    <p className="text-muted-foreground mb-4 max-w-3xl">
                      {selectedCert.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 items-center">
                    {Array.isArray(selectedCert.skills) && selectedCert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCert.skills.map((skill, i) => (
                          <Badge
                            key={`${selectedCert.id}-${skill}-${i}`}
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {selectedCert.verificationUrl && selectedCert.verificationUrl !== "#" && (
                      <Button
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10 ml-auto"
                        onClick={() => window.open(selectedCert.verificationUrl!, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verify Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

    </section>
  );
};

export default Certifications;
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Building, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import rawCertsFallback from "@/data/certifications.json";
import { useContent } from "@/lib/contentClient";

type RawCert = {
  id: number | string;
  title: string;
  issuer: string;
  date: string;
  kind?: string;
  description?: string;
  credentialId?: string;
  verificationUrl?: string;
  skills?: string[];
  image?: string;
  images?: { center?: string };
};

type Cert = Omit<RawCert, "image" | "images"> & { images: { center: string } };

const PLACEHOLDER = "/placeholder.svg";

const Certifications: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All");
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { value: rawCerts } = useContent<RawCert[]>("certifications", rawCertsFallback as RawCert[]);
  const certifications = React.useMemo<Cert[]>(
    () =>
      (rawCerts as RawCert[]).map((c) => ({
        ...c,
        images: {
          center: c.images?.center ?? c.image ?? PLACEHOLDER,
        },
      })),
    [rawCerts]
  );

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || isHovered || selectedCert || window.matchMedia("(prefers-reduced-motion: reduce)").matches || certifications.length === 0) {
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
  }, [isPaused, isHovered, selectedCert, certifications.length]);

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

  if (!certifications.length) return (
    <section id="certifications" className="py-20 text-center">
      <h2 className="text-4xl font-bold mb-4 gradient-text">Certifications</h2>
      <p className="text-muted-foreground">Certificates will appear here when published.</p>
    </section>
  );

  return (
    <section id="certifications" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Certifications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Course completions, training, recognition and participation — accurately labelled.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-semibold mb-4">Browse all {certifications.length} records</h3>
          <p className="text-sm text-muted-foreground mb-5">Repeated copies and repeat completions of the same course are consolidated. “Not stated” means the source gives no date. Verification links appear only where supplied by the issuer.</p>
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-5">
            <label className="text-sm">Search credentials
              <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Title, issuer or skill" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <label className="text-sm">Record type
              <select value={kind} onChange={e => setKind(e.target.value)} className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2">
                {["All", "Course completion", "Recognition", "Participation", "Assessment", "Registration"].map(k => <option key={k}>{k}</option>)}
              </select>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[36rem] overflow-y-auto p-1" aria-label="Credential catalogue" tabIndex={0}>
            {certifications.filter(c => (kind === "All" || c.kind === kind) && `${c.title} ${c.issuer} ${c.skills?.join(" ")}`.toLowerCase().includes(query.toLowerCase())).map(c => (
              <button key={c.id} onClick={() => setSelectedCert(c)} className="text-left rounded-lg border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
                <Badge variant="secondary" className="mb-2">{c.kind ?? "Course completion"}</Badge>
                <h4 className="font-semibold">{c.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{c.issuer}</p>
                <p className="text-xs text-muted-foreground mt-2">{c.date} · View details &amp; preview</p>
              </button>
            ))}
          </div>
          {!certifications.some(c => (kind === "All" || c.kind === kind) && `${c.title} ${c.issuer} ${c.skills?.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && <p role="status" className="p-5 text-muted-foreground">No credentials match your search.</p>}
        </div>

        {/* 3D Curved Carousel */}
        <div 
          className="relative h-[600px] flex items-center justify-center perspective-1000 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsHovered(true)}
          onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsHovered(false); }}
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
                  key={`${cert.id}-${position}`}
                  role="button" tabIndex={0}
                  aria-label={`View certificate: ${cert.title}`}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setCurrentIndex(index); setSelectedCert(cert); }
                  }}
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
                  <Card className={`w-[min(420px,calc(100vw-3rem))] h-[520px] hover-lift glow-border bg-card/50 backdrop-blur-sm transition-all duration-300 ${
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
            aria-label="Previous certificate"
            onClick={prevCert}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            aria-label="Next certificate"
            onClick={nextCert}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <Button variant="outline" aria-pressed={isPaused} onClick={() => setIsPaused(p => !p)}>
            {isPaused ? "Resume certificate autoplay" : "Pause certificate autoplay"}
          </Button>
        </div>
        {/* Dots indicator */}
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {certifications.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to certificate ${index + 1}`}
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
              <div className="flex flex-col h-full min-h-0 overflow-hidden">
                <div className="flex items-start justify-between gap-3 p-4 border-b shrink-0 max-h-[30vh] overflow-auto">
                  <div className="flex-1 pr-6">
                    <DialogTitle className="text-2xl font-bold mb-2">{selectedCert.title}</DialogTitle>
                    <DialogDescription className="sr-only">Certificate details and full-size image</DialogDescription>
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

                </div>
                
                <div className="flex-1 min-h-0 p-4 overflow-auto">
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

                <div className="p-4 border-t bg-muted/20 max-h-[28vh] overflow-auto shrink-0">
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
                        onClick={() => window.open(selectedCert.verificationUrl!, "_blank", "noopener,noreferrer")}
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
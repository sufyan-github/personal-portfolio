import { useEffect, useState } from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "academic", label: "Academic" },
  { id: "experience", label: "Experience" },
  { id: "industrial-attachment", label: "Training" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "memberships", label: "Memberships" },
  { id: "coding", label: "Coding" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollHeight) * 100;
      setProgress(progress);

      // Find active section
      const sectionElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      const viewportCenter = window.scrollY + window.innerHeight / 2;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= viewportCenter) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-muted/20">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-150 ease-out shadow-glow"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Section Indicators - Right Side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${section.label}`}
          >
            {/* Section Label */}
            <span
              className={`absolute right-8 px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                index === activeSection
                  ? "opacity-100 translate-x-0 bg-primary text-primary-foreground shadow-lg"
                  : "opacity-0 translate-x-2 bg-muted text-muted-foreground group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {section.label}
            </span>

            {/* Dot Indicator */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeSection
                  ? "bg-primary scale-150 shadow-glow"
                  : index < activeSection
                  ? "bg-primary/50 scale-100"
                  : "bg-muted-foreground/30 scale-100 group-hover:bg-primary/50 group-hover:scale-125"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
};

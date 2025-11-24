import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, Download, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/data/translations.json";

// =====================================================
// JSON‑DRIVEN NAVIGATION WITH QUALITY‑OF‑LIFE UPGRADES
// Create: src/data/navigation.json (see example below)
// Ensure tsconfig: "resolveJsonModule": true, "esModuleInterop": true
// =====================================================

import navData from "@/data/navigation.json";

type NavItem = { name: string; href: string };

type NavConfig = {
  siteTitle: string;
  items: NavItem[];
  cvUrl?: string; // when provided, renders CV buttons
  cvFileName?: string; // used for download attr
  enableActiveHighlight?: boolean; // default true
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Navigation: React.FC = () => {
  const cfg = navData as NavConfig;
  const { language } = useLanguage();
  const t = (translations as any)[language];
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("#home");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items with translations
  const navItems = [
    { name: t.nav.home, href: "#home" },
    { name: t.nav.about, href: "#about" },
    { name: t.nav.academic, href: "#academic" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.industrial, href: "#industrial-attachment" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.projects, href: "#projects" },
    { name: t.nav.research, href: "#research" },
    { name: t.nav.certifications, href: "#certifications" },
    { name: t.nav.achievements, href: "#achievements" },
    { name: t.nav.memberships, href: "#memberships" },
    { name: t.nav.coding, href: "#coding" },
    { name: t.nav.gallery, href: "#gallery" },
    { name: t.nav.contact, href: "#contact" }
  ];

  // Scroll style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileMenuOpen]);

  // Active section highlight via IntersectionObserver
  useEffect(() => {
    if (cfg.enableActiveHighlight === false) return;
    const sections = (cfg.items || []).map((i) => document.querySelector(i.href)).filter(Boolean) as Element[];
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = "#" + visible[0].target.id;
          setActiveHash(id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cfg]);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;
    if (prefersReducedMotion()) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => activeHash === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-sm" 
          : "bg-background/80 backdrop-blur-md"
      }`}
      aria-label="Primary"
    >
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-primary text-primary-foreground px-3 py-1 rounded"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Professional Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                  isActive(item.href)
                    ? "text-primary bg-primary/5 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
                {/* Clean active indicator */}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
            
            {/* Theme Toggle & Language Switcher */}
            <div className="ml-2 pl-2 border-l border-border flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Professional Mobile Menu Button & Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              aria-expanded={isMobileMenuOpen}
              aria-controls="primary-mobile-menu"
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="relative bg-muted hover:bg-muted/80 border border-border rounded-md"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">{isMobileMenuOpen ? "Close" : "Open"} menu</span>
            </Button>
          </div>
        </div>

        {/* Professional Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="primary-mobile-menu"
            ref={mobileMenuRef}
            className="lg:hidden absolute top-16 left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border shadow-lg animate-slide-up"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left transition-all duration-200 py-2.5 px-4 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? "text-primary bg-primary/5 border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

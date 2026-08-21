import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/data/translations.json";

import navData from "@/data/navigation.json";

type NavItem = { name: string; href: string };

type NavConfig = {
  siteTitle: string;
  items: NavItem[];
  enableActiveHighlight?: boolean;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Navigation: React.FC = () => {
  const cfg = navData as NavConfig;
  const { language } = useLanguage();
  const t = (translations as Record<string, any>)[language];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("#home");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Primary items stay inline; the rest collapse into a "More" menu so the
  // desktop bar never overflows horizontally.
  const primaryItems: NavItem[] = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.projects, href: "#projects" },
    { name: t.nav.research, href: "#research" },
    { name: t.nav.contact, href: "#contact" },
  ];

  const moreItems: NavItem[] = [
    { name: "Journey", href: "#journey" },
    { name: t.nav.academic, href: "#academic" },
    { name: "Leadership", href: "#leadership" },
    { name: t.nav.certifications, href: "#certifications" },
    { name: t.nav.achievements, href: "#achievements" },
    { name: t.nav.memberships, href: "#memberships" },
    { name: "Community", href: "#community" },
    { name: t.nav.coding, href: "#coding" },
    { name: t.nav.gallery, href: "#gallery" },
    { name: t.nav.testimonials || "Testimonials", href: "#testimonials" },
    { name: t.nav.blog || "Blog", href: "#blog" },
  ];

  const allItems = [...primaryItems, ...moreItems];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    const sections = allItems
      .map((i) => document.querySelector(i.href))
      .filter(Boolean) as Element[];
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveHash("#" + visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, language]);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => activeHash === href;
  const moreActive = moreItems.some((i) => isActive(i.href));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border"
          : "bg-background/60 backdrop-blur-md border-b border-transparent"
      }`}
      aria-label="Primary"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-primary text-primary-foreground px-3 py-1 rounded"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <button
            onClick={() => scrollToSection("#home")}
            className="flex items-center gap-2 shrink-0 text-left"
            aria-label="Go to top"
          >
            <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Md. Abu Sufyan
            </span>
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {primaryItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    moreActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  More
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-popover">
                {moreItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onSelect={() => scrollToSection(item.href)}
                    className={isActive(item.href) ? "text-primary" : ""}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Button
              aria-expanded={isMobileMenuOpen}
              aria-controls="primary-mobile-menu"
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden border border-border rounded-md"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">{isMobileMenuOpen ? "Close" : "Open"} menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            id="primary-mobile-menu"
            ref={mobileMenuRef}
            className="lg:hidden absolute top-16 left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border shadow-lg"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 py-4 grid grid-cols-2 gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {allItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left transition-colors py-2.5 px-3 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
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

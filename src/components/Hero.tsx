import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Brain, Cpu, Database } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import ResumeDownload from "@/components/ResumeDownload";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/data/translations.json";
import heroData from "@/data/hero.json";
import { useContent } from "@/lib/contentClient";
import AchievementSlider from "@/components/AchievementSlider";

type Social = { label: string; type: "email" | "linkedin" | "github" | "custom"; href: string };

type HeroConfig = {
  name: string;
  title: string;
  summary: string;
  chips: { icon: "brain" | "cpu" | "db"; text: string }[];
  socials: Social[];
  ctas: { label: string; targetId: string }[];
  showBackgroundIcons?: boolean;
};

const iconForChip = (icon: "brain" | "cpu" | "db") => {
  switch (icon) {
    case "brain":
      return <Brain className="h-4 w-4 mr-2 text-primary" />;
    case "cpu":
      return <Cpu className="h-4 w-4 mr-2 text-primary" />;
    case "db":
      return <Database className="h-4 w-4 mr-2 text-primary" />;
  }
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
};

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Hero: React.FC = () => {
  const fallback = useMemo(() => heroData as HeroConfig, []);
  const { value: cfg } = useContent<HeroConfig>("hero", fallback);
  const { language } = useLanguage();
  const t = (translations as Record<string, any>)[language].hero;

  return (
    <section className="relative flex flex-col justify-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24">
      {/* Calm background: single soft radial wash, no JS-driven particles */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.10),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Bismillah */}
        <motion.div
          {...fade(0)}
          className="flex flex-col items-center justify-center mb-10 px-2"
          aria-label="Bismillah ir-Rahman ir-Raheem"
        >
          <span
            dir="rtl"
            lang="ar"
            className="bismillah-text text-primary/70 select-none"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
          <p className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70 text-center">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.p
              {...fade(0.05)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Available for research & engineering roles
            </motion.p>

            <motion.h1
              {...fade(0.1)}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3"
            >
              {t.name}
            </motion.h1>

            <motion.div
              {...fade(0.15)}
              className="text-lg sm:text-xl lg:text-2xl font-medium text-primary mb-5 min-h-[2rem]"
            >
              <TypeAnimation
                sequence={[
                  "Machine Learning Engineer",
                  2000,
                  "AI & ML Instructor",
                  2000,
                  "Full-Stack Developer",
                  2000,
                  "Computer Vision Researcher",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </motion.div>

            <motion.p
              {...fade(0.2)}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-6"
            >
              CSE graduate from RUET working across computer vision, ML research and
              full-stack engineering. Trainer — Python, ML &amp; AI at{" "}
              <span className="text-foreground font-medium">
                Bangladesh Computer Council (BCC), Rajshahi
              </span>
              , with 100+ learners mentored.
            </motion.p>

            {cfg.chips?.length > 0 && (
              <motion.div
                {...fade(0.25)}
                className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8"
              >
                {cfg.chips.map((c, i) => (
                  <span
                    key={c.text + i}
                    className="flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground"
                  >
                    {iconForChip(c.icon)}
                    {c.text}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              {...fade(0.3)}
              className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto justify-center lg:justify-start"
            >
              <Button size="lg" className="font-medium" onClick={() => scrollToId("projects")}>
                {t.cta}
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <ResumeDownload />
            </motion.div>

            {cfg.socials?.length > 0 && (
              <motion.div
                {...fade(0.35)}
                className="flex flex-wrap gap-2 justify-center lg:justify-start"
              >
                {cfg.socials.map((s) => {
                  const Icon =
                    s.type === "email" ? Mail : s.type === "linkedin" ? Linkedin : Github;
                  const href =
                    s.type === "email" && !s.href.startsWith("mailto:")
                      ? `mailto:${s.href}`
                      : s.href;
                  return (
                    <Button
                      key={s.label}
                      asChild
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right: highlight slider */}
          <div className="hidden lg:block">
            <AchievementSlider />
          </div>
        </div>

        <div className="lg:hidden mt-12">
          <AchievementSlider />
        </div>
      </div>
    </section>
  );
};

export default Hero;

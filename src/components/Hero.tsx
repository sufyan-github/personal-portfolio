import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Brain, Cpu, Database, Sparkles } from "lucide-react";
import Lottie from "lottie-react";
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

// Inline lightweight Lottie animation data (AI/Tech theme)
const techAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 400,
  h: 400,
  nm: "Tech Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 80 },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 90, s: [360] }] },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [150, 150] },
            },
            {
              ty: "st",
              c: { a: 0, k: [0.25, 0.51, 0.96, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

const iconForChip = (icon: "brain" | "cpu" | "db") => {
  switch (icon) {
    case "brain":
      return <Brain className="h-4 w-4 mr-2 text-primary" />;
    case "cpu":
      return <Cpu className="h-4 w-4 mr-2 text-secondary" />;
    case "db":
      return <Database className="h-4 w-4 mr-2 text-accent" />;
  }
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
};

const Hero: React.FC = () => {
  const fallback = useMemo(() => heroData as HeroConfig, []);
  const { value: cfg } = useContent<HeroConfig>("hero", fallback);
  const { language } = useLanguage();
  const t = (translations as any)[language].hero;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-hero pb-16">
      {/* Enhanced Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:4rem_4rem]"
          animate={{
            backgroundPosition: ["0px 0px", "64px 64px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          aria-hidden
        />
      </div>

      {/* Floating particles */}
      {!prefersReducedMotion() && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0.3,
              }}
              animate={{
                y: [null, -100, 100, -50, 0],
                x: [null, 50, -50, 30, -30],
                opacity: [0.3, 0.6, 0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-left">
            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                className="relative w-24 h-24"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-primary p-1 shadow-glow border-2 border-primary/20">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <Sparkles className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-muted-foreground text-xl sm:text-2xl lg:text-3xl font-normal block mb-2">
                {t.greeting}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                {t.name}
              </span>
            </motion.h1>
            
            {/* Animated Typing Effect */}
            <motion.div
              className="text-xl sm:text-2xl lg:text-3xl text-foreground mb-3 sm:mb-4 font-medium min-h-[2.5rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TypeAnimation
                sequence={[
                  "Machine Learning Engineer",
                  2000,
                  "AI Instructor",
                  2000,
                  "Full-Stack Developer",
                  2000,
                  "IoT Enthusiast",
                  2000,
                  "Computer Vision Researcher",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent"
              />
            </motion.div>
            
            {/* Subheading */}
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t.subtitle}
            </motion.p>

            {/* Specialization Chips */}
            {cfg.chips?.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-3 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {cfg.chips.map((c, i) => (
                  <motion.div
                    key={c.text + i}
                    className="flex items-center bg-card/70 backdrop-blur-xl border-2 border-primary/40 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg"
                    whileHover={{ 
                      scale: 1.05, 
                      borderColor: "hsl(210 100% 60%)",
                      boxShadow: "0 0 20px hsla(210, 100%, 60%, 0.5)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  >
                    {iconForChip(c.icon)}
                    <span className="text-foreground">{c.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow text-base font-semibold px-8 transition-all duration-300 border-0"
                  onClick={() => scrollToId("projects")}
                >
                  {t.cta}
                  <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
                </Button>
              </motion.div>
              <ResumeDownload />
            </motion.div>

            {/* Social Links - Compact */}
            {cfg.socials?.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {cfg.socials.map((s) => {
                  const Icon = s.type === "email" ? Mail : s.type === "linkedin" ? Linkedin : s.type === "github" ? Github : Mail;
                  const onClick = () => {
                    if (s.type === "email") {
                      window.open(s.href.startsWith("mailto:") ? s.href : `mailto:${s.href}`, "_blank");
                    } else {
                      window.open(s.href, "_blank");
                    }
                  };
                  return (
                    <motion.div
                      key={s.label}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-2 border-primary/50 hover:border-primary hover:bg-primary/20 transition-all backdrop-blur-xl"
                        onClick={onClick}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right Column: Achievement Slider */}
          <div className="hidden lg:block">
            <AchievementSlider />
          </div>
        </div>

        {/* Mobile View: Achievement Slider appears below content */}
        <div className="lg:hidden mt-16">
          <AchievementSlider />
        </div>
      </div>
    </section>
  );
};

export default Hero;

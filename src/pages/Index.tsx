import heroFallback from "@/data/hero.json";
import contactFallback from "@/data/contactInfo.json";
import settingsFallback from "@/data/site_settings.json";
import { useContent } from "@/lib/contentClient";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProfessionalBackground from "@/components/ProfessionalBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import translationsFallback from "@/data/translations.json";

// Lazy-load below-the-fold sections to speed up initial paint & TTI
const ImpactStats = lazy(() => import("@/components/ImpactStats"));
const OrgLogos = lazy(() => import("@/components/OrgLogos"));
const LanguagesSkills = lazy(() => import("@/components/LanguagesSkills"));
const Academic = lazy(() => import("@/components/Academic"));
const Experience = lazy(() => import("@/components/Experience"));
const Skills = lazy(() => import("@/components/Skills"));
const Projects = lazy(() => import("@/components/Projects"));
const Research = lazy(() => import("@/components/Research"));
const Contact = lazy(() => import("@/components/Contact"));
const Analytics = lazy(() => import("@/components/Analytics"));
const GitHubHeatmap = lazy(() => import("@/components/GitHubHeatmap"));
const Certifications = lazy(() => import("@/components/Certifications"));
const Achievements = lazy(() => import("@/components/Achievements"));
const Memberships = lazy(() => import("@/components/Memberships"));
const PortfolioChatbot = lazy(() =>
  import("@/components/PortfolioChatbot").then((m) => ({ default: m.PortfolioChatbot }))
);
const IndustrialAttachment = lazy(() => import("@/components/IndustrialAttachment"));
const Gallery = lazy(() => import("@/components/Gallery"));
const CodingProfiles = lazy(() => import("@/components/CodingProfiles"));
const TechnicalFootprint = lazy(() => import("@/components/TechnicalFootprint"));
const CareerTimeline = lazy(() => import("@/components/CareerTimeline"));
const Leadership = lazy(() => import("@/components/Leadership"));
const CommunityImpact = lazy(() => import("@/components/CommunityImpact"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Blog = lazy(() => import("@/components/Blog"));
const ResumeDownload = lazy(() => import("@/components/ResumeDownload"));

const SectionFallback = () => <div className="min-h-[200px]" aria-hidden />;

const SectionHashScroll = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView({ block: "start", behavior: "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return null;
};

const Index = () => {
  const { value: hero } = useContent("hero", heroFallback);
  const { value: contacts } = useContent("contactInfo", contactFallback);
  const contactLink = (icon: string) => contacts.find(item => item.icon === icon)?.link || '#contact';
  const contactValue = (icon: string) => contacts.find(item => item.icon === icon)?.value || '';
  const { value: settings } = useContent("site_settings", settingsFallback);
  const { value: translations } = useContent("translations", translationsFallback);
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Lightweight professional animated background */}
      {settings.animatedBackground && <ProfessionalBackground />}

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <main id="main" tabIndex={-1}>
          <div id="home">
            <Hero />
          </div>
          <Suspense fallback={<SectionFallback />}>
            <ImpactStats />
            <OrgLogos />
            <div>
              <About />
            </div>
            <CareerTimeline />
            <div id="academic">
              <Academic />
            </div>
            <div>
              <Experience />
            </div>
            <Leadership />
            <div>
              <IndustrialAttachment />
            </div>
            <div>
              <Skills />
              <LanguagesSkills />
              <GitHubHeatmap />
            </div>
            <div>
              <Projects />
            </div>
            <div>
              <Research />
            </div>
            <div>
              <Certifications />
            </div>
            <div>
              <Achievements />
            </div>
            <div>
              <Memberships />
            </div>
            <CommunityImpact />
            <div id="coding">
              <CodingProfiles />
              <TechnicalFootprint />
            </div>
            <div>
              <Gallery />
            </div>
            <div id="testimonials">
              <Testimonials />
            </div>
            <div>
              <Blog />
            </div>
            {/* Resume CTA banner */}
            <section id="resume" className="py-16">
              <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">
                    Explore My Full CV
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    A detailed record of my academic path, research, industry work and leadership — ideal for scholarship, PhD and recruitment review.
                  </p>
                  <div className="flex justify-center">
                    <ResumeDownload />
                  </div>
                </div>
              </div>
            </section>
            <div>
              <Contact />
            </div>
            <SectionHashScroll />
          </Suspense>
        </main>


        {/* Enhanced Footer with Quick Links Navigation */}
        <footer className="relative bg-gradient-to-b from-background to-card/30 backdrop-blur-sm border-t border-border py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-8 lg:gap-12 mb-12">
              {/* About Section */}
              <div className="md:col-span-12 lg:col-span-4">
                <h3 className="text-2xl font-bold gradient-text mb-4 font-display">{hero.name}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                  {t.footer.about}
                </p>
                <div className="flex gap-3">
                  <a
                    href={contactLink("Github")}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all hover:scale-110"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={contactLink("Linkedin")}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={contactLink("Mail")}
                    className="p-3 rounded-lg bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all hover:scale-110"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Quick Navigation - Split into 2 columns */}
              <div className="md:col-span-6 lg:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">{t.footer.quickNav}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <a 
                    href="#home" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.home}
                  </a>
                  <a 
                    href="#about" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.about}
                  </a>
                  <a 
                    href="#academic" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.academic}
                  </a>
                  <a 
                    href="#experience" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.experience}
                  </a>
                  <a 
                    href="#industrial-attachment" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.industrial}
                  </a>
                  <a 
                    href="#skills" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.skills}
                  </a>
                  <a 
                    href="#projects" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.projects}
                  </a>
                  <a 
                    href="#research" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.research}
                  </a>
                  <a 
                    href="#certifications" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.certifications}
                  </a>
                  <a 
                    href="#achievements" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.achievements}
                  </a>
                  <a 
                    href="#memberships" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.memberships}
                  </a>
                  <a 
                    href="#coding" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.coding}
                  </a>
                  <a 
                    href="#gallery" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.gallery}
                  </a>
                  <a 
                    href="#contact" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → {t.nav.contact}
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div className="md:col-span-6 lg:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">{t.footer.getInTouch}</h3>
                <div className="space-y-3 text-sm">
                  <a 
                    href={contactLink("Mail")}
                    className="flex items-start text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="break-all">abusufyan.cse20@gmail.com</span>
                  </a>
                  <a 
                    href={contactLink("Phone")}
                    className="flex items-start text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <span>+880 1580 352238</span>
                  </a>
                  <div className="flex items-start text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>{contactValue("MapPin")}</span>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="pt-4 border-t border-border/50 mt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      {t.footer.openForCollab}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20">
                        AI Research
                      </span>
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md border border-accent/20">
                        ML Education
                      </span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-md border border-green-500/20">
                        Full-Stack Dev
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  © {new Date().getFullYear()} {hero.name}. {t.footer.copyright}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <a href="/sitemap" className="hover:text-primary transition-colors">
                    Sitemap
                  </a>
                  <span>•</span>
                  <span>{t.footer.builtWith}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{t.footer.poweredBy}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Analytics + AI Chatbot (lazy) */}
      <Suspense fallback={null}>
        {settings.analyticsEnabled && <Analytics />}
        {settings.assistantEnabled && <PortfolioChatbot />}
      </Suspense>

      {/* Back to Top Button */}
      <BackToTop />
      

    </div>
  );
};

export default Index;
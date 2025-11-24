import IndustrialAttachment from "@/components/IndustrialAttachment";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LanguagesSkills from "@/components/LanguagesSkills";
import Academic from "@/components/Academic";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Contact from "@/components/Contact";
import Analytics from "@/components/Analytics";
import ParticleBackground from "@/components/ParticleBackground";
import FloatingTechElements from "@/components/FloatingTechElements";
import GitHubHeatmap from "@/components/GitHubHeatmap";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import Memberships from "@/components/Memberships";
import { PortfolioChatbot } from "@/components/PortfolioChatbot";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import Gallery from "@/components/Gallery";
import CodingProfiles from "@/components/CodingProfiles";
import { Toaster } from "@/components/ui/toaster";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* 3D Particle Background Animation */}
      <ParticleBackground
  density={1}          // 0.5–1.2 is comfy
  speed={1}            // 0.8 for calmer
  maxDepth={250}
  interactive={true}
  blendMode="screen"   // or "lighter"
  colors={[
    "hsl(212, 100%, 65%)",
    "hsl(270, 60%, 45%)",
    "hsl(189, 100%, 60%)",
  ]}
  icons={["🧠","💻","🤖","⚡","🌐"]}
/>

      
      {/* Floating Tech Elements */}
      <FloatingTechElements />
      
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <main>
          <div id="home">
            <Hero />
          </div>
          <div id="about">
            <About />
          </div>
          <div id="academic">
            <Academic />
          </div>
          <div id="experience">
            <Experience />
          </div>
          <div id="industrial-attachment">
            <IndustrialAttachment />
          </div>
          <div id="skills">
            <Skills />
            <LanguagesSkills />
            <GitHubHeatmap />
          </div>
          <div id="projects">
            <Projects />
          </div>
          <div id="research">
            <Research />
          </div>
          <div id="certifications">
            <Certifications />
          </div>
          <div id="achievements">
            <Achievements />
          </div>
          <div id="memberships">
            <Memberships />
          </div>
          <div id="coding">
            <CodingProfiles />
          </div>
          <div id="gallery">
            <Gallery />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </main>
        
        {/* Enhanced Footer with Quick Links Navigation */}
        <footer className="relative bg-gradient-to-b from-background to-card/30 backdrop-blur-sm border-t border-border py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-8 lg:gap-12 mb-12">
              {/* About Section */}
              <div className="md:col-span-12 lg:col-span-4">
                <h3 className="text-2xl font-bold gradient-text mb-4 font-display">Md. Abu Sufyan</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                  Machine Learning & AI Instructor | Computer Science Engineer specializing in AI research, 
                  full-stack development, and innovative technology solutions. Passionate about leveraging 
                  technology for social impact and education.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/sufyan-github"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all hover:scale-110"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/md-abu-sufyan"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:abusufyan.cse20@gmail.com"
                    className="p-3 rounded-lg bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all hover:scale-110"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Quick Navigation - Split into 2 columns */}
              <div className="md:col-span-6 lg:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Navigation</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <a 
                    href="#home" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Home
                  </a>
                  <a 
                    href="#about" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → About
                  </a>
                  <a 
                    href="#academic" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Academic
                  </a>
                  <a 
                    href="#experience" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Experience
                  </a>
                  <a 
                    href="#industrial-attachment" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Training
                  </a>
                  <a 
                    href="#skills" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Skills
                  </a>
                  <a 
                    href="#projects" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Projects
                  </a>
                  <a 
                    href="#research" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Research
                  </a>
                  <a 
                    href="#certifications" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Certifications
                  </a>
                  <a 
                    href="#achievements" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Achievements
                  </a>
                  <a 
                    href="#memberships" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Memberships
                  </a>
                  <a 
                    href="#coding" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Coding
                  </a>
                  <a 
                    href="#gallery" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Gallery
                  </a>
                  <a 
                    href="#contact" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 inline-block"
                  >
                    → Contact
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div className="md:col-span-6 lg:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Get In Touch</h3>
                <div className="space-y-3 text-sm">
                  <a 
                    href="mailto:abusufyan.cse20@gmail.com"
                    className="flex items-start text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="break-all">abusufyan.cse20@gmail.com</span>
                  </a>
                  <a 
                    href="tel:+8801580352238"
                    className="flex items-start text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <span>+880 1580 352238</span>
                  </a>
                  <div className="flex items-start text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>Rajshahi, Bangladesh</span>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="pt-4 border-t border-border/50 mt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Open for collaboration and opportunities
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
                  © {new Date().getFullYear()} Md. Abu Sufyan. Crafted with precision for innovation.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <a href="/sitemap" className="hover:text-primary transition-colors">
                    Sitemap
                  </a>
                  <span>•</span>
                  <span>Built with React & TypeScript</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Powered by Supabase</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Analytics Component */}
      <Analytics />
      
      {/* AI Chatbot */}
      <PortfolioChatbot />
      
      {/* Back to Top Button */}
      <BackToTop />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Index;
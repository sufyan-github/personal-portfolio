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
        
        {/* Footer */}
        <footer className="relative bg-card/30 backdrop-blur-sm border-t border-border py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* About */}
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold gradient-text mb-4 font-display">Md. Abu Sufyan</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Machine Learning & AI Instructor | Computer Science Engineer specializing in AI research, 
                  full-stack development, and innovative technology solutions.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/sufyan-github"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-secondary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/md-abu-sufyan"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-secondary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:abusufyan.cse20@gmail.com"
                    className="p-3 rounded-lg bg-secondary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>abusufyan.cse20@gmail.com</span>
                  </p>
                  <p className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>+880 1580 352238</span>
                  </p>
                  <p className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>Rajshahi, Bangladesh</span>
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#about" className="block hover:text-primary transition-colors">About</a>
                  <a href="#projects" className="block hover:text-primary transition-colors">Projects</a>
                  <a href="#research" className="block hover:text-primary transition-colors">Research</a>
                  <a href="#contact" className="block hover:text-primary transition-colors">Contact</a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Md. Abu Sufyan. Crafted with precision for innovation.
              </p>
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
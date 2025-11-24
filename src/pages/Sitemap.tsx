import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, User, GraduationCap, Briefcase, FileText, Code, 
  Lightbulb, Award, Trophy, Users, Github, Image, 
  Mail, ArrowLeft, MapPin, Target
} from "lucide-react";

const Sitemap: React.FC = () => {
  const sections = [
    {
      id: "home",
      title: "Home",
      icon: Home,
      description: "Welcome section featuring introduction, tagline, and quick navigation to explore the portfolio.",
      category: "Overview",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "about",
      title: "About Me",
      icon: User,
      description: "Personal introduction, educational background, interests in Machine Learning, Deep Learning, AI, Bioinformatics, and Medical Imaging. Includes language proficiency and soft skills.",
      category: "Profile",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "academic",
      title: "Academic Background",
      icon: GraduationCap,
      description: "Educational journey from secondary school to Bachelor of Science in Computer Science & Engineering at RUET with CGPA 3.68/4.00. Timeline of academic achievements.",
      category: "Education",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "experience",
      title: "Professional Experience",
      icon: Briefcase,
      description: "Work history including ML & AI Instructor at AI Bangladesh, Campus Representative at FutureNation, President of RUET IoT Club, Research Assistant, and various volunteer positions.",
      category: "Career",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "industrial-attachment",
      title: "Industrial Training",
      icon: FileText,
      description: "15-day industrial attachment experience developing real-time traffic sign detection system using YOLOv8, MobileNet, and ResNet models. Full-cycle development training.",
      category: "Training",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "skills",
      title: "Skills & Expertise",
      icon: Code,
      description: "Technical proficiency across Programming & Web Development, Machine Learning & AI, Databases & Backend, Hardware Design & VLSI, and Tools & Platforms. Features certification counts and proficiency levels.",
      category: "Technical",
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "projects",
      title: "Projects",
      icon: Target,
      description: "Portfolio of AI/ML and web development projects including Traffic Sign Detection, Sentiment Analysis, Monkeypox Prediction, Attendance Management App, and Full-Stack projects.",
      category: "Portfolio",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "research",
      title: "Research & Publications",
      icon: Lightbulb,
      description: "Research papers presented at ICCiT 2024 on Sentiment Analysis in Social Media and Monkeypox Outbreak Prediction. Research interests and RA profile.",
      category: "Academic",
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "certifications",
      title: "Certifications",
      icon: Award,
      description: "22+ professional certifications including CAPM, Flutter Development, Machine Learning, Data Science, Agile Scrum, Networking, and specialized AI courses.",
      category: "Credentials",
      color: "from-teal-500 to-cyan-500"
    },
    {
      id: "achievements",
      title: "Achievements",
      icon: Trophy,
      description: "Notable accomplishments in competitive programming, olympiads, and academic excellence showcasing problem-solving capabilities and dedication.",
      category: "Recognition",
      color: "from-amber-500 to-yellow-500"
    },
    {
      id: "memberships",
      title: "Memberships",
      icon: Users,
      description: "Active participation in RUET Computing Society, RUET IoT Club, Volunteer for Bangladesh, FutureNation, Programming Hero, and WSDA New Zealand.",
      category: "Community",
      color: "from-lime-500 to-green-500"
    },
    {
      id: "coding",
      title: "Competitive Programming",
      icon: Github,
      description: "Coding profiles on LeetCode (150+ problems, Top 25%), Codeforces (1200+ rating), HackerRank (5 Stars Python), and GitHub (30+ repositories, 500+ contributions).",
      category: "Technical",
      color: "from-violet-500 to-purple-500"
    },
    {
      id: "gallery",
      title: "Gallery & Events",
      icon: Image,
      description: "Visual showcase of participation in ICCiT 2024 Conference, AI/ML Workshops, IoT Project Exhibitions, and Hackathons with photo carousels.",
      category: "Events",
      color: "from-fuchsia-500 to-pink-500"
    },
    {
      id: "contact",
      title: "Contact",
      icon: Mail,
      description: "Get in touch via email, phone, LinkedIn, or GitHub. Includes contact form, social media links, and location information in Rajshahi, Bangladesh.",
      category: "Connect",
      color: "from-sky-500 to-blue-500"
    }
  ];

  const categories = Array.from(new Set(sections.map(s => s.category)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-b from-card/50 to-background border-b border-border sticky top-0 z-10 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Portfolio Sitemap</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Complete overview of portfolio structure and navigation
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center hover-lift bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="text-3xl font-bold gradient-text mb-1">{sections.length}</div>
              <div className="text-sm text-muted-foreground">Total Sections</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift bg-card/50 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6">
              <div className="text-3xl font-bold gradient-text mb-1">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift bg-card/50 backdrop-blur-sm border-green-500/20">
            <CardContent className="p-6">
              <div className="text-3xl font-bold gradient-text mb-1">22+</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift bg-card/50 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="text-3xl font-bold gradient-text mb-1">30+</div>
              <div className="text-sm text-muted-foreground">Skills Listed</div>
            </CardContent>
          </Card>
        </div>

        {/* Sections by Category */}
        {categories.map((category, catIndex) => {
          const categorySections = sections.filter(s => s.category === category);
          
          return (
            <div key={category} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="outline" className="text-sm px-4 py-2 bg-primary/10 border-primary/30">
                  {category}
                </Badge>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {categorySections.map((section, index) => {
                  const Icon = section.icon;
                  
                  return (
                    <Card 
                      key={section.id}
                      className="hover-lift bg-card/50 backdrop-blur-sm border transition-all duration-300 group overflow-hidden"
                      style={{ animationDelay: `${(catIndex * 100 + index * 50)}ms` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-20 rounded-xl blur-md group-hover:opacity-30 transition-opacity`}></div>
                            <div className={`relative p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {section.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <code className="bg-muted px-2 py-0.5 rounded">#{section.id}</code>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {section.description}
                        </p>
                        <Link to={`/#${section.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-primary/10 group-hover:border-primary/30 transition-all"
                          >
                            <span>View Section</span>
                            <ArrowLeft className="h-3 w-3 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Quick Access Footer */}
        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold gradient-text mb-3">Ready to Explore?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Navigate directly to any section from the main portfolio or use the navigation menu for seamless browsing.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/">
                <Button variant="default" size="lg" className="gap-2">
                  <Home className="h-4 w-4" />
                  Go to Portfolio
                </Button>
              </Link>
              <Link to="/#contact">
                <Button variant="outline" size="lg" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Me
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sitemap;

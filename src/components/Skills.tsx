import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Brain, Wrench, Sparkles, Award, TrendingUp, CheckCircle2, Trophy, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/data/translations.json";
import skills from "@/data/skills.json" assert { type: "json" };
import certifications from "@/data/certifications.json" assert { type: "json" };

// ===============================
// Type Definitions
// ===============================
export type SkillItem = { name: string; level: number };
export type SkillCategory = {
  title: string;
  icon: "code" | "brain" | "database" | "wrench" | "cpu";
  skills: SkillItem[];
};

type Certification = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
};

// ===============================
// Category Icons (Lucide)
// ===============================
const iconMap = {
  code: Code,
  brain: Brain,
  database: Database,
  wrench: Wrench,
  cpu: Cpu,
} as const;

// ===============================
// Tech Logos (React Icons)
// ===============================
import {
  FaReact,
  FaPython,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaPhp,
  FaLaravel,
  FaLinux,
  FaFigma,
  FaDatabase,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiTensorflow,
  SiPytorch,
  SiJavascript,
  SiFirebase,
  SiPostman,
} from "react-icons/si";

const techIconMap: Record<string, JSX.Element> = {
  python: <FaPython className="text-yellow-500" />,
  javascript: <SiJavascript className="text-yellow-400" />,
  react: <FaReact className="text-sky-400" />,
  node: <FaNodeJs className="text-green-600" />,
  html: <FaHtml5 className="text-orange-500" />,
  css: <FaCss3Alt className="text-blue-500" />,
  tailwind: <SiTailwindcss className="text-cyan-400" />,
  "machine learning": <SiTensorflow className="text-orange-400" />,
  tensorflow: <SiTensorflow className="text-orange-400" />,
  pytorch: <SiPytorch className="text-red-500" />,
  "data science": <FaDatabase className="text-indigo-500" />,
  mysql: <FaDatabase className="text-blue-600" />,
  mongodb: <SiMongodb className="text-green-500" />,
  express: <SiExpress className="text-gray-500" />,
  php: <FaPhp className="text-indigo-600" />,
  laravel: <FaLaravel className="text-red-500" />,
  firebase: <SiFirebase className="text-yellow-500" />,
  "rest api": <SiPostman className="text-orange-500" />,
  git: <FaGitAlt className="text-orange-600" />,
  github: <FaGitAlt className="text-gray-800" />,
  docker: <FaDocker className="text-blue-500" />,
  postman: <SiPostman className="text-orange-500" />,
  figma: <FaFigma className="text-pink-500" />,
  linux: <FaLinux className="text-black" />,
};

// ===============================
// Tech Logo Component
// ===============================
const TechLogo = ({ name }: { name: string }) => {
  const key = Object.keys(techIconMap).find((k) =>
    name.toLowerCase().includes(k)
  );
  return (
    <span className="text-2xl mr-3 transition-transform duration-300 hover:scale-125">
      {key ? techIconMap[key] : "💻"}
    </span>
  );
};

// ===============================
// Skills Component
// ===============================
const Skills: React.FC = () => {
  const skillCategories = skills as SkillCategory[];
  const certs = certifications as Certification[];
  const { language } = useLanguage();
  const t = (translations as any)[language].skills;

  // Calculate certification counts for each skill
  const skillCertCount = useMemo(() => {
    const counts: Record<string, number> = {};
    certs.forEach((cert) => {
      cert.skills?.forEach((skill) => {
        const normalizedSkill = skill.toLowerCase();
        counts[normalizedSkill] = (counts[normalizedSkill] || 0) + 1;
      });
    });
    return counts;
  }, [certs]);

  // Helper function to get cert count for a skill
  const getCertCount = (skillName: string): number => {
    const normalized = skillName.toLowerCase();
    // Check exact match or partial match
    let count = skillCertCount[normalized] || 0;
    
    // Check for partial matches
    Object.keys(skillCertCount).forEach((key) => {
      if (normalized.includes(key) || key.includes(normalized)) {
        count = Math.max(count, skillCertCount[key]);
      }
    });
    
    return count;
  };

  // Get proficiency label
  const getProficiencyLabel = (level: number): string => {
    if (level >= 90) return t.expert;
    if (level >= 80) return t.advanced;
    if (level >= 70) return t.proficient;
    if (level >= 60) return t.intermediate;
    return "Beginner";
  };

  // Get proficiency color
  const getProficiencyColor = (level: number): string => {
    if (level >= 90) return "from-emerald-500 to-green-500";
    if (level >= 80) return "from-blue-500 to-cyan-500";
    if (level >= 70) return "from-purple-500 to-pink-500";
    if (level >= 60) return "from-orange-500 to-yellow-500";
    return "from-gray-500 to-slate-500";
  };

  // Calculate stats
  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);
  const avgLevel = Math.round(
    skillCategories.reduce(
      (sum, cat) => sum + cat.skills.reduce((s, sk) => s + sk.level, 0),
      0
    ) / totalSkills
  );
  const totalCertifications = certs.length;

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-5xl font-extrabold gradient-text font-display">
              {t.title}
            </h2>
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-primary/20">
            <CardContent className="p-6">
              <Code className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-1">{totalSkills}+</div>
              <div className="text-sm text-muted-foreground font-medium">{t.technicalSkills}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-accent/20">
            <CardContent className="p-6">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 text-accent" />
              <div className="text-3xl font-bold gradient-text mb-1">{avgLevel}%</div>
              <div className="text-sm text-muted-foreground font-medium">{t.avgProficiency}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-green-500/20">
            <CardContent className="p-6">
              <Trophy className="h-10 w-10 mx-auto mb-3 text-green-500" />
              <div className="text-3xl font-bold gradient-text mb-1">{totalCertifications}</div>
              <div className="text-sm text-muted-foreground font-medium">{t.certifications}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-primary/20">
            <CardContent className="p-6">
              <Award className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-1">{skillCategories.length}</div>
              <div className="text-sm text-muted-foreground font-medium">{t.coreDomains}</div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => {
            const Icon = iconMap[category.icon] ?? Code;
            return (
              <Card
                key={category.title + index}
                className="hover:shadow-2xl hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-3xl border-2 border-border/50 group overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card Header with Gradient Background */}
                <div className="relative p-6 pb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="relative flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
                      <div className="relative p-3 rounded-2xl bg-gradient-primary shadow-lg">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold gradient-text font-display">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <CardContent className="px-6 pb-6">
                  <div className="space-y-5">
                    {category.skills.map((skill, skillIndex) => {
                      const certCount = getCertCount(skill.name);
                      const proficiencyLabel = getProficiencyLabel(skill.level);
                      const gradientColor = getProficiencyColor(skill.level);
                      
                      return (
                        <div key={skill.name + skillIndex} className="space-y-2 group/skill">
                          {/* Skill Header */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <TechLogo name={skill.name} />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base text-foreground truncate">
                                  {skill.name}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground">
                                    {proficiencyLabel}
                                  </span>
                                  {certCount > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                      <CheckCircle2 className="h-3 w-3" />
                                      <span className="font-medium">{certCount} cert{certCount > 1 ? 's' : ''}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              className="bg-primary/10 text-primary border-primary/30 px-2.5 py-1 text-sm font-bold flex-shrink-0"
                            >
                              {skill.level}%
                            </Badge>
                          </div>
                          
                          {/* Enhanced Progress Bar */}
                          <div className="relative">
                            {/* Background track */}
                            <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                              {/* Animated progress fill */}
                              <div
                                className={`h-full bg-gradient-to-r ${gradientColor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                                style={{ 
                                  width: `${skill.level}%`,
                                  animationDelay: `${(index * 3 + skillIndex) * 0.1}s`
                                }}
                              >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300">
                                  <div className={`absolute inset-0 bg-gradient-to-r ${gradientColor} blur-sm`} />
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress indicator dots */}
                            <div className="absolute inset-0 flex items-center pointer-events-none">
                              {[25, 50, 75].map((milestone) => (
                                <div
                                  key={milestone}
                                  className={`absolute w-1 h-1 rounded-full ${
                                    skill.level >= milestone ? 'bg-white' : 'bg-muted-foreground/30'
                                  }`}
                                  style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Endorsement badges for high-level skills */}
                          {skill.level >= 85 && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                                {t.endorsed}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Continuously learning and expanding technical expertise with hands-on projects and certifications
          </p>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Certified Skills</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Endorsed Expertise</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Continuous Growth</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

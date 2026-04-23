import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Brain, Wrench, Sparkles, Award, CheckCircle2, Trophy, Cpu, Globe, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/data/translations.json";
import skills from "@/data/skills.json";
import certifications from "@/data/certifications.json";
import { useContent } from "@/lib/contentClient";

// ===============================
// Type Definitions
// ===============================
export type SkillItem = { name: string };
export type SkillCategory = {
  title: string;
  icon: "code" | "brain" | "database" | "wrench" | "cpu" | "globe" | "smartphone";
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
  globe: Globe,
  smartphone: Smartphone,
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
  SiFlutter,
  SiDart,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiJupyter,
  SiCplusplus,
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
  flutter: <SiFlutter className="text-sky-500" />,
  dart: <SiDart className="text-blue-600" />,
  "scikit-learn": <SiScikitlearn className="text-orange-500" />,
  pandas: <SiPandas className="text-blue-800" />,
  numpy: <SiNumpy className="text-blue-500" />,
  jupyter: <SiJupyter className="text-orange-500" />,
  "c++": <SiCplusplus className="text-blue-600" />,
  sql: <FaDatabase className="text-blue-500" />,
  "deep learning": <SiPytorch className="text-red-500" />,
  "computer vision": <SiTensorflow className="text-orange-400" />,
  nlp: <SiTensorflow className="text-green-500" />,
  riverpod: <SiFlutter className="text-sky-500" />,
};

// ===============================
// Tech Logo Component
// ===============================
const TechLogo = ({ name }: { name: string }) => {
  const key = Object.keys(techIconMap).find((k) =>
    name.toLowerCase().includes(k)
  );
  return (
    <span className="text-xl transition-transform duration-300 hover:scale-125">
      {key ? techIconMap[key] : "💻"}
    </span>
  );
};

// ===============================
// Skills Component
// ===============================
const Skills: React.FC = () => {
  const { value: skillCategories } = useContent<SkillCategory[]>("skills", skills as SkillCategory[]);
  const { value: certs } = useContent<Certification[]>("certifications", certifications as Certification[]);
  const { language } = useLanguage();
  const t = (translations as any)[language].skills;

  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-primary/20">
            <CardContent className="p-6">
              <Code className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-1">{totalSkills}+</div>
              <div className="text-sm text-muted-foreground font-medium">{t.technicalSkills}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-accent/20">
            <CardContent className="p-6">
              <Trophy className="h-10 w-10 mx-auto mb-3 text-accent" />
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => {
            const Icon = iconMap[category.icon] ?? Code;
            return (
              <Card
                key={category.title + index}
                className="hover:shadow-2xl hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl rounded-2xl border border-border/50 group overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header */}
                <div className="relative p-5 pb-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="relative flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                      <div className="relative p-2.5 rounded-xl bg-gradient-primary shadow-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold gradient-text font-display">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <CardContent className="px-4 sm:px-5 pb-5 pt-2">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skill.name + skillIndex}
                        variant="secondary"
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-card text-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary motion-safe:transition-all motion-safe:duration-300 cursor-default inline-flex items-center gap-1.5 sm:gap-2 shadow-sm motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5 max-w-full whitespace-normal break-words leading-tight"
                      >
                        <TechLogo name={skill.name} />
                        <span className="break-words">{skill.name}</span>
                      </Badge>
                    ))}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

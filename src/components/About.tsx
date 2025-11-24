import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Cpu, Zap, Sparkles } from "lucide-react";
import aboutData from "@/data/about.json";

const highlights = [
  {
    icon: Brain,
    title: "AI & ML Expertise",
    description: "Deep Learning, Computer Vision, NLP",
    color: "from-blue-500 to-cyan-400",
    iconColor: "text-blue-400",
  },
  {
    icon: Code,
    title: "Full Stack Dev",
    description: "React, Node.js, Python, Modern Web",
    color: "from-purple-500 to-pink-500",
    iconColor: "text-purple-400",
  },
  {
    icon: Cpu,
    title: "Research Focus",
    description: "Published papers, Active researcher",
    color: "from-cyan-500 to-blue-500",
    iconColor: "text-cyan-400",
  },
  {
    icon: Zap,
    title: "Community Leader",
    description: "Tech education & mentorship",
    color: "from-amber-500 to-orange-500",
    iconColor: "text-amber-400",
  },
];

// Diamond/Gem shape component
const DiamondShape = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, scale: 0, rotate: 45 }}
    animate={{ 
      opacity: [0.3, 0.6, 0.3], 
      scale: [1, 1.2, 1],
      rotate: [45, 225, 45] 
    }}
    transition={{ 
      duration: 8, 
      delay,
      repeat: Infinity,
      ease: "easeInOut" 
    }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 blur-xl" 
         style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
  </motion.div>
);

const About: React.FC = () => {
  const { personal } = aboutData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Animated Diamond Background */}
      <DiamondShape className="top-10 left-10" delay={0} />
      <DiamondShape className="top-32 right-20" delay={1} />
      <DiamondShape className="bottom-20 left-1/4" delay={2} />
      <DiamondShape className="bottom-32 right-1/3" delay={3} />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text font-display">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate technologist bridging research and real-world innovation
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Highlight Cards with 3D effect */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="bg-card/80 backdrop-blur-xl border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 relative overflow-hidden group h-full">
                    {/* Animated gradient background */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <CardContent className="pt-6 text-center relative z-10">
                      <motion.div
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-4 shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bio with enhanced visibility */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/90 backdrop-blur-xl border-2 border-primary/40 shadow-2xl shadow-primary/20 relative overflow-hidden">
              {/* Animated corner accents */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/30 to-transparent"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              <CardContent className="pt-8 space-y-6 text-foreground leading-relaxed relative z-10">
                <p className="text-lg">
                  I am <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{personal.name}</span>, a {personal.degree} graduate from {personal.university}. My expertise centers on <span className="text-primary font-semibold">Machine Learning</span>, <span className="text-secondary font-semibold">Deep Learning</span>, and <span className="text-accent font-semibold">Artificial Intelligence</span>—with applications in Bioinformatics, Medical Imaging, and emerging tech domains.
                </p>

                <p className="text-base text-muted-foreground">
                  Throughout my academic journey, I've engaged in research that bridges theory and practice, contributing to projects that address real-world challenges. My passion lies in leveraging AI to build innovative solutions that make a tangible impact.
                </p>

                <p className="text-base text-muted-foreground">
                  As an R&D Engineer and active community leader, I'm committed to advancing the field of AI through continuous learning, mentorship, and collaboration. I'm eager to pursue higher studies and contribute to cutting-edge research that shapes the future of technology.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

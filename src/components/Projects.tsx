import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Calendar, Tag } from "lucide-react";
import demoTrafficImage from "@/assets/demo-traffic.jpg";
import demoHealthTrackerImage from "@/assets/demo-healthtracker.png";
import projectsData from "@/data/projects.json";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  project_type: string;
  year: string;
  featured: boolean;
  github_url?: string | null;
  demo_url?: string | null;
  image_url?: string | null;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "AI/ML":
      return "bg-primary/20 text-primary border-primary/50";
    case "Research":
      return "bg-accent/20 text-accent border-accent/50";
    case "Mobile":
      return "bg-secondary/20 text-secondary border-secondary/50";
    case "Web Development":
      return "bg-purple-500/20 text-purple-300 border-purple-500/50";
    default:
      return "bg-muted/20 text-muted-foreground border-border";
  }
};

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const projects = useMemo(() => {
    const projectsList = projectsData as Project[];
    return projectsList.map(project => ({
      ...project,
      image_url: project.id === "p01" ? demoTrafficImage : 
                 project.id === "p02" ? demoHealthTrackerImage : 
                 project.image_url || "/projects/placeholder.jpg"
    }));
  }, []);

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.project_type === filter);

  const projectTypes = ["all", ...Array.from(new Set(projects.map(p => p.project_type)))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="projects" className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Featured Projects
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world solutions spanning AI research, web development, and mobile applications
          </p>
        </motion.div>

        {/* Filter Tags */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {projectTypes.map((type) => (
            <motion.div
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                className={filter === type ? "bg-primary border-0 shadow-lg shadow-primary/50" : "border-primary/30 hover:border-primary"}
              >
                {type === "all" ? "All Projects" : type}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`group overflow-hidden bg-card/80 backdrop-blur-xl border-2 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 h-full ${
                project.featured ? "ring-2 ring-primary/30" : "border-primary/20"
              }`}>
                {/* Project Image */}
                {project.image_url && (
                  <div className="relative w-full h-56 overflow-hidden bg-muted">
                    <motion.img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => {
                        e.currentTarget.src = "/projects/placeholder.jpg";
                      }}
                    />
                    {project.featured && (
                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg">
                          ⭐ Featured
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className={`${getTypeColor(project.project_type)} border-2`}>
                          <Tag className="h-3 w-3 mr-1" />
                          {project.project_type}
                        </Badge>
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.div
                        key={`${project.id}-tech-${techIndex}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge
                          variant="secondary"
                          className="text-xs bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-colors border border-secondary/30"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {project.github_url && project.github_url !== "#" && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-2 border-primary/40 hover:border-primary hover:bg-primary/20"
                        >
                          <a href={project.github_url} target="_blank" rel="noreferrer">
                            <Github className="h-4 w-4 mr-2" /> Code
                          </a>
                        </Button>
                      </motion.div>
                    )}

                    {project.demo_url && project.demo_url !== "#" && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          size="sm"
                          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 border-0"
                        >
                          <a href={project.demo_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                          </a>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const IndustrialAttachment: React.FC = () => {
  return (
    <section id="industrial-attachment" className="py-20 bg-gradient-secondary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 gradient-text">Industrial Attachment</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-world experience and hands-on training
          </p>
        </motion.div>

        {/* Industrial Attachment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="hover-lift glow-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <Briefcase className="h-10 w-10 text-primary" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  {/* Title and Duration Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold gradient-text mb-2">
                        15-Day Industrial Attachment
                      </h3>
                      <p className="text-xl text-foreground font-semibold">
                        Real-Time AI Project
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      March 2025
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <Building2 className="h-4 w-4" />
                    <span>Collaborative Office Environment with Developers & Data Scientists</span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Developed a real-time traffic sign detection system using trained deep learning models 
                    and a web interface. Gained hands-on experience in a collaborative office setting with 
                    developers and data scientists.
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground mb-3">Key Highlights:</h4>
                    <div className="grid gap-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">
                          Built a web-based application integrating YOLOv8, MobileNet, and ResNet models for live video detection
                        </p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">
                          Explored Generative AI for auto-annotation and dataset enhancement
                        </p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">
                          Contributed to full-cycle development: model training, frontend/backend integration, and deployment
                        </p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">
                          Participated in daily standups, sprint reviews, and presented project outcomes as a team
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {["YOLOv8", "MobileNet", "ResNet", "Deep Learning", "Web Development", "Generative AI", "Team Collaboration"].map(
                      (skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-accent/10 text-accent border border-accent/20"
                        >
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustrialAttachment;

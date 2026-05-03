import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, FolderGit2, BrainCircuit, Users } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "100+", label: "Students Trained" },
  { icon: FolderGit2, value: "20+", label: "Projects Built" },
  { icon: BrainCircuit, value: "AI/ML", label: "Core Focus" },
  { icon: Users, value: "5+", label: "Communities Led" },
];

const ImpactStats: React.FC = () => {
  return (
    <section aria-label="Impact at a glance" className="py-10 sm:py-14 border-y border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex flex-col items-center text-center p-4 sm:p-5 rounded-xl border border-primary/20 bg-background/40 hover:border-primary/50 hover:shadow-glow transition-all"
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text font-display">{s.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;

import orgsFallback from "@/data/organizations.json";
import { useContent } from "@/lib/contentClient";
import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";



const OrgLogos: React.FC = () => {
  const { value: orgs } = useContent("organizations", orgsFallback);
  return (
    <section
      aria-label="Professional experience, education and community affiliations"
      className="py-12 border-y border-border/40 bg-card/30 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6"
        >
          Experience · Education · Community
        </motion.p>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {orgs.map((o) => (
            <motion.li
              key={o.short}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group"
            >
              <div
                title={o.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm font-medium text-foreground/80"
              >
                <Building2 className="h-4 w-4 text-primary/80 group-hover:text-primary transition-colors" />
                <span>{o.short}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default OrgLogos;

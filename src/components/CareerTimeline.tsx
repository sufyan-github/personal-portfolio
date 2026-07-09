import timeline from "@/data/timeline.json";
import {
  GraduationCap,
  BookOpen,
  Cpu,
  Users,
  FlaskConical,
  Briefcase,
  Crown,
  Sparkles,
  Target,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  cpu: Cpu,
  users: Users,
  "flask-conical": FlaskConical,
  briefcase: Briefcase,
  crown: Crown,
  sparkles: Sparkles,
  target: Target,
};

const CareerTimeline = () => {
  return (
    <section id="journey" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">My Journey</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From foundational schooling to national-scale AI training — the milestones that shaped my path.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-accent/40 to-transparent md:-translate-x-1/2" />

          <ol className="space-y-10">
            {timeline.map((item, i) => {
              const Icon = iconMap[item.icon] ?? Sparkles;
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={i}
                  className={`relative flex flex-col md:flex-row ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } items-start gap-6`}
                >
                  {/* Node */}
                  <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-2 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20 shadow-md z-10" />

                  {/* Card */}
                  <div className="pl-12 md:pl-0 md:w-1/2">
                    <div
                      className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all ${
                        isLeft ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          {item.phase}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{item.year}</p>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.org}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CareerTimeline;

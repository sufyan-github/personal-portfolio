import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building } from 'lucide-react';
import experienceData from '@/data/experience.json';

type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  period: string;
  website?: string;
  supervisor?: string;
  description: string[];
  featured?: boolean;
  logo?: string; // optional logo file name, e.g., "google.png"
};

const toUrl = (site?: string) => {
  if (!site) return undefined;
  if (site.startsWith('http://') || site.startsWith('https://')) return site;
  return `https://${site}`;
};

const Experience: React.FC = () => {
  const experiences = useMemo(() => experienceData as ExperienceItem[], []);

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Professional Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leading roles in AI education, research, and community initiatives
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <Card
              key={exp.title + exp.company + index}
              className={`mb-8 hover-lift bg-card/50 backdrop-blur-sm animate-slide-up border transition-all duration-300 ${
                exp.featured ? 'border-primary/40 shadow-lg shadow-primary/5' : 'border-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Company Logo - Professional Card Style */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-background to-muted border-2 border-border flex items-center justify-center shadow-md overflow-hidden p-3 hover:border-primary/30 transition-all">
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                          {exp.company
                            .split(' ')
                            .map(word => word[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content - Improved Layout */}
                  <div className="flex-1 min-w-0">
                    {/* Header Section */}
                    <div className="mb-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-1.5 leading-tight">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-lg font-semibold text-primary">
                              {exp.company}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 lg:items-end">
                          <Badge
                            variant="outline"
                            className="w-fit bg-primary/5 text-primary border-primary/20 px-3 py-1"
                          >
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            {exp.period}
                          </Badge>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{exp.location}</span>
                        </div>
                        {exp.website && (
                          <div className="text-accent">
                            <a
                              href={toUrl(exp.website)}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline inline-flex items-center gap-1"
                            >
                              🔗 {exp.website}
                            </a>
                          </div>
                        )}
                        {exp.supervisor && (
                          <div className="text-muted-foreground italic">
                            Supervised by: <span className="font-medium">{exp.supervisor}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Responsibilities Section */}
                    <div className="space-y-2.5 pt-3 border-t border-border">
                      {exp.description.map((desc, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

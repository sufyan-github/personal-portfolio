import educationFallback from "@/data/education.json";
import { useContent } from "@/lib/contentClient";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, School, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import translationsFallback from "@/data/translations.json";

const Academic: React.FC = () => {
  const { value: translations } = useContent("translations", translationsFallback);
  const { language } = useLanguage();
  const t = translations[language].academic;
  
  const { value: education } = useContent("education", educationFallback);
  const academicData = education.map(item => ({ ...item, ...(language === 'bn' && ['university', 'college', 'school'].includes(item.type) ? { title: t[item.type === 'university' ? 'bsc' : item.type === 'college' ? 'hsc' : 'ssc'].title, institution: t[item.type === 'university' ? 'bsc' : item.type === 'college' ? 'hsc' : 'ssc'].institution, description: t[item.type === 'university' ? 'bsc' : item.type === 'college' ? 'hsc' : 'ssc'].description } : {}), icon: item.type === "university" ? GraduationCap : item.type === "college" ? School : BookOpen }));

  return (
    <section id="academics" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">{t.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-primary to-transparent hidden md:block"></div>
            
            {academicData.map((item, index) => {
              const Icon = item.icon;
              const isLeft = index % 2 === 0;
              
              return (
                <div key={item.id} className="relative mb-16 last:mb-0">
                  {/* Timeline node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-8 hidden md:block">
                    <div className="w-16 h-16 rounded-full border-4 border-primary bg-background flex items-center justify-center shadow-lg animate-pulse">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  {/* Mobile Timeline node */}
                  <div className="md:hidden absolute left-4 top-8 transform -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full border-3 border-primary bg-background flex items-center justify-center shadow-lg animate-pulse">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                   {/* Content card */}
                  <div className={`flex ${isLeft ? 'justify-start md:pr-8 pr-4' : 'justify-end md:pl-8 pl-4'}`}>
                    <div className={`w-full max-w-lg ${isLeft ? 'md:mr-8 mr-4' : 'md:ml-8 ml-4'}`}>
                      <Card className="hover-lift glow-border bg-card/50 backdrop-blur-sm animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                        <CardContent className="p-6">
                          {/* Period and CGPA badges */}
                          <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} mb-4 gap-2 flex-wrap`}>
                            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/20">
                              {item.period}
                            </span>
                            {item.cgpa && (
                              <span className="px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-sm font-semibold border border-green-500/20">
                                CGPA: {item.cgpa}
                              </span>
                            )}
                          </div>
                          
                          {/* Title and Institution */}
                          <div className={`${isLeft ? 'text-left' : 'text-right'} mb-3`}>
                            <h3 className="text-xl font-bold mb-2 text-foreground leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-base text-primary font-semibold mb-1">
                              {item.institution}
                            </p>
                            {item.location && (
                              <p className="text-sm text-muted-foreground">
                                {item.location}
                              </p>
                            )}
                          </div>
                          
                          {/* Description */}
                          <p className={`text-muted-foreground leading-relaxed ${isLeft ? 'text-left' : 'text-right'}`}>
                            {item.description}
                          </p>
                          
                          {/* Arrow pointing to timeline */}
                          <div className={`absolute top-8 ${
                            isLeft 
                              ? 'right-0 translate-x-full' 
                              : 'left-0 -translate-x-full'
                          } w-0 h-0`}>
                            <div className={`w-4 h-4 rotate-45 bg-card border-r border-b border-border ${
                              isLeft ? '-translate-x-2' : 'translate-x-2'
                            }`}></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Academic;
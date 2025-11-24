import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, School, BookOpen } from "lucide-react";

const Academic: React.FC = () => {
  const academicData = [
    {
      id: 1,
      title: "Bachelor Of Science In Engineering",
      institution: "Rajshahi University of Engineering & Technology",
      period: "Mar 2021 - 2025",
      cgpa: "3.68 / 4.00",
      description: "Majoring in Computer Science and Engineering with strong fundamentals in algorithms, data structures, operating systems, and computer networks. Advanced skills in image processing, neural networks, signal processing, computer security, VLSI design, and hardware architecture.",
      icon: GraduationCap,
      type: "university"
    },
    {
      id: 2,
      title: "Higher Secondary Certification",
      institution: "New Govt. Degree College",
      period: "2016-2018",
      description: "I completed my HSC in Science, gaining a deeper understanding of core subjects such as Mathematics, Physics, Chemistry, Biology, and ICT, which laid the foundation for my further studies in technology and engineering.",
      icon: School,
      type: "college"
    },
    {
      id: 3,
      title: "Secondary School Certification",
      institution: "Sardha Govt. Pilot High School",
      period: "2014-2016",
      description: "I completed my secondary education with strong fundamentals in Mathematics, Science, and technology subjects, which prepared me for advanced studies in engineering and computer science.",
      icon: BookOpen,
      type: "school"
    }
  ];

  return (
    <section id="academics" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">ACADEMICS</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            My educational journey from high school to university
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
                          {/* Period badge */}
                          <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} mb-4 gap-3 flex-wrap`}>
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                              {item.period}
                            </span>
                            {item.cgpa && (
                              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
                                CGPA: {item.cgpa}
                              </span>
                            )}
                          </div>
                          
                          {/* Title and Institution */}
                          <div className={`${isLeft ? 'text-left' : 'text-right'} mb-4`}>
                            <h3 className="text-xl font-bold mb-2 gradient-text">
                              {item.title}
                            </h3>
                            <p className="text-lg text-muted-foreground font-medium">
                              {item.institution}
                            </p>
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
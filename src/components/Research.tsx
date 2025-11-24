import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Users, Calendar } from "lucide-react";

// =====================================================
// JSON‑DRIVEN RESEARCH SECTION
// Make sure tsconfig.json has:
//   "resolveJsonModule": true,
//   "esModuleInterop": true
// Create these files and adjust paths as you like:
//   - src/data/publications.json
//   - src/data/research_interests.json
//   - src/data/ra_profile.json
// =====================================================

import publications from "@/data/publications.json";
import researchInterests from "@/data/research_interests.json";
import raInfo from "@/data/ra_profile.json";

// ===== Types that mirror the JSON shape =====
export type Publication = {
  title: string;
  conference: string;
  location?: string;
  year: string;
  type: string; // e.g., "Conference Paper"
  description: string;
  keywords?: string[];
  paperUrl?: string;       // optional: link to PDF or arXiv
  conferenceUrl?: string;  // optional: link to conference page
};

export type RAProfile = {
  positionTitle: string; // e.g., "Research Assistant"
  groupName?: string;    // e.g., "Machine Learning Research Group"
  deptLine?: string;     // e.g., "Department of CSE, RUET, Rajshahi-6204, Bangladesh"
  supervisorName?: string;
  profileUrl?: string;   // optional CTA link
  ctaText?: string;      // optional button label (defaults to "View Research Profile")
};

const Research: React.FC = () => {
  const pubs = publications as Publication[];
  const interests = researchInterests as string[];
  const ra = raInfo as RAProfile;

  return (
    <section id="research" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Research & Publications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Contributing to AI research with focus on social impact and healthcare applications
          </p>
        </div>

        {/* Publications */}
        <div className="space-y-8">
          {pubs.map((paper, index) => (
            <Card
              key={paper.title + index}
              className="hover-lift glow-border bg-card/50 backdrop-blur-sm border-primary shadow-glow animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-3 leading-relaxed">{paper.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <Badge className="bg-gradient-accent text-accent-foreground">
                        <FileText className="h-4 w-4 mr-1" />
                        {paper.type}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {paper.conference}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {paper.year}
                      </div>
                    </div>
                    {paper.location && (
                      <p className="text-sm text-accent mb-4">{paper.location}</p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">{paper.description}</p>

                {paper.keywords && paper.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {paper.keywords.map((keyword, keyIndex) => (
                      <Badge
                        key={keyword + keyIndex}
                        variant="secondary"
                        className="hover-lift animate-scale-in"
                        style={{ animationDelay: `${(index * 3 + keyIndex) * 0.05}s` }}
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {paper.paperUrl && paper.paperUrl !== "" && (
                    <Button asChild variant="outline" size="sm" className="glow-border hover-lift">
                      <a href={paper.paperUrl} target="_blank" rel="noreferrer">
                        <FileText className="h-4 w-4 mr-2" /> Download Paper
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm" className="glow-border hover-lift">
                    <a href="#" onClick={(e) => { e.preventDefault(); /* Add reading functionality */ }}>
                      <FileText className="h-4 w-4 mr-2" /> Read Online
                    </a>
                  </Button>
                  {paper.conferenceUrl && paper.conferenceUrl !== "" && (
                    <Button asChild variant="outline" size="sm" className="glow-border hover-lift">
                      <a href={paper.conferenceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> Conference
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Research Interests - Moved Below Publications */}
        <Card className="mt-12 mb-12 hover-lift glow-border bg-card/50 backdrop-blur-sm animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {interests.map((interest, index) => (
                <Badge
                  key={interest + index}
                  className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Research Assistant Info */}
        <Card className="hover-lift glow-border bg-card/50 backdrop-blur-sm animate-slide-up">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{ra.positionTitle}</h3>
            {ra.groupName && (
              <p className="text-lg text-muted-foreground mb-4">{ra.groupName}</p>
            )}
            {ra.deptLine && (
              <p className="text-muted-foreground mb-4">{ra.deptLine}</p>
            )}
            {ra.supervisorName && (
              <p className="text-sm text-accent">Supervised by: {ra.supervisorName}</p>
            )}
            {ra.profileUrl && (
              <div className="mt-6">
                <Button asChild className="bg-gradient-primary hover:shadow-glow">
                  <a href={ra.profileUrl} target="_blank" rel="noreferrer">
                    {ra.ctaText ?? "View Research Profile"}
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Research;

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award } from "lucide-react";
import membershipData from "@/data/memberships.json";

const Memberships: React.FC = () => {
  return (
    <section id="memberships" className="py-20 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
              <Users className="h-4 w-4 mr-2" />
              Professional Network
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text font-display">
            {membershipData.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {membershipData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipData.memberships.map((membership, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={membership.logo}
                      alt={`${membership.name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<Award class="w-8 h-8 text-primary" />';
                      }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {membership.role}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {membership.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {membership.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Active in {membershipData.memberships.length} Professional Organizations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Memberships;

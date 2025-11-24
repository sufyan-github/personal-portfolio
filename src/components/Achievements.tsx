import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Medal,
  Star,
  Target,
  Users,
  Code,
  Presentation,
  Award,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import achievementsData from '@/data/achievements.json';

// Icon map to match string names in JSON with real Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Medal,
  Star,
  Target,
  Users,
  Code,
  Presentation,
  Award,
};

const Achievements = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const achievements = achievementsData.map(a => ({
    ...a,
    icon: iconMap[a.icon as keyof typeof iconMap] || Trophy,
  }));

  const categories = ['All', ...new Set(achievements.map(a => a.category))];
  const filteredAchievements = activeCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  return (
    <section id="achievements" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500 animate-bounce" />
            <h2 className="text-5xl font-bold gradient-text font-display">
              Achievements & Milestones
            </h2>
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Key accomplishments and recognitions throughout my academic and
            professional journey
          </p>
        </div>

        {/* Stats Summary - Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-5xl mx-auto">
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border-yellow-500/20 group">
            <CardContent className="p-4 md:p-6">
              <Trophy className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 md:mb-3 text-yellow-500 group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">8+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                Achievements
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm border-blue-500/20 group">
            <CardContent className="p-4 md:p-6">
              <Award className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 md:mb-3 text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">7+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                Certifications
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm border-purple-500/20 group">
            <CardContent className="p-4 md:p-6">
              <Star className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 md:mb-3 text-purple-500 group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">3</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                Publications
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift glow-border bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm border-green-500/20 group">
            <CardContent className="p-4 md:p-6">
              <Users className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 md:mb-3 text-green-500 group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">50+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                Students Mentored
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`cursor-pointer hover-lift px-5 py-2.5 text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-gradient-primary text-white shadow-lg shadow-primary/50'
                  : 'border-primary/30 hover:bg-primary/10 hover:border-primary/50'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'All' && <Zap className="h-4 w-4 mr-1" />}
              {category}
            </Badge>
          ))}
        </div>

        {/* Achievements Grid - Masonry Style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredAchievements.map((achievement, index) => (
            <Card
              key={achievement.id}
              className="hover-lift glow-border bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm group overflow-hidden animate-scale-in border-2 hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <CardHeader className="text-center pb-3 relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                
                <div className="flex justify-center mb-3 relative">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
                    <div className="relative p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
                      <achievement.icon
                        className={`h-10 w-10 ${achievement.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-base md:text-lg mb-2 leading-tight font-display group-hover:text-primary transition-colors">
                  {achievement.title}
                </CardTitle>
                
                <p className="text-primary font-semibold text-sm">
                  {achievement.subtitle}
                </p>
                
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/30 mt-2 text-xs"
                >
                  {achievement.category}
                </Badge>
              </CardHeader>

              <CardContent className="pt-0 px-4 pb-4">
                <p className="text-muted-foreground text-sm mb-3 text-center leading-relaxed">
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="text-xs border-border/50">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {achievement.date}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-16">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">
              No achievements found in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;

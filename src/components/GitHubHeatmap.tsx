import { useContent } from "@/lib/contentClient";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Github, Activity, Calendar, Star } from "lucide-react";
// import GitHubCalendar from 'react-github-calendar';

// const GitHubHeatmap = () => {
//   const githubStats = [
//     { label: "Public Repos", value: "25+", icon: Github },
//     { label: "Total Commits", value: "500+", icon: Activity },
//     { label: "Contributions", value: "365+", icon: Calendar },
//     { label: "Stars Earned", value: "50+", icon: Star }
//   ];

//   return (
//     <section id="github" className="py-20 bg-background">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold mb-4 gradient-text">GitHub Activity</h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             My coding journey and open-source contributions
//           </p>
//         </div>

//         {/* GitHub Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
//           {githubStats.map((stat, index) => (
//             <Card 
//               key={index}
//               className="text-center hover-lift glow-border bg-card/50 backdrop-blur-sm animate-scale-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <CardContent className="p-6">
//                 <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
//                 <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* GitHub Contribution Calendar */}
//         <Card className="hover-lift glow-border bg-card/50 backdrop-blur-sm">
//           <CardHeader>
//             <CardTitle className="flex items-center justify-center">
//               <Github className="h-6 w-6 mr-3" />
//               Contribution Activity
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="flex justify-center">
//               <GitHubCalendar 
//                 username="sufyan-github" 
//                 colorScheme="dark"
//                 theme={{
//                   light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
//                   dark: ['hsl(var(--muted))', 'hsl(var(--primary) / 0.3)', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary))']
//                 }}
//                 fontSize={12}
//               />
//             </div>
//             <div className="flex justify-center mt-6">
//               <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
//                 <a 
//                   href="https://github.com/sufyan-github" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center"
//                 >
//                   <Github className="h-4 w-4 mr-2" />
//                   View Full Profile
//                 </a>
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </section>
//   );
// };

// export default GitHubHeatmap;


import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Activity, Calendar as CalIcon, Star } from "lucide-react";
import GitHubCalendar from "react-github-calendar";

// ================================================
// JSON‑DRIVEN GITHUB SECTION WITH LAZY CALENDAR
// Data file: src/data/github.json (example below)
// Ensure tsconfig: "resolveJsonModule": true, "esModuleInterop": true
// ================================================

import ghConfig from "@/data/github.json";

type Stat = { label: string; value: string; icon: "repos" | "commits" | "contribs" | "stars" };

type GitHubConfig = {
  username: string; // e.g., "sufyan-github"
  stats: Stat[];    // displayed metric cards
  theme?: "light" | "dark" | "auto";
  fontSize?: number; // calendar font size
  profileUrl?: string; // optional override; defaults to https://github.com/${username}
};

const IconFor: Record<Stat["icon"], typeof Github> = {
  repos: Github,
  commits: Activity,
  contribs: CalIcon,
  stars: Star,
};

const useInView = (rootMargin = "-50px 0px"): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
};

const GitHubActivity: React.FC = () => {
  const { value: cfg } = useContent<GitHubConfig>("github", ghConfig as GitHubConfig);
  const [mountKey] = useState(() => Math.random()); // force unique render to avoid hydration mismatches
  const [rootRef, inView] = useInView();

  const scheme = cfg.theme ?? "auto";
  const isDark = scheme === "dark" || (scheme === "auto" && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  const light = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]; // GitHub light
  const dark = ["hsl(var(--muted))", "hsl(var(--primary) / 0.3)", "hsl(var(--primary) / 0.6)", "hsl(var(--primary) / 0.8)", "hsl(var(--primary))"]; // Tailwind CSS-var driven

  const profileUrl = cfg.profileUrl || `https://github.com/${cfg.username}`;

  return (
    <section id="github" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">GitHub Activity</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            My coding journey and open-source contributions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {(cfg.stats || []).map((stat, index) => {
            const Icon = IconFor[stat.icon] ?? Github;
            return (
              <Card
                key={stat.label + index}
                className="text-center hover-lift glow-border bg-card/50 backdrop-blur-sm animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contribution Calendar */}
        <Card className="hover-lift glow-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Github className="h-6 w-6 mr-3" />
              Contribution Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div ref={rootRef} className="flex justify-center min-h-[148px]">
              {inView ? (
                <GitHubCalendar
                  key={mountKey}
                  username={cfg.username}
                  colorScheme={isDark ? "dark" : "light"}
                  theme={{ light, dark }}
                  fontSize={cfg.fontSize ?? 12}
                />
              ) : (
                // simple skeleton until in view
                <div className="w-full max-w-[740px] h-[140px] animate-pulse bg-muted/40 rounded" />
              )}
            </div>
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Github className="h-4 w-4 mr-2" /> View Full Profile
                </a>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GitHubActivity;
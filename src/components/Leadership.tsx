import experience from "@/data/experience.json";
import { Crown, MapPin, Calendar, ExternalLink } from "lucide-react";

// Keywords that identify leadership roles in experience data
const LEADERSHIP_KEYWORDS = [
  "president",
  "director",
  "founding",
  "campus representative",
  "campus ambassador",
  "officer",
  "committee",
  "executive member",
];

const Leadership = () => {
  const roles = (experience as any[]).filter((e) =>
    LEADERSHIP_KEYWORDS.some((k) => e.title.toLowerCase().includes(k))
  );

  if (roles.length === 0) return null;

  return (
    <section id="leadership" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Leadership & Service
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4 gradient-text">Leading with Purpose</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founding roles, executive positions and volunteer leadership across academia, technology and community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {roles.map((role, i) => (
            <article
              key={i}
              className="group bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-primary/90 font-medium">{role.company}</p>
                </div>
                {role.website && (
                  <a
                    href={role.website}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${role.company}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {role.period}
                </span>
                {role.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {role.location.split(",")[0]}
                  </span>
                )}
              </div>

              <ul className="space-y-1.5 text-sm text-foreground/80">
                {(role.description as string[]).slice(0, 3).map((d, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;

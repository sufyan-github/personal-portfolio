import data from "@/data/community_impact.json";
import { HeartHandshake } from "lucide-react";

const CommunityImpact = () => {
  return (
    <section id="community" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <HeartHandshake className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Community
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4 gradient-text">{data.headline}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{data.subtitle}</p>
        </div>

        {/* Impact stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-14">
          {data.stats.map((s, i) => (
            <div
              key={i}
              className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-primary/40 transition-all"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-sm font-medium text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.context}</div>
            </div>
          ))}
        </div>

        {/* Key initiatives */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-lg font-semibold text-center text-foreground mb-6">
            Signature Initiatives
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.initiatives.map((it, i) => (
              <div
                key={i}
                className="bg-card/40 border border-border rounded-lg p-5 hover:border-accent/40 transition-all"
              >
                <h4 className="font-semibold text-foreground mb-1">{it.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{it.description}</p>
                <p className="text-xs text-primary/80 font-medium">{it.org}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpact;

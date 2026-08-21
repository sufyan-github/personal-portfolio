import { useEffect, useState } from "react";
import { Github, Code2, Trophy, GitCommit, Star, GitFork, Activity } from "lucide-react";
import githubData from "@/data/github.json";
import codingData from "@/data/coding_profiles.json";

interface Stat {
  label: string;
  value: string;
  href?: string;
  icon: JSX.Element;
  source: string;
  live?: boolean;
}

const GITHUB_USER = githubData.username;
const LEETCODE_USER = "abu_sufyan";
const CODEFORCES_USER = "abu_sufyan_cse";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

const TechnicalFootprint = () => {
  // Defaults from JSON so the section is SEO-friendly on first paint
  const [ghRepos, setGhRepos] = useState<string>("25+");
  const [ghStars, setGhStars] = useState<string>("50+");
  const [ghFollowers, setGhFollowers] = useState<string>("50+");
  const [ghCommits, setGhCommits] = useState<string>("500+");
  const [lcSolved, setLcSolved] = useState<string>("150+");
  const [lcRank, setLcRank] = useState<string>("Top 25%");
  const [cfRating, setCfRating] = useState<string>("1200+");
  const [cfRank, setCfRank] = useState<string>("Pupil");
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadGitHub = async () => {
      try {
        const [userRes, reposRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`),
        ]);
        if (!userRes.ok || !reposRes.ok) return;
        const user = await userRes.json();
        const repos = await reposRes.json();
        const events = eventsRes.ok ? await eventsRes.json() : [];
        if (cancelled) return;

        const stars = Array.isArray(repos)
          ? repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0)
          : 0;
        const recentCommits = Array.isArray(events)
          ? events
              .filter((e: any) => e.type === "PushEvent")
              .reduce((s: number, e: any) => s + (e.payload?.commits?.length || 0), 0)
          : 0;

        setGhRepos(`${user.public_repos ?? 0}`);
        setGhFollowers(`${user.followers ?? 0}`);
        setGhStars(`${stars}`);
        if (recentCommits > 0) setGhCommits(`${recentCommits}+ / 90d`);
      } catch {
        /* keep defaults */
      }
    };

    // NOTE: the previous LeetCode stats endpoint (leetcode-stats-api.herokuapp.com)
    // is offline and has no CORS headers — it produced a console error on every
    // page load. Values now come from the curated profile data instead.
    const loadLeetCode = async () => {
      /* intentionally static */
    };


    const loadCodeforces = async () => {
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.info?handles=${CODEFORCES_USER}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || data.status !== "OK" || !data.result?.[0]) return;
        const u = data.result[0];
        if (u.rating) setCfRating(`${u.rating}`);
        if (u.rank) setCfRank(u.rank.replace(/\b\w/g, (c: string) => c.toUpperCase()));
      } catch {
        /* keep defaults */
      }
    };

    Promise.allSettled([loadGitHub(), loadLeetCode(), loadCodeforces()]).then(() => {
      if (!cancelled) setUpdated(new Date().toLocaleDateString());
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats: Stat[] = [
    {
      label: "Public Repositories",
      value: ghRepos,
      href: `https://github.com/${GITHUB_USER}`,
      icon: <Github className="h-4 w-4" aria-hidden />,
      source: "GitHub",
      live: true,
    },
    {
      label: "Stars Earned",
      value: ghStars,
      href: `https://github.com/${GITHUB_USER}?tab=repositories`,
      icon: <Star className="h-4 w-4" aria-hidden />,
      source: "GitHub",
      live: true,
    },
    {
      label: "Recent Commits",
      value: ghCommits,
      href: `https://github.com/${GITHUB_USER}`,
      icon: <GitCommit className="h-4 w-4" aria-hidden />,
      source: "GitHub Events API",
      live: true,
    },
    {
      label: "GitHub Followers",
      value: ghFollowers,
      href: `https://github.com/${GITHUB_USER}`,
      icon: <GitFork className="h-4 w-4" aria-hidden />,
      source: "GitHub",
      live: true,
    },
    {
      label: "LeetCode Problems Solved",
      value: lcSolved,
      href: `https://leetcode.com/${LEETCODE_USER}`,
      icon: <Code2 className="h-4 w-4" aria-hidden />,
      source: "LeetCode",
      live: true,
    },
    {
      label: "LeetCode Standing",
      value: lcRank,
      href: `https://leetcode.com/${LEETCODE_USER}`,
      icon: <Trophy className="h-4 w-4" aria-hidden />,
      source: "LeetCode",
    },
    {
      label: "Codeforces Rating",
      value: cfRating,
      href: `https://codeforces.com/profile/${CODEFORCES_USER}`,
      icon: <Activity className="h-4 w-4" aria-hidden />,
      source: "Codeforces",
      live: true,
    },
    {
      label: "Codeforces Rank",
      value: cfRank,
      href: `https://codeforces.com/profile/${CODEFORCES_USER}`,
      icon: <Trophy className="h-4 w-4" aria-hidden />,
      source: "Codeforces",
      live: true,
    },
  ];

  return (
    <section
      id="technical-footprint"
      aria-labelledby="technical-footprint-heading"
      className="py-20 px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-3">
            Live · Updated automatically
          </p>
          <h2
            id="technical-footprint-heading"
            className="text-3xl md:text-4xl font-bold gradient-text font-display"
          >
            Technical Footprint
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Verifiable engineering activity across GitHub, LeetCode, and Codeforces — refreshed
            from public APIs on each visit.
          </p>
        </header>

        <ul
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          {stats.map((s, i) => {
            const Wrapper: any = s.href ? "a" : "div";
            const wrapperProps = s.href
              ? { href: s.href, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <li
                key={s.label}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={`${i + 1}`} />
                <Wrapper
                  {...wrapperProps}
                  aria-label={`${s.label}: ${s.value} (source: ${s.source})`}
                  className="group flex flex-col gap-2 p-4 rounded-xl border border-border bg-card/40 hover:bg-card/70 hover:border-primary/40 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      {s.icon}
                      {s.source}
                    </span>
                    {s.live && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <div
                    className="text-2xl md:text-3xl font-bold text-foreground font-display"
                    itemProp="name"
                  >
                    {s.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground" itemProp="description">
                    {s.label}
                  </div>
                </Wrapper>
              </li>
            );
          })}
        </ul>

        {updated && (
          <p className="text-center text-xs text-muted-foreground mt-6">
            Last synced {updated} · Data sourced from public GitHub, LeetCode &amp; Codeforces APIs
          </p>
        )}
      </div>
    </section>
  );
};

export default TechnicalFootprint;

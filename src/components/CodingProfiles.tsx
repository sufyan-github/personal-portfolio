import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trophy, Star, Award } from "lucide-react";
import codingData from "@/data/coding_profiles.json";

interface Profile {
  platform: string;
  username: string;
  profile_url: string;
  stats: Record<string, string | string[]>;
  badge_color: string;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "LeetCode":
      return <Trophy className="h-6 w-6" />;
    case "Codeforces":
      return <Star className="h-6 w-6" />;
    case "HackerRank":
      return <Award className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

const CodingProfiles = () => {
  const profiles = codingData.profiles as Profile[];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {codingData.title}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {codingData.subtitle}
          </p>
        </motion.div>

        {/* Profiles Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {profiles.map((profile) => (
            <motion.div
              key={profile.platform}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group overflow-hidden bg-card/80 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 h-full">
                <CardContent className="p-6">
                  {/* Platform Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-br ${profile.badge_color} shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {getPlatformIcon(profile.platform)}
                    </motion.div>
                  </div>

                  {/* Platform Name */}
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {profile.platform}
                  </h3>

                  {/* Username */}
                  <p className="text-sm text-muted-foreground mb-4 font-mono">
                    @{profile.username}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-6">
                    {Object.entries(profile.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-foreground font-semibold">
                          {Array.isArray(value) ? value.join(", ") : value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* View Profile Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full border-2 border-primary/40 hover:border-primary hover:bg-primary/20"
                    >
                      <a
                        href={profile.profile_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </a>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CodingProfiles;

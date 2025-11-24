import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  tags: string[] | null;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Latest Articles</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights on AI, machine learning, and technology
            </p>
          </div>
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">More articles coming soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Latest Articles</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights on AI, machine learning, and technology trends
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card 
              key={post.id}
              className="hover-lift glow-border bg-card/50 backdrop-blur-sm animate-scale-in h-full flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {post.featured_image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardHeader className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getReadingTime(post.content)} min read
                    </div>
                  </div>
                  
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex}
                          variant="secondary"
                          className="text-xs hover-lift"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  variant="outline" 
                  className="w-full glow-border hover-lift"
                  onClick={() => {
                    // Track analytics
                    supabase.from('analytics').insert([
                      {
                        event_type: 'blog_post_view',
                        metadata: { post_id: post.id, post_title: post.title }
                      }
                    ]);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="glow-border hover-lift">
            <BookOpen className="h-5 w-5 mr-2" />
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
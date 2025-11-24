import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Linkedin, Github, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import contactInfoData from '@/data/contactInfo.json';
import availabilityData from '@/data/availability.json';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Valid email required').max(255),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

const iconsMap: Record<string, any> = {
  Mail, Phone, MapPin, Linkedin, Github,
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const { error } = await supabase.from('contacts').insert([{
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }]);

      if (error) throw error;

      await supabase.functions.invoke('send-contact-email', {
        body: validatedData,
      });

      toast({
        title: 'Message sent successfully!',
        description: "Thanks for reaching out. I'll respond soon.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error sending message',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Get In Touch
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's collaborate on exciting projects or discuss opportunities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Contact Info - Sidebar */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-card/80 backdrop-blur-xl border-2 border-primary/30 shadow-xl shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfoData.map((contact, index) => {
                  const Icon = iconsMap[contact.icon];
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{contact.label}</p>
                        {contact.link ? (
                          <a
                            href={contact.link}
                            className="text-foreground hover:text-primary transition-colors break-words font-medium"
                            target={contact.link.startsWith('http') ? '_blank' : undefined}
                            rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {contact.value}
                          </a>
                        ) : (
                          <p className="text-foreground break-words font-medium">{contact.value}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-xl border-2 border-accent/30 shadow-xl shadow-accent/10">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Available For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availabilityData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Badge variant="secondary" className="bg-secondary/50 backdrop-blur-sm text-foreground border border-secondary/50">
                        {item}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-card/80 backdrop-blur-xl border-2 border-primary/30 shadow-2xl shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="bg-background/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                      />
                    </motion.div>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">Email *</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="bg-background/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">Subject *</label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                      className="bg-background/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">Message *</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your project or inquiry..."
                      rows={6}
                      required
                      className="bg-background/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/50 font-semibold border-0 text-white"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import { motion } from 'framer-motion';
import { Compass, Heart, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Compass className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">About TravelLog</h1>
            <p className="text-xl max-w-2xl mx-auto mt-4">
              Connecting travelers worldwide through shared experiences and AI-powered discovery
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center"
          >
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              At TravelLog, we believe that every journey has a story worth sharing. Our platform
              combines the power of community-driven content with cutting-edge AI technology to
              help travelers discover their perfect destinations and share their adventures with
              the world.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community First</h3>
                <p className="text-muted-foreground">
                  Building a supportive community where travelers inspire and help each other
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Authentic Experiences</h3>
                <p className="text-muted-foreground">
                  Promoting genuine travel stories and real experiences from real travelers
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Compass className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Smart Discovery</h3>
                <p className="text-muted-foreground">
                  Using AI to help you find destinations that match your unique travel style
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">How does the AI recommendation system work?</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your preferences, travel history, and interests to suggest
                destinations that match your unique travel style. It considers factors like budget,
                trip duration, activities, and more.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Is TravelLog free to use?</h3>
              <p className="text-muted-foreground">
                Yes! Creating an account, sharing posts, and browsing content is completely free.
                Premium features for advanced AI recommendations may be available in the future.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">How can I contribute?</h3>
              <p className="text-muted-foreground">
                Share your travel experiences by posting photos and stories, write reviews of
                destinations you've visited, and engage with the community through comments and likes.
              </p>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-sunset text-secondary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Mail className="h-12 w-12 mx-auto" />
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-secondary hover:bg-white/90">
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}

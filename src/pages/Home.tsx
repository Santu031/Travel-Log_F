import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Users, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import api from '@/services/api';
import type { Post } from '@/types';

export default function Home() {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/gallery/posts/trending');
      setTrendingPosts(data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch trending posts:', error);
      // Fallback to mock data if API fails
      const mockPosts: Post[] = [
        {
          id: '1',
          userId: '1',
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          images: [
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
            'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
          ],
          title: 'Sunset in Santorini',
          caption: 'The most breathtaking sunset I\'ve ever witnessed. Santorini never disappoints! 🌅',
          tags: ['sunset', 'greece', 'santorini', 'travel'],
          location: 'Santorini, Greece',
          likes: 342,
          comments: 28,
          createdAt: '2024-03-15T18:30:00Z',
        },
        {
          id: '2',
          userId: '1',
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'],
          title: 'Korean Street Food',
          caption: 'Exploring the incredible street food scene in Seoul 🍜',
          tags: ['food', 'korea', 'seoul', 'streetfood'],
          location: 'Seoul, South Korea',
          likes: 256,
          comments: 19,
          createdAt: '2024-03-12T12:00:00Z',
        },
        {
          id: '3',
          userId: '1',
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
          title: 'Mountain Hiking',
          caption: 'The journey is always worth it when you reach the top 🏔️',
          tags: ['hiking', 'mountains', 'nature', 'adventure'],
          location: 'Swiss Alps',
          likes: 421,
          comments: 35,
          createdAt: '2024-03-10T09:15:00Z',
        },
      ];
      setTrendingPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden min-h-screen flex items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600')] bg-cover bg-center" 
        />
        <div className="relative container mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Discover Your Next Adventure
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-primary-foreground/90"
            >
              Share your travel stories and get AI-powered recommendations for your perfect trip
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform" asChild>
                <Link to="/gallery">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Gallery
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-transform" asChild>
                <Link to="/ai-recs">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Recommendations
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center space-y-4 p-6 rounded-lg hover:bg-card transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              >
                <MapPin className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <h3 className="text-xl font-semibold">Share Your Journey</h3>
              <p className="text-muted-foreground">
                Post photos and stories from your travels to inspire others
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center space-y-4 p-6 rounded-lg hover:bg-card transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              >
                <Sparkles className="h-10 w-10 text-secondary-foreground" />
              </motion.div>
              <h3 className="text-xl font-semibold">AI-Powered Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized destination suggestions based on your preferences
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center space-y-4 p-6 rounded-lg hover:bg-card transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              >
                <Users className="h-10 w-10 text-foreground" />
              </motion.div>
              <h3 className="text-xl font-semibold">Connect with Travelers</h3>
              <p className="text-muted-foreground">
                Join a community of adventurers and share your experiences
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Trending Now</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/gallery">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-sunset text-secondary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Join thousands of travelers sharing their adventures and discovering new destinations
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" variant="secondary" className="bg-white text-secondary hover:bg-white/90 hover:scale-105 transition-transform" asChild>
              <Link to="/account/register">Get Started Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
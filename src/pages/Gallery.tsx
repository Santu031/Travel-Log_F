import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoryBar from '@/components/StoryBar';
import SearchFriends from '@/components/SearchFriends';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import type { Post } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/gallery/posts');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 md:py-24">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920" 
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/60 to-accent/70 backdrop-blur-[2px]" />
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-40 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Explore <span className="text-accent">Travel</span> Gallery
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Discover amazing travel photos from around the world. Share your own adventures and connect with fellow travelers.
            </motion.p>
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate('/gallery/upload')}
                >
                  Share Your Adventure
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story Bar */}
            <StoryBar />

            {/* Posts Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Post Header */}
                      <div className="p-4 flex items-center gap-3">
                        <img 
                          src={post.userAvatar} 
                          alt={post.userName}
                          className="h-10 w-10 rounded-full ring-2 ring-primary/30"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{post.userName}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{post.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Image */}
                      <div className="relative">
                        <img 
                          src={post.images[0]} 
                          alt={post.title}
                          className="w-full h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      {/* Post Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-foreground mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-3">{post.caption}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Post Stats */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                              <Heart className="h-5 w-5" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="h-5 w-5" />
                              <span>{post.comments}</span>
                            </button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => navigate(`/gallery`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your travel adventures!
                  </p>
                  {isAuthenticated && (
                    <Button 
                      onClick={() => navigate('/gallery/upload')}
                      className="glass backdrop-blur-md bg-white/20 border border-white/30 text-foreground hover:bg-white/30"
                    >
                      Upload Your First Post
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SearchFriends />
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import StoryBar from '@/components/StoryBar';
import SearchFriends from '@/components/SearchFriends';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import type { Post } from '@/services/mockData';
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
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Story Bar */}
            <StoryBar />

            {/* Posts */}
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="insta-post">
                    <div className="skeleton h-12 rounded-none" />
                    <div className="skeleton aspect-square rounded-none" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-4 w-20" />
                      <div className="skeleton h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="text-center py-16 bg-card rounded-lg">
                <p className="text-muted-foreground text-lg">No posts to show</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <SearchFriends />
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        {isAuthenticated && (
          <Button
            size="lg"
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
            onClick={() => navigate('/gallery/upload')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

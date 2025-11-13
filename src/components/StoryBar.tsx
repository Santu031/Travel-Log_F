import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface Story {
  id: string;
  userName: string;
  userAvatar: string;
  hasNewStory: boolean;
}

export default function StoryBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // Fetch stories from the backend
      // For now, we'll use a simplified approach since we don't have a specific stories endpoint
      // In a real implementation, this would fetch actual stories from the backend
      
      // We'll create a placeholder story for the current user
      const currentUserStory: Story = {
        id: 'current-user',
        userName: 'You',
        userAvatar: user?.avatar || '',
        hasNewStory: false
      };
      
      // Fetch some recent users who have posted photos
      const response = await api.get('/gallery/users');
      const userStories: Story[] = response.data.slice(0, 5).map((user: any) => ({
        id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        hasNewStory: true
      }));
      
      setStories([currentUserStory, ...userStories]);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      // Fallback to empty array if fetch fails
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-4 mb-6"
      >
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="rounded-full bg-muted animate-pulse h-16 w-16" />
              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-4 mb-6"
    >
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1 min-w-[70px] group"
          >
            <div className={`${story.hasNewStory ? 'story-ring' : 'p-[2px] bg-muted'} rounded-full transition-all duration-300`}>
              <div className="bg-background p-[3px] rounded-full">
                <Avatar className="h-16 w-16 transition-transform group-hover:scale-105">
                  {index === 0 ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <Plus className="h-6 w-6 text-primary-foreground" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage src={story.userAvatar} alt={story.userName} />
                      <AvatarFallback>{story.userName[0]}</AvatarFallback>
                    </>
                  )}
                </Avatar>
              </div>
            </div>
            <span className="text-xs font-medium truncate w-full text-center group-hover:text-primary transition-colors">
              {story.userName}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
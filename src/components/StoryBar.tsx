import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/services/api';
import type { Story } from '@/services/mockData';

export default function StoryBar() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await api.get('/stories');
        setStories(data.stories);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="glass rounded-card-xl p-4 mb-6">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <button
            key={story.userId}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
            aria-label={`View ${story.userName}'s story`}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-teal p-0.5">
                <div className="w-full h-full rounded-full bg-frost dark:bg-card p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={story.avatar} alt={story.userName} />
                    <AvatarFallback>{story.userName[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-navy dark:text-foreground truncate max-w-[64px]">
              {story.userName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

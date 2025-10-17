import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

interface Story {
  id: string;
  userName: string;
  userAvatar: string;
  hasNewStory: boolean;
}

const mockStories: Story[] = [
  { id: '1', userName: 'You', userAvatar: '', hasNewStory: false },
  { id: '2', userName: 'Sarah', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', hasNewStory: true },
  { id: '3', userName: 'Mike', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', hasNewStory: true },
  { id: '4', userName: 'Emma', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', hasNewStory: true },
  { id: '5', userName: 'John', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', hasNewStory: false },
  { id: '6', userName: 'Lisa', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', hasNewStory: true },
];

export default function StoryBar() {
  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {mockStories.map((story, index) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-1 min-w-[70px] group"
          >
            <div className={`${story.hasNewStory ? 'story-ring' : 'p-[2px] bg-muted'} rounded-full`}>
              <div className="bg-background p-[3px] rounded-full">
                <Avatar className="h-16 w-16">
                  {index === 0 ? (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Plus className="h-6 w-6 text-muted-foreground" />
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
            <span className="text-xs font-medium truncate w-full text-center">
              {story.userName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Post } from '@/services/mockData';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <Card
      className="overflow-hidden card-hover cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {post.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            +{post.images.length - 1}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.userAvatar} alt={post.userName} />
            <AvatarFallback>{post.userName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{post.userName}</span>
        </div>

        {/* Title & Caption */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.caption}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{post.location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Heart className={`h-4 w-4 ${post.liked ? 'fill-primary text-primary' : ''}`} />
            <span>{post.likes}</span>
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Bookmark, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/services/mockData';
import api from '@/services/api';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      setLiked(data.likedByUser);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div className="card-glass overflow-hidden group">
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={post.images[currentImageIndex].url}
          alt={post.caption}
          className="w-full h-full object-cover cursor-pointer"
          onClick={onClick}
        />
        {post.images.length > 1 && (
          <>
            <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs font-medium">
              {currentImageIndex + 1}/{post.images.length}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {post.images.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        {/* Overlay gradient for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-20 img-overlay pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={post.userAvatar} alt={post.userName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {post.userName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-bold text-navy dark:text-foreground">{post.userName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-gray">
              <MapPin className="h-3 w-3" />
              <span>{post.location.name}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="flex items-center gap-1.5 text-sm transition-colors group/like"
              onClick={handleLike}
              whileTap={{ scale: 0.9 }}
              aria-label={liked ? 'Unlike post' : 'Like post'}
            >
              <motion.div
                animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    liked
                      ? 'fill-primary text-primary'
                      : 'text-navy dark:text-foreground group-hover/like:text-primary'
                  }`}
                />
              </motion.div>
              <span className="font-medium text-navy dark:text-foreground">{likesCount}</span>
            </motion.button>
            <button
              className="flex items-center gap-1.5 text-sm text-navy dark:text-foreground hover:text-teal transition-colors"
              onClick={onClick}
              aria-label="View comments"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.commentsCount}</span>
            </button>
            <button
              className="text-navy dark:text-foreground hover:text-teal transition-colors"
              aria-label="Share post"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <button
            className="text-navy dark:text-foreground hover:text-primary transition-colors"
            aria-label="Save post"
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>

        {/* Caption */}
        <div>
          <p className="text-sm text-navy dark:text-foreground">
            <span className="font-bold mr-2">{post.userName}</span>
            <span className="line-clamp-2">{post.caption}</span>
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-teal/10 text-teal hover:bg-teal/20 border-0"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

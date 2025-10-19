import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Post } from '@/services/mockData';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <motion.div 
      className="insta-post" 
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary transition-all">
            <AvatarImage src={post.userAvatar} alt={post.userName} />
            <AvatarFallback>{post.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer">{post.userName}</span>
            {post.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden relative bg-muted group">
        <motion.img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        {post.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            1/{post.images.length}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLike}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`h-6 w-6 ${isLiked ? 'fill-destructive text-destructive' : ''}`}
                  />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageCircle className="h-6 w-6" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2, rotate: 15 }} whileTap={{ scale: 0.8 }}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Send className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
            >
              <Bookmark className={`h-6 w-6 ${isSaved ? 'fill-foreground' : ''}`} />
            </Button>
          </motion.div>
        </div>

        {/* Likes count */}
        <p className="text-sm font-semibold">{likes} likes</p>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.userName}</span>
          <span>{post.caption}</span>
        </div>

        {/* Comments preview */}
        {post.comments > 0 && (
          <button className="text-sm text-muted-foreground">
            View all {post.comments} comments
          </button>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, i) => (
              <motion.span 
                key={tag} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

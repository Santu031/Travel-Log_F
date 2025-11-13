import { Star, ThumbsUp, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from 'sonner';

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
}

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  
  // Check if the current user is the author of the review
  const isAuthor = user?.name === review.author;
  
  const handleDelete = async () => {
    if (!isAuthor) return;
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${review.id}`);
        toast.success('Review deleted successfully');
        onDelete?.(review.id);
      } catch (error) {
        console.error('Failed to delete review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  return (
    <Card className="p-6 group glass backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-white/30 group-hover:ring-white/60 transition-all duration-300">
            <AvatarImage src={review.avatar || ''} alt={review.author} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {review.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-white group-hover:text-white/90 transition-colors">
              {review.author}
            </h4>
            <p className="text-sm text-white/70">{review.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-all duration-300 ${
                  i < review.rating ? 'fill-yellow-400 text-yellow-400 group-hover:scale-110' : 'text-white/40'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-white/70 hover:text-red-400 hover:bg-white/20 p-2 h-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-white">{review.title}</h3>
        <p className="text-white/80 leading-relaxed">{review.body}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
        <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-all duration-300 hover:scale-105 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20">
          <ThumbsUp className="h-4 w-4 transition-transform hover:rotate-12" />
          <span>Helpful ({review.helpful})</span>
        </button>
        <span className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full">
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}
import { Star, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { Review } from '@/services/mockData';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-6 card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.userAvatar} alt={review.userName} />
            <AvatarFallback>{review.userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{review.userName}</h4>
            <p className="text-sm text-muted-foreground">{review.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? 'fill-accent text-accent' : 'text-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{review.title}</h3>
        <p className="text-muted-foreground">{review.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({review.helpful})</span>
        </button>
        <span className="text-sm text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}

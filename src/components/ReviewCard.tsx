import { Star, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { Review } from '@/services/mockData';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-6 group glass backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-white/30 group-hover:ring-white/60 transition-all duration-300">
            <AvatarImage src={review.userAvatar} alt={review.userName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">{review.userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-white group-hover:text-white/90 transition-colors">{review.userName}</h4>
            <p className="text-sm text-white/70">{review.destination}</p>
          </div>
        </div>
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
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-white">{review.title}</h3>
        <p className="text-white/80 leading-relaxed">{review.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
        <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-all duration-300 hover:scale-105 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20">
          <ThumbsUp className="h-4 w-4 transition-transform hover:rotate-12" />
          <span>Helpful ({review.helpful})</span>
        </button>
        <span className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}

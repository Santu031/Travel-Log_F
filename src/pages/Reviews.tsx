import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReviewCard from '@/components/ReviewCard';
import api from '@/services/api';
import type { Review } from '@/services/mockData';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');

  useEffect(() => {
    fetchReviews();
  }, [searchTerm, ratingFilter, sortBy]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reviews', {
        params: {
          destination: searchTerm || undefined,
          rating: ratingFilter || undefined,
          sort: sortBy,
        },
      });
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-5xl font-bold mb-3 text-gradient-primary">Travel Reviews</h1>
          <p className="text-muted-foreground text-lg">Read honest reviews from fellow travelers</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-card p-6 rounded-lg shadow-sm"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Ratings</SelectItem>
              <SelectItem value="5">
                <div className="flex items-center gap-1">
                  5 <Star className="h-3 w-3 fill-accent text-accent" />
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-1">
                  4+ <Star className="h-3 w-3 fill-accent text-accent" />
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-1">
                  3+ <Star className="h-3 w-3 fill-accent text-accent" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="skeleton h-52 rounded-lg" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-card rounded-lg"
          >
            <p className="text-muted-foreground text-xl">No reviews found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

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
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920" 
          alt="Travel background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-secondary/50 to-accent/60 backdrop-blur-[2px]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-40 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-2xl">Travel Reviews</h1>
          <p className="text-white/90 text-xl font-medium drop-shadow-lg">Discover authentic experiences from fellow travelers</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 glass backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              placeholder="Search by destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 transition-all"
            />
          </div>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="glass backdrop-blur-md bg-white/20 border-white/30 text-white focus:bg-white/30 transition-all">
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
            <SelectTrigger className="glass backdrop-blur-md bg-white/20 border-white/30 text-white focus:bg-white/30 transition-all">
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
            className="text-center py-20 glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl"
          >
            <p className="text-white/90 text-xl font-medium">No reviews found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

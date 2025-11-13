import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ReviewCard from '@/components/ReviewCard';
import api from '@/services/api';
import type { Review } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    body: '',
    destination: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [searchTerm, ratingFilter, sortBy]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reviews', {
        params: {
          destination: searchTerm || undefined,
          rating: ratingFilter && ratingFilter !== 'all' ? ratingFilter : undefined,
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

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add a review');
      return;
    }

    if (!newReview.destination.trim() || !newReview.title.trim() || !newReview.body.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        author: user?.name || 'Anonymous',
        avatar: user?.avatar || null,
        rating: newReview.rating,
        title: newReview.title,
        body: newReview.body,
        destination: newReview.destination,
        date: new Date().toISOString()
      };

      await api.post('/reviews', reviewData);
      
      // Reset form and close dialog
      setNewReview({
        rating: 5,
        title: '',
        body: '',
        destination: ''
      });
      setIsAddReviewOpen(false);
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error('Failed to add review:', error);
      alert('Failed to add review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-8">
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

      <div className="container mx-auto px-4 max-w-6xl relative z-10 pb-12">
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
              <SelectItem value="all">All Ratings</SelectItem>
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
                <ReviewCard review={review} onDelete={fetchReviews} />
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

      {/* Floating Add Review Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-primary font-bold h-14 w-14 rounded-full shadow-lg transform transition hover:scale-105 p-0"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add Your Travel Review</DialogTitle>
              <DialogDescription>
                Share your experience with fellow travelers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">
                  Destination
                </Label>
                <Input
                  id="destination"
                  value={newReview.destination}
                  onChange={(e) => setNewReview({...newReview, destination: e.target.value})}
                  className="col-span-3"
                  placeholder="Where did you travel?"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="col-span-3"
                  placeholder="Give your review a title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Rating
                </Label>
                <div className="col-span-3 flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="body" className="text-right">
                  Review
                </Label>
                <Textarea
                  id="body"
                  value={newReview.body}
                  onChange={(e) => setNewReview({...newReview, body: e.target.value})}
                  className="col-span-3"
                  placeholder="Share your travel experience..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddReviewOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddReview}
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Review'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

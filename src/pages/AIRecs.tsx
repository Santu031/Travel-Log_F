import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, DollarSign, Loader2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import type { AIRecommendation } from '@/services/mockData';
import { toast } from 'sonner';

const interests = [
  'Beach', 'Mountains', 'Culture', 'Food', 'Adventure', 'History', 'Shopping', 'Nightlife'
];

export default function AIRecs() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [formData, setFormData] = useState({
    duration: '',
    interests: [] as string[],
    budget: '',
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/ai/recommendations', formData);
      setRecommendations(data);
      toast.success('Generated personalized recommendations!');
    } catch (error) {
      toast.error('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWishlist = (rec: AIRecommendation) => {
    toast.success(`Saved ${rec.destination} to wishlist!`);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="p-3 rounded-2xl bg-gradient-primary">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient-primary">AI Travel Recommendations</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-xl max-w-3xl mx-auto"
          >
            Tell us about your dream trip and let our AI suggest the perfect destinations for you
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 lg:col-span-1 h-fit sticky top-24 glass border-white/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Trip Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 7"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <label
                        htmlFor={interest}
                        className="text-sm cursor-pointer select-none"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $1000 - $2000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-hero" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Card>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-64 rounded-lg" />
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, type: "spring" }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="overflow-hidden glass border-white/20 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="aspect-video md:aspect-auto overflow-hidden relative group">
                        <img
                          src={rec.image}
                          alt={rec.destination}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="p-8 space-y-4 bg-gradient-to-br from-background/50 to-primary/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-3xl font-bold text-gradient-primary mb-1">{rec.destination}</h3>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {rec.country}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-gradient-primary text-white px-4 py-1 text-base">
                              {rec.score}%
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-primary/20 hover:text-primary"
                              onClick={() => handleSaveToWishlist(rec)}
                            >
                              <Bookmark className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-muted-foreground">{rec.description}</p>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{rec.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span>{rec.budget}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm font-semibold mb-2">Suggested Itinerary:</p>
                          <ul className="space-y-1">
                            {rec.itinerary.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-16 text-center glass border-white/20 shadow-2xl">
                  <div className="p-4 rounded-full bg-gradient-primary w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gradient-primary">Ready to Discover?</h3>
                  <p className="text-muted-foreground text-lg">
                    Fill out the form to get personalized AI-powered travel recommendations
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

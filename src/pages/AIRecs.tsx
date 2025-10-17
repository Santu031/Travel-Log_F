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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Travel Recommendations</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tell us about your dream trip and let our AI suggest the perfect destinations for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <Card className="p-6 lg:col-span-1 h-fit sticky top-24">
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Card>

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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden card-hover">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="aspect-video md:aspect-auto overflow-hidden">
                        <img
                          src={rec.image}
                          alt={rec.destination}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold">{rec.destination}</h3>
                            <p className="text-muted-foreground">{rec.country}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-primary/10 text-primary">
                              Score: {rec.score}%
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveToWishlist(rec)}
                            >
                              <Bookmark className="h-4 w-4" />
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
              <Card className="p-12 text-center">
                <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Discover?</h3>
                <p className="text-muted-foreground">
                  Fill out the form to get personalized AI-powered travel recommendations
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

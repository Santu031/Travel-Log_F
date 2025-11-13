import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';

interface AIRecommendation {
  id: string;
  destination: string;
  country: string;
  description: string;
  itinerary: string[];
  score: number;
  image: string;
  budget: string;
  duration: string;
}

export default function AIRecDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendation();
  }, [id]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch the specific recommendation from the backend
      // For now, we'll use a placeholder since we don't have a specific endpoint
      // In a production app, you would have an endpoint like:
      // const response = await api.get(`/ai/recommendations/${id}`);
      // setRecommendation(response.data);
      
      // For now, we'll show a loading state and then display a message
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecommendation(null);
    } catch (error) {
      console.error('Failed to fetch recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Star className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Recommendation Details</h2>
          <p className="text-muted-foreground mb-6">
            Detailed AI recommendations are generated on-demand. Please go back and create a new recommendation.
          </p>
          <Button onClick={() => navigate('/ai-recs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={recommendation.image} 
          alt={recommendation.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/ai-recs')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {recommendation.country}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {recommendation.destination}
            </h1>
            <p className="text-white/90 max-w-2xl">
              {recommendation.description}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Duration</h3>
              </div>
              <p className="text-2xl font-bold">{recommendation.duration} days</p>
            </div>

            <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Budget</h3>
              </div>
              <p className="text-2xl font-bold">{recommendation.budget}</p>
            </div>

            <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Star className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">AI Score</h3>
              </div>
              <p className="text-2xl font-bold">{recommendation.score}/10</p>
            </div>
          </div>

          {/* Itinerary */}
          <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Suggested Itinerary</h2>
            <div className="space-y-4">
              {recommendation.itinerary.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary font-bold">
                    {index + 1}
                  </div>
                  <p className="text-white/90 pt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="flex-1 min-w-[200px]"
              onClick={() => navigate('/travel/new')}
            >
              Plan This Trip
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 min-w-[200px]"
              onClick={() => navigate('/gallery')}
            >
              See Photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
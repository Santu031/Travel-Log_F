import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, DollarSign, Loader2, Bookmark, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import type { AIRecommendation } from '@/types';
import { toast } from 'sonner';

const interests = [
  'Beach', 'Mountains', 'Culture', 'Food', 'Adventure', 'History', 'Shopping', 'Nightlife'
];

// Get destination-specific image
const getDestinationImage = (destination: string, index: number): string => {
  // Curated set of destination-specific travel images with direct URLs
  const destinationImages: Record<string, string[]> = {
    'paris': [
      "https://images.unsplash.com/photo-1508050919630-b135583b29ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502602898669-a35987c10b26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549144576-88d40733a18f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'london': [
      "https://images.unsplash.com/photo-1513635269975-522855d38293?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559827283-753d819d0610?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517292926430-5d2c4e5330e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'new york': [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517292926430-5d2c4e5330e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'tokyo': [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547767427-7f9b0d8d0d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340445-31a89c922572?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'bali': [
      "https://images.unsplash.com/photo-1518542444957-b152e47201bd?w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea477f42082?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'kerala': [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505228395891-9a51e781709d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'kyoto': [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340445-31a89c922572?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'italy': [
      "https://images.unsplash.com/photo-1518542444957-b152e47201bd?w=800",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'japan': [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340445-31a89c922572?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547767427-7f9b0d8d0d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'france': [
      "https://images.unsplash.com/photo-1508050919630-b135583b29ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502602898669-a35987c10b26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549144576-88d40733a18f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'india': [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea477f42082?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'goa': [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea477f42082?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505228395891-9a51e781709d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'delhi': [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea477f42082?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'mumbai': [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea477f42082?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'bangkok': [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340445-31a89c922572?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547767427-7f9b0d8d0d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'dubai': [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340445-31a89c922572?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547767427-7f9b0d8d0d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    'singapore': [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340445-31a89c922572?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547767427-7f9b0d8d0d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ]
  };
  
  // Default images if no match found
  const defaultImages = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  ];
  
  if (!destination) return defaultImages[index % defaultImages.length];
  
  const lowerDest = destination.toLowerCase().trim();
  
  // Check for exact matches first
  for (const [key, images] of Object.entries(destinationImages)) {
    if (lowerDest === key) {
      return images[index % images.length];
    }
  }
  
  // Check for partial matches (more inclusive)
  for (const [key, images] of Object.entries(destinationImages)) {
    if (lowerDest.includes(key) || key.includes(lowerDest)) {
      return images[index % images.length];
    }
  }

  const destinationVariations: Record<string, string> = {
    'new york city': 'new york',
    'nyc': 'new york',
    'los angeles': 'california',
    'san francisco': 'california',
    'washington dc': 'washington',
    'washington d.c.': 'washington',
    'london uk': 'london',
    'london england': 'london',
    'paris france': 'paris',
    'tokyo japan': 'tokyo',
    'mexico city': 'mexico',
    'rio de janeiro': 'rio',
    'sao paulo': 'brazil',
    'new delhi': 'delhi',
    'bombay': 'mumbai',
    'bangalore': 'bengaluru'
  };
  
  const normalizedDest = destinationVariations[lowerDest] || lowerDest;
  for (const [key, images] of Object.entries(destinationImages)) {
    if (normalizedDest.includes(key) || key.includes(normalizedDest)) {
      return images[index % images.length];
    }
  }
  return defaultImages[index % defaultImages.length];
};

export default function AIRecs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [formData, setFormData] = useState({
    place: '',
    duration: '',
    interests: [] as string[],
    budget: '',
  });
  const [activeTab, setActiveTab] = useState<'ai' | 'place'>('ai');

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
    setRecommendations([]); // Clear previous recommendations

    try {
      let data;
      
      if (activeTab === 'ai') {
        // AI-based recommendations
        const requestData = {
          place: formData.place,
          duration: formData.duration,
          interests: formData.interests,
          budget: formData.budget
        };
        const response = await api.post('/ai/recommendations', requestData);
        
        // Handle successful response
        data = response.data;
      } else {
        // Place-based recommendations using AI search
        const response = await api.post('/ai/search', { 
          query: formData.place || 'travel destinations' 
        });
        
        // Create specific images for each recommendation using reliable Unsplash URLs
        const recommendationsWithImages = response.data.map((item: any, index: number) => {
          // Get destination-specific image based on the search query (place)
          const imageUrl = getDestinationImage(formData.place, index);
          
          return {
            id: String(index + 1),
            destination: item.name,
            title: item.name,
            description: item.description,
            location: formData.place || 'Various',
            country: formData.place?.split(', ')?.[1] || formData.place || 'Various',
            image: imageUrl,
            score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
            budget: 'Contact for pricing',
            duration: 'Flexible',
            itinerary: [
              `Day 1: Arrival and exploration of ${item.name}`,
              `Day 2: Experience local culture and attractions`,
              `Day 3: Scenic tour and photography`
            ]
          };
        });
        
        data = recommendationsWithImages;
      }

      // Ensure we have an array and it's not empty
      if (Array.isArray(data) && data.length > 0) {
        setRecommendations(data);
        toast.success(activeTab === 'ai' 
          ? 'Generated personalized recommendations!' 
          : `Found recommendations for ${formData.place || 'travel destinations'}!`);
      } else {
        toast.warning('No recommendations found. Try adjusting your preferences.');
        setRecommendations([]);
      }
    } catch (error: any) {
      console.error('Recommendation error:', error);
      let errorMessage = 'Failed to generate recommendations. ';
      
      // More detailed error handling
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. AI recommendations can take up to 30 seconds to generate. Please wait and try again.';
      } else if (error.response) {
        // Server responded with error status
        if (error.response.status === 400) {
          errorMessage += 'Invalid request data. Please check your inputs.';
        } else if (error.response.status === 408) {
          errorMessage += error.response.data?.message || 'Request timeout. Please try again.';
        } else if (error.response.status === 500) {
          errorMessage += error.response.data?.message || 'Server error. Please try again later.';
        } else if (error.response.status === 503) {
          errorMessage += error.response.data?.message || 'AI service is currently overloaded. Please try again in a few minutes.';
        } else {
          errorMessage += error.response.data?.message || `Server error (${error.response.status}).`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'Unable to connect to server. Please make sure the backend is running and accessible.';
      } else {
        // Something else happened
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      toast.error(errorMessage);
      setRecommendations([]); // Clear recommendations on error
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWishlist = (rec: AIRecommendation, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Saved ${rec.destination} to wishlist!`);
  };

  const handleViewDetails = (rec: AIRecommendation) => {
    // Navigate to the detail page with the recommendation ID
    navigate(`/ai-recs/${rec.id || '1'}`);
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
            Get personalized AI recommendations or explore destinations by place
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-muted rounded-lg">
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('ai')}
            >
              Personalized AI
            </button>
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'place'
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('place')}
            >
              AI by Place
            </button>
          </div>
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
                {activeTab === 'ai' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="place">Destination (Optional)</Label>
                      <Input
                        id="place"
                        name="place"
                        placeholder="e.g., Kerala, Paris, Tokyo"
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Trip Duration (days)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        placeholder="e.g., 7"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Interests</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {interests.map((interest) => (
                          <div key={interest} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest}
                              name={`interest-${interest}`}
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
                        name="budget"
                        placeholder="e.g., $1000 - $2000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="place-search">Place/City</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="place-search"
                        name="place-search"
                        placeholder="e.g., Kerala, Paris, Tokyo"
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter a city or region to find travel recommendations
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full btn-hero" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {activeTab === 'ai' ? 'Generating...' : 'Searching...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {activeTab === 'ai' ? 'Get Personalized Recommendations' : 'Find Places with AI'}
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
                  key={rec.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, type: "spring" }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(rec)}
                >
                  <Card className="overflow-hidden glass border-white/20 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="aspect-video md:aspect-auto overflow-hidden relative group">
                        <img
                          src={rec.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                          alt={rec.destination || rec.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            console.log('Image failed to load:', rec.image);
                            // Fallback to a reliable travel image
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                          }}
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', rec.image);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="p-8 space-y-4 bg-gradient-to-br from-background/50 to-primary/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-3xl font-bold text-gradient-primary mb-1">
                              {rec.destination || rec.title || 'Unknown Destination'}
                            </h3>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {rec.country || rec.location || 'Unknown Location'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {rec.score !== undefined && (
                              <Badge className="bg-gradient-primary text-white px-4 py-1 text-base">
                                {Math.round(rec.score)}%
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-primary/20 hover:text-primary"
                              onClick={(e) => handleSaveToWishlist(rec, e)}
                            >
                              <Bookmark className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                          {rec.description || 'No description available for this destination.'}
                        </p>

                        {(rec.itinerary && rec.itinerary.length > 0) && (
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Suggested Itinerary
                            </h4>
                            <ul className="space-y-2">
                              {rec.itinerary.slice(0, 2).map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                              {rec.itinerary.length > 2 && (
                                <li className="text-sm text-muted-foreground">
                                  +{rec.itinerary.length - 2} more activities
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {(rec.duration || rec.date) && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {rec.duration || rec.date || 'Flexible'}
                              </span>
                            )}
                            {rec.budget && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {rec.budget}
                              </span>
                            )}
                          </div>
                          <Button variant="outline" className="btn-hero-outline" onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(rec);
                          }}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-2xl font-semibold mb-2">
                  {activeTab === 'ai' 
                    ? 'Personalized Travel Recommendations' 
                    : 'Find Travel Destinations'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {activeTab === 'ai'
                    ? 'Fill out the form to get AI-powered travel recommendations tailored to your preferences.'
                    : 'Enter a place to discover travel destinations and activities.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
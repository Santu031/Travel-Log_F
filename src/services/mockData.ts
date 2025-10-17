// Mock data for the TravelLog app

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  bio?: string;
  role: 'user' | 'admin';
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  images: string[];
  title: string;
  caption: string;
  tags: string[];
  location: string;
  likes: number;
  comments: number;
  createdAt: string;
  liked?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  destination: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
}

export interface AIRecommendation {
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

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    displayName: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Adventure seeker and travel photographer 📸',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@travellog.com',
    displayName: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'admin',
  },
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    images: [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
    ],
    title: 'Sunset in Santorini',
    caption: 'The most breathtaking sunset I\'ve ever witnessed. Santorini never disappoints! 🌅',
    tags: ['sunset', 'greece', 'santorini', 'travel'],
    location: 'Santorini, Greece',
    likes: 342,
    comments: 28,
    createdAt: '2024-03-15T18:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'],
    title: 'Korean Street Food',
    caption: 'Exploring the incredible street food scene in Seoul 🍜',
    tags: ['food', 'korea', 'seoul', 'streetfood'],
    location: 'Seoul, South Korea',
    likes: 256,
    comments: 19,
    createdAt: '2024-03-12T12:00:00Z',
  },
  {
    id: '3',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    title: 'Mountain Hiking',
    caption: 'The journey is always worth it when you reach the top 🏔️',
    tags: ['hiking', 'mountains', 'nature', 'adventure'],
    location: 'Swiss Alps',
    likes: 421,
    comments: 35,
    createdAt: '2024-03-10T09:15:00Z',
  },
];

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    destination: 'Tokyo, Japan',
    rating: 5,
    title: 'An Unforgettable Experience',
    content: 'Tokyo exceeded all my expectations! From the bustling streets of Shibuya to the peaceful gardens, every moment was magical. The food, culture, and people made this trip truly special.',
    helpful: 45,
    createdAt: '2024-03-14T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    destination: 'Paris, France',
    rating: 4,
    title: 'Beautiful but Crowded',
    content: 'Paris is stunning, especially in spring. The architecture and art are incredible. However, major tourist spots can get very crowded. Would recommend visiting early in the morning.',
    helpful: 32,
    createdAt: '2024-03-08T14:30:00Z',
  },
  {
    id: '3',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    destination: 'Bali, Indonesia',
    rating: 5,
    title: 'Paradise on Earth',
    content: 'Bali has it all - beaches, culture, temples, and amazing food. The locals are incredibly welcoming. Perfect for both relaxation and adventure seekers.',
    helpful: 67,
    createdAt: '2024-03-01T16:45:00Z',
  },
];

// Mock AI recommendations
export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: '1',
    destination: 'Kyoto',
    country: 'Japan',
    description: 'Experience ancient temples, traditional tea ceremonies, and beautiful cherry blossoms in this historic city.',
    itinerary: [
      'Visit Fushimi Inari Shrine',
      'Explore Arashiyama Bamboo Grove',
      'Tea ceremony in Gion district',
      'Philosopher\'s Path walk',
    ],
    score: 95,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    budget: '$1,500 - $2,500',
    duration: '5 days',
  },
  {
    id: '2',
    destination: 'Barcelona',
    country: 'Spain',
    description: 'Vibrant city combining stunning architecture, beaches, and incredible cuisine.',
    itinerary: [
      'Sagrada Familia tour',
      'Beach day at Barceloneta',
      'Gothic Quarter exploration',
      'Tapas crawl in El Born',
    ],
    score: 92,
    image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800',
    budget: '$1,200 - $2,000',
    duration: '4 days',
  },
  {
    id: '3',
    destination: 'Queenstown',
    country: 'New Zealand',
    description: 'Adventure capital with breathtaking landscapes and endless outdoor activities.',
    itinerary: [
      'Bungee jumping',
      'Milford Sound cruise',
      'Skyline gondola ride',
      'Wine tasting in Gibbston Valley',
    ],
    score: 90,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    budget: '$2,000 - $3,000',
    duration: '6 days',
  },
];

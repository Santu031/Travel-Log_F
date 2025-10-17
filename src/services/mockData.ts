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
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  images: { url: string; w: number; h: number }[];
  caption: string;
  location: { name: string; lat: number; lng: number };
  tags: string[];
  likesCount: number;
  likedByUser: boolean;
  commentsCount: number;
  createdAt: string;
}

export interface Story {
  userId: string;
  userName: string;
  avatar: string;
  slides: { image: string; duration: number }[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface SearchUser {
  userId: string;
  displayName: string;
  avatar: string;
  isFollowing: boolean;
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
  {
    id: '3',
    email: 'john@example.com',
    displayName: 'John Traveler',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    bio: 'Exploring the world one country at a time 🌍',
    role: 'user',
  },
  {
    id: '4',
    email: 'emma@example.com',
    displayName: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Digital nomad | Food enthusiast 🍜',
    role: 'user',
  },
];

// Mock posts
export const mockPosts: Post[] = [
  {
    _id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    images: [
      { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', w: 800, h: 600 },
      { url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800', w: 800, h: 600 },
    ],
    caption: 'The most breathtaking sunset I\'ve ever witnessed. Santorini never disappoints! 🌅',
    tags: ['sunset', 'greece', 'santorini', 'travel'],
    location: { name: 'Santorini, Greece', lat: 36.3932, lng: 25.4615 },
    likesCount: 342,
    likedByUser: false,
    commentsCount: 28,
    createdAt: '2024-03-15T18:30:00Z',
  },
  {
    _id: '2',
    userId: '3',
    userName: 'John Traveler',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    images: [{ url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', w: 800, h: 600 }],
    caption: 'Exploring the incredible street food scene in Seoul 🍜 #foodie',
    tags: ['food', 'korea', 'seoul', 'streetfood'],
    location: { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780 },
    likesCount: 256,
    likedByUser: false,
    commentsCount: 19,
    createdAt: '2024-03-12T12:00:00Z',
  },
  {
    _id: '3',
    userId: '4',
    userName: 'Emma Wilson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', w: 800, h: 600 }],
    caption: 'The journey is always worth it when you reach the top 🏔️',
    tags: ['hiking', 'mountains', 'nature', 'adventure'],
    location: { name: 'Swiss Alps', lat: 46.5547, lng: 7.9797 },
    likesCount: 421,
    likedByUser: false,
    commentsCount: 35,
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    _id: '4',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    images: [{ url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', w: 800, h: 600 }],
    caption: 'Lost in the beauty of Paris ✨ The Eiffel Tower at night is pure magic!',
    tags: ['paris', 'france', 'eiffeltower', 'nightphotography'],
    location: { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    likesCount: 567,
    likedByUser: false,
    commentsCount: 42,
    createdAt: '2024-03-08T20:00:00Z',
  },
  {
    _id: '5',
    userId: '3',
    userName: 'John Traveler',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    images: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', w: 800, h: 600 },
      { url: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=800', w: 800, h: 600 },
    ],
    caption: 'Island hopping in Bali 🏝️ Paradise found!',
    tags: ['bali', 'indonesia', 'beach', 'islandlife'],
    location: { name: 'Bali, Indonesia', lat: -8.3405, lng: 115.0920 },
    likesCount: 689,
    likedByUser: false,
    commentsCount: 51,
    createdAt: '2024-03-05T14:30:00Z',
  },
  {
    _id: '6',
    userId: '4',
    userName: 'Emma Wilson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    images: [{ url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800', w: 800, h: 600 }],
    caption: 'Santorini vibes 💙 Every corner is a postcard!',
    tags: ['santorini', 'greece', 'architecture', 'blueandwhite'],
    location: { name: 'Oia, Santorini', lat: 36.4618, lng: 25.3753 },
    likesCount: 892,
    likedByUser: false,
    commentsCount: 67,
    createdAt: '2024-03-02T16:45:00Z',
  },
];

// Mock stories
export const mockStories: Story[] = [
  {
    userId: '1',
    userName: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    slides: [
      { image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400', duration: 5000 },
      { image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400', duration: 5000 },
    ],
  },
  {
    userId: '3',
    userName: 'John Traveler',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    slides: [
      { image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', duration: 5000 },
    ],
  },
  {
    userId: '4',
    userName: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    slides: [
      { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', duration: 5000 },
      { image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', duration: 5000 },
    ],
  },
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '3',
    userName: 'John Traveler',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    content: 'Absolutely stunning! 😍',
    createdAt: '2024-03-15T19:00:00Z',
  },
  {
    id: '2',
    postId: '1',
    userId: '4',
    userName: 'Emma Wilson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    content: 'Adding this to my bucket list!',
    createdAt: '2024-03-15T19:30:00Z',
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

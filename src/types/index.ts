export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
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
  author: string;
  avatar: string | null;
  destination: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  photos: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
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
  title?: string;
  location?: string;
  imageUrl?: string;
  date?: string;
  rating?: number;
}

export interface Destination {
  title: string;
  location: string;
  description: string;
  date: string;
  rating: number;
  imageUrl: string;
  id?: string;
  destination?: string;
  country?: string;
  score?: number;
  image?: string;
  budget?: string;
  duration?: string;
  itinerary?: string[];
}
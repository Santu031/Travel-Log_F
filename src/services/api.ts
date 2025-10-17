import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockUsers, mockPosts, mockReviews, mockAIRecommendations } from './mockData';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Create mock adapter
const mock = new MockAdapter(api, { delayResponse: 500 });

// Auth endpoints
mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const user = mockUsers.find((u) => u.email === email);
  
  if (user && password === 'password') {
    return [200, { 
      user, 
      token: 'mock-jwt-token',
      message: 'Login successful' 
    }];
  }
  return [401, { error: 'Invalid credentials' }];
});

mock.onPost('/auth/register').reply((config) => {
  const { email, displayName, password } = JSON.parse(config.data);
  
  const newUser = {
    id: String(Date.now()),
    email,
    displayName,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
    role: 'user' as const,
  };
  
  mockUsers.push(newUser);
  
  return [201, { 
    user: newUser, 
    token: 'mock-jwt-token',
    message: 'Registration successful' 
  }];
});

mock.onGet('/auth/me').reply(() => {
  return [200, mockUsers[0]];
});

// Posts endpoints
mock.onGet('/posts').reply((config) => {
  const { tag, sort } = config.params || {};
  let posts = [...mockPosts];
  
  if (tag) {
    posts = posts.filter(p => p.tags.includes(tag));
  }
  
  if (sort === 'popular') {
    posts.sort((a, b) => b.likes - a.likes);
  } else {
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return [200, posts];
});

mock.onGet(/\/posts\/\w+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const post = mockPosts.find(p => p.id === id);
  return post ? [200, post] : [404, { error: 'Post not found' }];
});

mock.onPost('/posts').reply((config) => {
  const postData = JSON.parse(config.data);
  const newPost = {
    ...postData,
    id: String(Date.now()),
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  };
  mockPosts.unshift(newPost);
  return [201, newPost];
});

mock.onPost(/\/posts\/\w+\/like/).reply((config) => {
  const id = config.url?.split('/')[2];
  const post = mockPosts.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    post.liked = true;
    return [200, post];
  }
  return [404, { error: 'Post not found' }];
});

// Reviews endpoints
mock.onGet('/reviews').reply((config) => {
  const { destination, rating, sort } = config.params || {};
  let reviews = [...mockReviews];
  
  if (destination) {
    reviews = reviews.filter(r => 
      r.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }
  
  if (rating) {
    reviews = reviews.filter(r => r.rating >= Number(rating));
  }
  
  if (sort === 'helpful') {
    reviews.sort((a, b) => b.helpful - a.helpful);
  }
  
  return [200, reviews];
});

// AI Recommendations endpoint
mock.onPost('/ai/recommendations').reply((config) => {
  const { duration, interests, budget } = JSON.parse(config.data);
  
  // Simple filtering based on criteria
  let recommendations = [...mockAIRecommendations];
  
  // In a real app, this would use actual AI
  return [200, recommendations];
});

// Admin endpoints
mock.onGet('/admin/flagged-posts').reply(() => {
  return [200, []];
});

export default api;

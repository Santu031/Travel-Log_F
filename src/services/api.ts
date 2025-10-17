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
  const { tag, sort, page = 1, filter = 'all' } = config.params || {};
  let posts = [...mockPosts];
  
  if (tag) {
    posts = posts.filter(p => p.tags.includes(tag));
  }
  
  if (sort === 'popular') {
    posts.sort((a, b) => b.likesCount - a.likesCount);
  } else {
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return [200, { posts, nextPage: Number(page) + 1 }];
});

mock.onGet(/\/posts\/\w+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const post = mockPosts.find(p => p._id === id);
  return post ? [200, post] : [404, { error: 'Post not found' }];
});

mock.onPost('/posts').reply((config) => {
  const postData = JSON.parse(config.data);
  const currentUser = mockUsers[0];
  const newPost = {
    _id: String(Date.now()),
    userId: currentUser.id,
    userName: currentUser.displayName,
    userAvatar: currentUser.avatar,
    images: postData.images || [],
    caption: postData.caption,
    location: postData.location,
    tags: postData.tags,
    likesCount: 0,
    likedByUser: false,
    commentsCount: 0,
    createdAt: new Date().toISOString(),
  };
  mockPosts.unshift(newPost);
  return [201, { success: true, post: newPost }];
});

mock.onPost(/\/posts\/\w+\/like/).reply((config) => {
  const id = config.url?.split('/')[2];
  const post = mockPosts.find(p => p._id === id);
  if (post) {
    if (post.likedByUser) {
      post.likesCount -= 1;
      post.likedByUser = false;
    } else {
      post.likesCount += 1;
      post.likedByUser = true;
    }
    return [200, { likesCount: post.likesCount, likedByUser: post.likedByUser }];
  }
  return [404, { error: 'Post not found' }];
});

mock.onPost(/\/posts\/\w+\/comment/).reply((config) => {
  const id = config.url?.split('/')[2];
  const { content } = JSON.parse(config.data);
  const post = mockPosts.find(p => p._id === id);
  const currentUser = mockUsers[0];
  
  if (post) {
    const newComment = {
      id: String(Date.now()),
      postId: id,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    post.commentsCount += 1;
    return [200, { comment: newComment }];
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

// User search and follow endpoints
mock.onGet('/users/search').reply((config) => {
  const { q } = config.params || {};
  const users = mockUsers
    .filter(u => u.displayName.toLowerCase().includes(q?.toLowerCase() || ''))
    .map(u => ({
      userId: u.id,
      displayName: u.displayName,
      avatar: u.avatar,
      isFollowing: false,
    }));
  return [200, { users }];
});

mock.onPost(/\/users\/\w+\/follow/).reply(() => {
  return [200, { isFollowing: true }];
});

// Stories endpoint
mock.onGet('/stories').reply(async () => {
  const { mockStories } = await import('./mockData');
  return [200, { stories: mockStories }];
});

// Admin endpoints
mock.onGet('/admin/flagged-posts').reply(() => {
  return [200, []];
});

export default api;

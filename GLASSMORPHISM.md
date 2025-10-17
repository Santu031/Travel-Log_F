# TravelLog Glassmorphism Design System

## Design Tokens

### Colors
- **Primary (Coral)**: `#FF6B61` - Main accent color for CTAs and highlights
- **Navy**: `#0B2545` - Primary text color
- **Frost**: `#F8F6F4` - Background color
- **Teal**: `#2EC4B6` - Secondary accent
- **Muted Gray**: `#6B7280` - Secondary text

### Glass Effects
```css
.glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

### Shadows
- **Soft Glass**: `0 8px 30px rgba(11,37,69,0.07)`
- **Hover**: `0 12px 40px rgba(11,37,69,0.12)`

## Components

### PostCard
- Glassmorphism card with blurred background
- Image carousel with indicators
- Animated like button with heart-beat effect
- Optimistic UI updates for likes

### StoryBar
- Instagram-style story rings with gradient borders
- Horizontal scroll with user avatars

### Header
- Glass header with backdrop blur
- Sticky positioning with soft shadow

## API Contract

### Mock to Real Backend Migration

Current implementation uses `axios-mock-adapter`. To switch to a real backend:

1. **Remove mock adapter** in `src/services/api.ts`:
```typescript
// Remove these lines:
import MockAdapter from 'axios-mock-adapter';
const mock = new MockAdapter(api, { delayResponse: 500 });
```

2. **Update baseURL**:
```typescript
const api = axios.create({
  baseURL: 'https://your-api.com/api', // Your real API
  timeout: 5000,
});
```

3. **API Endpoints** (already implemented in mock):
- `GET /posts?page=&filter=&tag=` → `{ posts: Post[], nextPage: number }`
- `POST /posts/:id/like` → `{ likesCount: number, likedByUser: boolean }`
- `POST /posts/:id/comment` → `{ comment: Comment }`
- `GET /users/search?q=` → `{ users: SearchUser[] }`
- `POST /users/:id/follow` → `{ isFollowing: boolean }`
- `GET /stories` → `{ stories: Story[] }`

## Running the App

```bash
npm install
npm run dev
```

## Features Implemented

✅ Glassmorphism design system
✅ Instagram-style post cards
✅ Story bar with user avatars
✅ Animated like button
✅ Image carousel
✅ Mock API with realistic delays
✅ Responsive grid layout (1/2/3 columns)
✅ TypeScript interfaces
✅ Optimistic UI updates

## Next Steps

- [ ] FAB for post upload
- [ ] UploadModal with image preview/compression
- [ ] PostModal with comments thread
- [ ] Infinite scroll
- [ ] User search and follow UI
- [ ] Share functionality

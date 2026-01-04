# Moovie - Enterprise Streaming Platform

A Netflix-style streaming platform built with React, Node.js, and HLS video streaming.

## Features

### Frontend
- Netflix-inspired dark theme UI
- Hero banner with featured content
- Horizontal scrollable movie rows
- Movie cards with hover effects
- Top 10 ranking display
- Custom video player with HLS support
- Adaptive bitrate streaming
- Quality selection (Auto, 360p-4K)
- Continue watching functionality
- Watchlist management
- Search with real-time suggestions
- User profiles
- Responsive design

### Backend
- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- JWT authentication with refresh tokens
- Redis caching for performance
- HLS video streaming
- FFmpeg video transcoding
- WebSocket real-time features
- Stripe payment integration
- Admin content management

### Video Streaming
- HLS (HTTP Live Streaming)
- Adaptive bitrate streaming
- Multiple quality levels (360p, 480p, 720p, 1080p, 4K)
- Efficient video segmentation
- Pre-buffering for smooth playback
- Resume playback from last position

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- HLS.js
- Zustand (State Management)
- Socket.io Client

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- FFmpeg
- Socket.io
- Stripe

### Infrastructure
- Docker & Docker Compose
- Nginx (Video CDN)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- FFmpeg
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/isaacmuchunu/Moovie.git
cd Moovie
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Set up environment variables:
```bash
cp server/.env.example server/.env
# Edit .env with your configuration
```

5. Initialize database:
```bash
cd server
npx prisma db push
npx prisma generate
```

6. Start development servers:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user

### Content
- GET `/api/content` - List content
- GET `/api/content/:id` - Get content details
- GET `/api/content/featured` - Get featured content
- POST `/api/content/:id/watchlist` - Add to watchlist
- DELETE `/api/content/:id/watchlist` - Remove from watchlist
- POST `/api/content/:id/rate` - Rate content

### Streaming
- GET `/api/stream/:videoId` - Get stream info
- POST `/api/stream/:videoId/progress` - Update watch progress
- GET `/api/stream/continue-watching` - Get continue watching list

## Subscription Plans

| Plan | Price | Quality | Screens |
|------|-------|---------|---------|
| Basic | $8.99/mo | 720p HD | 1 |
| Standard | $13.99/mo | 1080p FHD | 2 |
| Premium | $17.99/mo | 4K UHD | 4 |

## License

MIT License

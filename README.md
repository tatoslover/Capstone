# Plansewalker's Primer

A simple MTG rulebook for beginners with favorites system.

## Quick Start

### Backend (Express.js)

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

- `GET /` - Hello World
- `GET /health` - Health check
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

## Deployment

### Backend (Railway)
1. Connect GitHub repo to Railway
2. In Railway project settings, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Set environment variables if needed

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. In Vercel project settings, set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detect)
   - **Build Command**: `npm run build` (auto-detect)
   - **Install Command**: `npm install` (auto-detect)
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://plansewalker-s-primer-production.up.railway.app`

**Note**: Both platforms require manual configuration to use subfolders in monorepo setup.

## Deployment URLs

🚀 **Backend**: https://plansewalker-s-primer-production.up.railway.app
🚀 **Frontend**: https://plansewalker-s-primer.vercel.app

## Current Status

✅ Basic Express.js backend with CRUD
✅ Basic Next.js frontend  
✅ API integration between frontend/backend
✅ Successfully deployed on Railway & Vercel

## Next Steps

- [ ] Add PostgreSQL database
- [ ] Implement user management
- [ ] Add favorites system
- [ ] Integrate Scryfall API
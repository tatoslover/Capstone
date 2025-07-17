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
2. Railway will automatically use `railway.json` config
3. Set environment variables if needed

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Vercel will automatically use `vercel.json` config
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`

### Config Files
- `vercel.json` - Configures Vercel to deploy frontend folder
- `railway.json` - Configures Railway to deploy backend folder
- `Procfile` - Backup Railway configuration

## Current Status

✅ Basic Express.js backend with CRUD
✅ Basic Next.js frontend
✅ API integration between frontend/backend
✅ Ready for deployment

## Next Steps

- [ ] Add PostgreSQL database
- [ ] Implement user management
- [ ] Add favorites system
- [ ] Integrate Scryfall API
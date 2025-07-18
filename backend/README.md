# Planeswalker's Primer - Backend API

A simple Express.js backend API for the MTG rulebook application.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /` - Hello World message
- `GET /health` - Server health status

### Messages CRUD
- `POST /api/messages` - Create a new message
- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get message by ID
- `PUT /api/messages/:id` - Update message by ID
- `DELETE /api/messages/:id` - Delete message by ID

## Example Usage

### Create a message:
```bash
curl -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from API!"}'
```

### Get all messages:
```bash
curl http://localhost:3001/api/messages
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Current Status

✅ Basic Express.js server
✅ Simple CRUD operations with in-memory storage
✅ CORS enabled
✅ Error handling middleware

## Next Steps

- [ ] Add PostgreSQL database connection
- [ ] Implement user management
- [ ] Add favorites system
- [ ] Integrate Scryfall API
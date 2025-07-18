# Planeswalker's Primer - Development Guide

## 🚀 Quick Start

This project features an **offline-first development environment** that works whether the backend is running or not. The frontend automatically detects backend availability and falls back to mock data when offline.

### Prerequisites

- Node.js 16+ and npm
- Git
- Docker (optional, for local database)

### Development Setup

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd Plansewalker-s-Primer
   git checkout feature/local-development-setup
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend  
   cd ../backend
   npm install
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1 - Frontend (always works)
   cd frontend
   npm run dev

   # Terminal 2 - Backend (optional)
   cd backend
   npm run dev
   ```

4. **Visit the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001 (if running)
   - API Testing: http://localhost:3000/api-test

## 🔄 Online/Offline Development

### Offline Mode (Default)
- **No backend required** - start coding immediately
- Mock data simulates full API functionality
- Perfect for frontend development and UI work
- Automatically enabled when backend is unavailable

### Online Mode
- Real backend connection with PostgreSQL database
- Full end-to-end functionality
- Scryfall API integration for real card data
- Automatically enabled when backend is detected

### Connection Status
The application shows a real-time connection indicator:
- 🟢 **Online**: Backend Connected
- 🔴 **Offline**: Mock Data Mode

## 📁 Project Structure

```
Plansewalker-s-Primer/
├── frontend/                 # Next.js frontend application
│   ├── components/           # React components
│   │   ├── Layout/          # Main layout and navigation
│   │   ├── UI/              # Reusable UI components
│   │   ├── ConnectionStatus.js  # Online/offline indicator
│   │   └── ApiTest.js       # API testing component
│   ├── pages/               # Next.js pages/routes
│   ├── services/            # API and mock services
│   │   ├── apiService.js    # Main API with fallback logic
│   │   └── mockApi.js       # Mock backend for offline development
│   ├── contexts/            # React contexts (theme, etc.)
│   └── styles/              # CSS and styling
├── backend/                 # Express.js backend API
│   ├── server.js            # Main server file
│   ├── db.js               # Database connection and setup
│   ├── init.sql            # Database initialization script
│   └── .env.development    # Development environment config
├── scripts/                # Development and testing scripts
│   ├── setup-dev-environment.sh  # Automated setup script
│   ├── test-connection.js  # Backend connection testing
│   └── test-frontend-routes.js   # Route validation
└── docker-compose.yml      # Local PostgreSQL database
```

## 🛠 Development Workflow

### 1. Frontend Development (Offline)
Perfect for UI work, component development, and frontend features:

```bash
cd frontend
npm run dev
# Visit http://localhost:3000
# Backend indicator will show "Offline" - this is normal!
```

**What works offline:**
- ✅ All page navigation
- ✅ User profile management (mock data)
- ✅ Favourites system (mock data)  
- ✅ Card search (mock Scryfall data)
- ✅ All UI components and styling
- ✅ Theme switching
- ✅ Responsive design testing

### 2. Full-Stack Development (Online)
When you need real database and external API integration:

```bash
# Start backend with local database
cd backend
npm run dev

# Backend indicator will show "Online" automatically
```

### 3. Database Development
If you need to work with real PostgreSQL data:

```bash
# Start local PostgreSQL with Docker
docker-compose up -d postgres

# Backend will automatically connect
cd backend
npm run dev
```

## 🧪 Testing

### API Testing Dashboard
Visit http://localhost:3000/api-test for a comprehensive testing interface:

- **Health checks** - Test backend connectivity
- **User CRUD** - Test user management operations
- **Favourites** - Test favourites functionality  
- **Card Search** - Test Scryfall integration
- **Connection Status** - Real-time online/offline indicator

### Command Line Testing
```bash
# Test backend connection
cd backend
npm run test:connection

# Test frontend routes
cd scripts
node test-frontend-routes.js

# Database health check
cd backend
npm run test:db
```

### Simple Test Examples
The testing is designed to be **simple but demonstrative**:

```javascript
// Example: Test user creation (works online & offline)
const newUser = await apiService.users.create({
  username: 'test_user'
});
console.log('Created user:', newUser.id);
```

## 🔧 Configuration

### Environment Files

**Frontend (.env.local.development):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
```

**Backend (.env.development):**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/plansewalker_primer
PORT=3001
NODE_ENV=development
```

### Mock Data Configuration
Mock data is defined in `frontend/services/mockApi.js`:
- Pre-populated users and favourites
- Sample MTG cards with real Scryfall data structure
- Simulated API delays for realistic testing

## 📊 Database Setup

### Option 1: Docker (Recommended)
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Database will be automatically initialized with sample data
# Access: localhost:5432, DB: plansewalker_primer, User: postgres, Pass: password
```

### Option 2: Local PostgreSQL
```bash
# Install PostgreSQL locally
createdb plansewalker_primer

# Update backend/.env with your connection string
DATABASE_URL=postgresql://localhost:5432/plansewalker_primer
```

### Option 3: Railway (Production)
```bash
# Update backend/.env.production with Railway database URL
# Deploy backend to Railway
# Frontend automatically detects online backend
```

## 🔍 Debugging

### Connection Issues
1. **Check the connection indicator** in the top navigation
2. **Visit /api-test** to run comprehensive tests
3. **Check browser console** for detailed error messages
4. **Backend logs** show connection attempts and errors

### Common Issues

**"Backend shows offline but it's running"**
- Check if backend is on port 3001: `curl http://localhost:3001/health`
- Verify frontend environment: `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Check for CORS issues in browser network tab

**"Database connection failed"**
- Ensure Docker is running: `docker ps`
- Check database container: `docker-compose logs postgres`
- Verify environment variables in backend/.env

**"Mock data not working"**
- Check browser console for JavaScript errors
- Ensure apiService is properly imported
- Verify mock data structure in mockApi.js

## 🎯 Development Features

### Automatic Fallback System
```javascript
// This code works both online and offline!
const users = await apiService.users.getAll();
// Online: Returns real database data
// Offline: Returns mock data
```

### Real-time Connection Detection
- Automatic health checks every 30 seconds
- Instant fallback when backend goes offline
- Visual indicators throughout the application
- No manual switching required

### Hot Module Replacement
- Frontend auto-reloads on file changes
- Backend auto-restarts with nodemon
- Database changes are instantly reflected

## 📚 API Documentation

### Endpoint Structure
All endpoints work the same whether online or offline:

```javascript
// Users
apiService.users.getAll()           // GET /api/users
apiService.users.getById(id)        // GET /api/users/:id
apiService.users.create(data)       // POST /api/users
apiService.users.update(id, data)   // PUT /api/users/:id
apiService.users.delete(id)         // DELETE /api/users/:id

// Favourites (note: API uses US spelling, DB uses UK)
apiService.favourites.getByUserId(userId)  // GET /api/favorites/:userId
apiService.favourites.create(data)         // POST /api/favorites
apiService.favourites.update(id, data)     // PUT /api/favorites/:id
apiService.favourites.delete(id)           // DELETE /api/favorites/:id

// Cards (Scryfall integration)
apiService.cards.search(query)      // GET /api/cards/search?q=query
apiService.cards.random(ability)    // GET /api/cards/random?ability=flying
apiService.cards.getById(id)        // GET /api/cards/:id
```

## 🚀 Deployment

### Development Deployment
```bash
# Frontend (Vercel)
cd frontend
npm run build
npm run start

# Backend (Railway)  
cd backend
npm start
```

### Environment-Specific Configs
- **Development**: Local database, mock fallback, debug enabled
- **Production**: Railway database, error reporting, performance optimized

## 🔄 Git Workflow

### Current Branch Structure
```bash
main                              # Production-ready code
├── feature/local-development-setup   # Current development branch
```

### Making Changes
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test both online/offline
npm run dev  # frontend
npm run dev  # backend (optional)

# Test everything works
visit http://localhost:3000/api-test

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

## 💡 Tips for Development

### Offline-First Development
1. **Start with offline mode** - develop UI and logic without backend dependency
2. **Use mock data** that mirrors real API responses exactly
3. **Test online mode** once core functionality works offline
4. **Always check both modes** before committing code

### Testing Strategy
1. **API Dashboard** - Use /api-test for quick functionality verification
2. **Manual Testing** - Click through all features in both modes
3. **Console Logs** - Monitor connection status and API calls
4. **Error Handling** - Test with backend offline/online transitions

### Performance Tips
- Mock API includes realistic delays (200-300ms) to simulate real conditions
- Health checks run every 30 seconds to balance responsiveness and performance
- Connection status is cached to avoid excessive API calls

## 🤝 Contributing

1. **Check current branch**: `git checkout feature/local-development-setup`
2. **Test offline mode**: Ensure all features work without backend
3. **Test online mode**: Verify real API integration works
4. **Run API tests**: Visit /api-test and run all test suites
5. **Verify connection indicator**: Should show correct status
6. **Follow UK English**: Frontend uses "favourites", API uses "favorites"

## 📞 Getting Help

### Quick Checks
1. **Connection Status**: Look for 🟢/🔴 indicator in navigation
2. **API Testing**: Visit http://localhost:3000/api-test
3. **Browser Console**: Check for error messages
4. **Backend Logs**: Look for connection and database messages

### Common Commands
```bash
# Reset everything
docker-compose down -v
npm run dev  # in both frontend and backend

# Test connection
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000

# View logs
docker-compose logs postgres
```

This development environment is designed to be **beginner-friendly** while supporting advanced development needs. You can start coding immediately with offline mode, then gradually enable online features as needed.
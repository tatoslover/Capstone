# Planeswalker's Primer - Setup and Test Guide

## 🔍 Issues Identified

Based on the analysis, here are the main issues causing the 404 errors:

### 1. **My Favourites Page - FIXED ✅**
- **Issue**: Navigation linked to `/favourites` but page was named `favorites.js`
- **Solution**: Renamed `favorites.js` → `favourites.js` to match UK spelling
- **Status**: ✅ Fixed - Page should now load correctly

### 2. **Profile Page - FIXED ✅**
- **Issue**: Navigation linked to `/profile` but no `profile.js` file existed
- **Solution**: Created complete `profile.js` with user management CRUD operations
- **Status**: ✅ Fixed - Page created with full functionality

### 3. **Backend Connection Issues**
- **Issue**: Backend needs PostgreSQL database connection
- **Current Status**: Backend configured for Railway cloud database
- **Impact**: Profile page CRUD operations won't work without database

## 🚀 Quick Test Instructions

### Test Frontend Routes (No Database Required)

1. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test the fixed routes:**
   - Navigate to http://localhost:3000
   - Click "My Favourites" - should load (no longer 404!)
   - Click "Profile" - should load (no longer 404!)
   - Click "Search" - should work
   - Click "Documentation" - should work

### Test Backend Connection (Database Required)

1. **Set up environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

3. **Test API endpoints:**
   ```bash
   # Test health check
   curl http://localhost:3001/health
   
   # Test users endpoint
   curl http://localhost:3001/api/users
   
   # Test favorites endpoint
   curl http://localhost:3001/api/favorites/1
   ```

## 🛠️ Database Setup Options

### Option 1: Railway Cloud Database (Recommended for Production)
- Use the existing Railway PostgreSQL setup
- Update `.env` with your Railway database URL
- No local setup required

### Option 2: Local PostgreSQL (For Development)
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb plansewalker_primer

# Update .env file
DATABASE_URL=postgresql://localhost:5432/plansewalker_primer
```

### Option 3: Docker PostgreSQL (Quick Setup)
```bash
# Run PostgreSQL in Docker
docker run --name plansewalker-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=plansewalker_primer \
  -p 5432:5432 \
  -d postgres:13

# Update .env file
DATABASE_URL=postgresql://postgres:password@localhost:5432/plansewalker_primer
```

## 🧪 Run Automated Tests

### Frontend Route Test
```bash
node scripts/test-frontend-routes.js
```

### Backend Connection Test (requires database)
```bash
node scripts/test-connection.js
```

## 📋 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| My Favourites Route | ✅ Fixed | Renamed to match UK spelling |
| Profile Route | ✅ Fixed | Created complete profile page |
| Frontend Navigation | ✅ Working | All links properly configured |
| Backend API Structure | ✅ Working | All CRUD endpoints exist |
| Database Connection | ⚠️ Setup Required | Needs environment configuration |
| Spelling Consistency | ✅ Standardized | Using UK spelling for frontend, US for API |

## 🎯 Expected Behavior After Fixes

### My Favourites Page (`/favourites`)
- ✅ No longer shows 404
- Displays user's saved cards
- Shows "Profile Required" message if no user selected
- Links to create profile and search cards

### Profile Page (`/profile`)
- ✅ No longer shows 404
- Full user management interface
- Create, edit, delete user profiles
- Switch between existing profiles
- Profile stats and quick actions

### Backend API
- **Users**: Full CRUD at `/api/users`
- **Favourites**: Full CRUD at `/api/favorites` (note US spelling for API)
- **Database**: Uses UK spelling `favourites` table
- **Consistency**: Frontend uses UK, API uses US, Database uses UK

## 🔧 Troubleshooting

### Still Getting 404 Errors?

1. **Clear your browser cache**
2. **Restart the frontend development server:**
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

### Profile Operations Not Working?

1. **Check backend is running on port 3001**
2. **Verify database connection in backend logs**
3. **Test API endpoints directly with curl**

### Database Errors?

1. **Check .env file exists in backend folder**
2. **Verify DATABASE_URL is correct**
3. **Ensure PostgreSQL is running**
4. **Check backend console for connection errors**

## 📈 Testing Checklist

- [ ] My Favourites page loads without 404
- [ ] Profile page loads without 404  
- [ ] Can create new user profile
- [ ] Can switch between profiles
- [ ] Can edit profile name
- [ ] Can delete profile
- [ ] Favourites page shows correct user info
- [ ] Navigation between all pages works
- [ ] Backend responds to API calls

## 🚀 Next Steps

1. **Test the frontend fixes** (should work immediately)
2. **Set up database connection** (for full functionality)
3. **Run the automated tests** (to verify everything works)
4. **Start developing new features** (everything should be working!)

## 💡 Additional Notes

- **Spelling Strategy**: Frontend uses UK spelling (`favourites`), API uses US spelling (`/api/favorites`), but queries UK-spelled database table (`favourites`)
- **No Breaking Changes**: Existing code continues to work with this approach
- **Future Consistency**: Consider standardizing on one spelling system for new features

---

**🎉 Great News**: The main routing issues have been resolved! Your "My Favourites" and "Profile" pages should no longer show 404 errors.
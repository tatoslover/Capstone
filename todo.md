# TODO - Prioritised Action Plan

## High Priority (Critical Functionality)

### 1. Fix Favourites API Error (500) - ✅ COMPLETED
**Issue:** Adding favourites was failing due to database schema mismatch
**Root Cause:** Backend was trying to insert `mana_cost` and `color_identity` columns that didn't exist in database table
**Solution Applied:**
- Removed unnecessary `mana_cost` and `color_identity` parameters from database operations
- Updated backend API endpoint to only use required fields: `user_id`, `card_name`, `scryfall_id`, `ability_type`, `notes`
- Updated frontend to not send redundant parameters
- Frontend already fetches fresh card data from Scryfall API when displaying favourites, so storing mana cost and colour data was redundant

**Status:** Ready for testing - favourites creation should now work properly

### 2. Swagger Documentation Backend Connection - ✅ COMPLETED
**Issue:** Swagger documentation needed proper backend connection and validation
**Root Cause:** Missing environment variable configuration and limited documentation examples
**Solution Applied:**
- Added automatic DATABASE_URL fallback configuration to ensure connection
- Enhanced Swagger UI configuration with better styling and functionality
- Added comprehensive API documentation with examples and error responses
- Created database validation scripts to verify connectivity
- Improved endpoint documentation with detailed parameter descriptions and response schemas
- Verified database connection string works correctly: `postgresql://postgres:yTiwznpoFJQFArsSpZpprsqQHOjcWXvE@tramway.proxy.rlwy.net:59004/railway`

**Status:** Swagger UI accessible at `/api-docs` with full backend connectivity and enhanced documentation

## Medium Priority (User Experience)

### 3. UI Improvements - ✅ COMPLETED
**Issues:** Visual and UX improvements for better usability
**Root Cause:** Search interface and card styling needed enhancement for dark theme consistency
**Solution Applied:**
- **Black card styling**: Added purple outline and enhanced contrast with `border: 2px solid #a855f7` and purple box-shadow for better visibility in dark mode
- **Black filter button**: Added purple outline (`#a855f7`) and purple box-shadow for the "B Black" colour filter button to maintain theme consistency
- **Search icon enhancement**: Replaced text "Search" button with magnifying glass emoji (🔍) and added search icon to input field with proper positioning
- **Card name cleanup**: Removed redundant card names from bottom overlay of search cards for cleaner presentation
- **Mobile stack animation fix**: Added proper z-index layering and positioning to prevent search elements from interfering with title on mobile screens
- **Interactive feedback**: Added hover, focus, and active states for search elements with smooth transitions
- **Search input improvements**: Added magnifying glass icon inside input field with proper spacing and focus states

**Status:** All UI improvements implemented including specific black button purple outline and card name removal

### 4. Content Management
**Actions:**
- Delete Canadian highlander content
- Convert future steps / out of scope to proper bullet points format:
  - (Advanced strategy guides, deck building tools, multiplayer features, tournament tracking, and real-time gameplay simulation)
  - add Setup password authentication for users
  - add Market app as a product

## Low Priority (Documentation & Planning)

### 5. Documentation Enhancements
**Missing Documentation:**
- Database structure
- File structure
- Planning section (consider Figma demo - TBC)

### 6. Implementation Review
**Discussion Points:**
- Wiki scraping scripts (did we actually use Wizards of the Coast: Official MTG comprehensive rules and tournament regulations?)
- Key milestones and versioning strategy (reference release_strategy.md - not yet implemented but planned)

### 7. Header/TOC Organisation
**Actions:**
- Improve table of contents structure
- Organise header hierarchy

## Notes
- All changes to use UK spelling (favourites, colour, organisation, etc.)
- Use globals.css for styling changes
- Avoid regex searches to conserve tokens
- Reference existing documentation in release_strategy.md for versioning plans

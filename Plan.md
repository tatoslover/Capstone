# Planeswalker's Primer - Capstone Project Plan

## Project Overview

**Simple interactive MTG rulebook for beginners with favourites system**
- Target users: New Magic: The Gathering players who need easy rule references
- Core value: Quick, beginner-friendly access to MTG abilities with personal favourites
- Mobile-first design for on-the-go reference during games

## Business Context & Stakeholders

### Target Users
- **Primary**: New MTG players (age 16-35) learning the game
- **Secondary**: Casual players who need quick rule lookups
- **Pain point**: Existing MTG resources are overwhelming for beginners

### Value Proposition
- Simplified explanations of MTG abilities and keywords
- Personal favourites system to save commonly referenced rules
- Clean, mobile-optimised interface for quick access during games
- Integration with Scryfall API for accurate, up-to-date card information

## Technical Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 18
- **Deployment**: Vercel
- **Features**:
  - Responsive design for mobile-first experience
  - Server-side rendering for fast loading
  - Progressive Web App capabilities

### Backend (Express.js + PostgreSQL)
- **Framework**: Express.js with Node.js
- **Database**: PostgreSQL hosted on Railway
- **External API**: Scryfall API for MTG card data
- **Deployment**: Railway

### Database Schema (PostgreSQL)
```sql
-- Users table (simple, no passwords for MVP)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favourites table for user's saved cards/abilities
CREATE TABLE favourites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    card_name VARCHAR(255) NOT NULL,
    scryfall_id VARCHAR(255),
    ability_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### User Management (CRUD)
- `POST /api/users` - Create user profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user profile

### Favourites System (CRUD)
- `POST /api/favourites` - Add card/ability to favourites
- `GET /api/favourites/:userId` - Get user's favourites
- `PUT /api/favourites/:id` - Update favourite with notes
- `DELETE /api/favourites/:id` - Remove from favourites

### Scryfall Integration
- `GET /api/cards/search?q={query}` - Search cards via Scryfall
- `GET /api/cards/random?ability={type}` - Get random cards by ability type
- `GET /api/cards/:id` - Get specific card details

## Testing Strategy

### Unit Tests
- **Frontend**: React component testing with Jest
- **Backend**: API endpoint testing with Supertest
- **Database**: CRUD operation testing

### Integration Tests
- End-to-end user workflows (add favourites, search cards)
- Database connection and query testing
- Scryfall API integration testing

### API Functionality Tests
- All CRUD operations for users and favourites
- Scryfall API error handling and rate limiting
- Authentication and data validation

## Git Workflow & Version Control

### Branch Strategy
```
main (production-ready code)
├── develop (integration branch)
├── feature/user-management
├── feature/favourites-system
├── feature/scryfall-integration
└── feature/frontend-ui
```

### Workflow Process
1. **Create feature branch** from `develop`
2. **Develop feature** with regular commits
3. **Create Pull Request** to `develop`
4. **Code review** and testing
5. **Merge to develop** when approved
6. **Deploy to staging** for testing
7. **Merge develop to main** for production release

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
test: add or update tests
refactor: code refactoring
style: formatting changes
```

### Release Strategy
- **v0.1.0**: Basic user and favourites CRUD
- **v0.2.0**: Scryfall API integration
- **v0.3.0**: Enhanced UI and search functionality
- **v1.0.0**: Full featured MVP

## Implementation Phases

### Phase 1: Foundation
- [x] Set up project repositories and CI/CD
- [x] Configure PostgreSQL database on Railway
- [x] Create basic Express.js server with database connection
- [x] Set up Next.js frontend with Vercel deployment
- [x] Implement basic user CRUD operations

### Phase 2: Core Features
- [x] Implement favourites CRUD system
- [x] Create user interface for managing favourites
- [x] Add basic search functionality
- [x] Implement responsive design

### Phase 3: External Integration
- [x] Integrate Scryfall API for card data
- [x] Add random card examples for each ability type
- [x] Implement card search with filters
- [x] Add error handling and loading states

### Phase 4: Polish & Testing
- [ ] Comprehensive testing suite
- [ ] Performance optimisation
- [ ] Documentation completion
- [ ] User acceptance testing

## Technical Specifications

### Frontend Requirements
- Mobile-first responsive design
- Fast loading times (<3 seconds)
- Offline capability for favourites
- Accessibility compliance (WCAG 2.1)

### Backend Requirements
- RESTful API design
- Input validation and sanitisation
- Rate limiting for external API calls
- Error handling and logging

### Database Requirements
- ACID compliance for data integrity
- Indexed queries for performance
- Regular automated backups
- Connection pooling for scalability

## Quality Assurance

### Code Quality
- ESLint and Prettier for code formatting
- TypeScript for type safety (future enhancement)
- Code review process for all changes
- Automated testing in CI/CD pipeline

### Documentation
- API documentation with examples
- User guide for application features
- Developer setup and deployment guide
- Architecture decision records

### Performance Monitoring
- Frontend performance tracking
- Database query optimisation
- API response time monitoring
- Error tracking and alerting

## Deployment Strategy

### Development Environment
- Local development with Docker containers
- Hot reloading for rapid development
- Mock data for testing without external dependencies

### Staging Environment
- Automatic deployment from `develop` branch
- Full integration testing with real services
- Performance and load testing

### Production Environment
- Deployment from `main` branch only
- Blue-green deployment for zero downtime
- Monitoring and alerting systems
- Regular automated backups

## Success Metrics

### Technical Metrics
- 99.9% uptime for both frontend and backend
- <2 second page load times
- <500ms API response times
- Zero critical security vulnerabilities

### User Experience Metrics
- Mobile-responsive design across all devices
- Intuitive navigation with <3 clicks to any feature
- Clear error messages and loading states
- Comprehensive favourite management system

### Project Completion Metrics
- All CRUD operations fully functional
- Complete integration with Scryfall API
- Comprehensive test coverage (>80%)
- Complete documentation and deployment guides

## Risk Management

### Technical Risks
- **Scryfall API rate limits**: Implement caching and request throttling
- **Database performance**: Use indexes and query optimisation
- **Deployment failures**: Implement rollback procedures

### Project Risks
- **Scope creep**: Stick to MVP features, document future enhancements
- **Time constraints**: Prioritise core functionality over nice-to-have features
- **Third-party dependencies**: Have fallback plans for service outages

## Future Enhancements (Post-MVP)

- User authentication with secure login
- Deck building and analysis features
- Community sharing of favourite card lists
- Advanced search filters and sorting
- Card price tracking integration
- Offline mode with data synchronisation

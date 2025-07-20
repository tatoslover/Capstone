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

### Critical Priority: Comprehensive Testing Implementation (0/10 → 10/10)

#### Backend Testing Infrastructure
```bash
# Install testing dependencies
cd backend
npm install --save-dev jest supertest @types/jest

# Test structure:
backend/tests/
├── api.test.js           # API endpoint testing (messages, users, favourites)
├── database.test.js      # Database operations and connection testing
├── health.test.js        # Health check endpoints
└── integration.test.js   # End-to-end workflows
```

#### Frontend Testing Infrastructure
```bash
# Install React testing dependencies
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Test structure:
frontend/tests/
├── pages.test.js         # Page component tests
├── components.test.js    # Individual component tests (UserSelector, favourites)
├── api-integration.test.js # API call testing
└── user-workflows.test.js  # End-to-end user scenarios
```

#### Test Coverage Requirements (80%+ for full marks)
- **Unit Tests**: All CRUD operations (users, messages, favourites)
- **API Tests**: All endpoints with success/error scenarios, input validation
- **Integration Tests**: Database connectivity, Scryfall API integration
- **Component Tests**: Key React components and user interactions
- **Workflow Tests**: Add favourite, search cards, user management flows
- **Error Handling**: Database failures, malformed requests, API timeouts

#### Testing Scripts (package.json updates)
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:integration": "jest --testNamePattern=integration"
}
```

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

### Release Strategy & Git Enhancement (7/10 → 10/10)

#### Implement Git Releases & Tags
```bash
# Create semantic version tags
git tag -a v0.1.0 -m "Initial MVP with basic CRUD operations"
git tag -a v0.2.0 -m "Scryfall API integration and favourites system"
git tag -a v0.3.0 -m "Enhanced UI and comprehensive testing"
git tag -a v1.0.0 -m "Production-ready release with full feature set"

# Push tags to remote
git push origin --tags
```

#### GitHub Releases Documentation
- **v0.1.0**: Basic user and favourites CRUD with PostgreSQL
- **v0.2.0**: Scryfall API integration and card search functionality
- **v0.3.0**: Comprehensive testing suite and UI enhancements
- **v1.0.0**: Production-ready MVP with monitoring and deployment

#### Branch Strategy Documentation (CONTRIBUTING.md)
- Feature branch workflow with pull request reviews
- Automated testing requirements before merge
- Code review checklist and standards
- Release procedures and hotfix protocols

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

### Phase 4: Production Readiness & Testing
- [x] Basic application functionality complete
- [x] **CRITICAL**: Comprehensive testing suite implementation
- [ ] Performance optimisation and monitoring
- [ ] Complete API documentation with examples
- [ ] User acceptance testing and feedback collection
- [ ] Security audit and vulnerability assessment

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

## Production Deployment Plan (8/10 → 10/10)

### Critical Tasks for Production Readiness

#### Phase 1: Testing & Quality Assurance (2 weeks)
- [ ] **Week 1**: Implement comprehensive test suite (80%+ coverage)
  - [ ] Backend API testing with Jest & Supertest
  - [ ] Frontend component testing with React Testing Library
  - [ ] Integration testing for database and external APIs
  - [ ] Error handling and edge case coverage

- [ ] **Week 2**: Quality assurance and automation
  - [ ] Set up CI/CD pipeline with automated testing
  - [ ] Performance testing and optimisation
  - [ ] Security audit and vulnerability assessment
  - [ ] Code review and documentation standards

#### Phase 2: Infrastructure & Monitoring (1 week)
- [ ] Production database setup with automated backups
- [ ] Environment configuration management and secrets
- [ ] Monitoring and logging implementation (health checks, performance)
- [ ] Error tracking setup (e.g., Sentry integration)
- [ ] SSL certificates and security headers configuration

#### Phase 3: Deployment Strategy (1 week)
- [ ] Blue-green deployment setup for zero downtime
- [ ] Load balancing configuration for scalability
- [ ] Database migration and seeding procedures
- [ ] Rollback procedures and disaster recovery planning
- [ ] Performance monitoring and alerting systems

#### Phase 4: Post-Launch Operations (Ongoing)
- [ ] User feedback collection and analysis
- [ ] Analytics implementation for usage patterns
- [ ] Feature enhancement based on user data
- [ ] Regular security updates and dependency management
- [ ] Capacity planning and scaling strategies

### Gantt Chart Timeline

| Week | Tasks | Dependencies | Deliverables |
|------|-------|--------------|--------------|
| 1 | Backend testing implementation | Database setup complete | API test suite (80%+ coverage) |
| 2 | Frontend testing & CI/CD | Backend tests passing | Component tests, automated pipeline |
| 3 | Infrastructure & monitoring | Testing complete | Production environment ready |
| 4 | Deployment & documentation | All systems tested | Live production deployment |

### Success Metrics

#### Technical Metrics
- 99.9% uptime for both frontend and backend
- <2 second page load times on mobile devices
- <500ms API response times under normal load
- 80%+ test coverage across all modules
- Zero critical security vulnerabilities

#### User Experience Metrics
- Mobile-responsive design across all device sizes
- Intuitive navigation with <3 clicks to any feature
- Clear error messages and loading states
- Comprehensive favourite management system
- Search functionality with <1 second response time

#### Project Completion Metrics
- All CRUD operations fully functional and tested
- Complete integration with Scryfall API
- Comprehensive test coverage with automated CI/CD
- Complete API documentation with examples
- Production deployment with monitoring and logging

## Risk Management

### Technical Risks
- **Scryfall API rate limits**: Implement caching and request throttling
- **Database performance**: Use indexes and query optimisation
- **Deployment failures**: Implement rollback procedures

### Project Risks
- **Scope creep**: Stick to MVP features, document future enhancements
- **Time constraints**: Prioritise core functionality over nice-to-have features
- **Third-party dependencies**: Have fallback plans for service outages

## Implementation Timeline (Next 2 Weeks)

### Week 1: Testing Foundation (Critical Priority)
- **Days 1-2**: Backend API testing implementation
  - Install Jest, Supertest dependencies
  - Create comprehensive API endpoint tests
  - Database operation and error handling tests
- **Days 3-4**: Frontend component testing
  - Install React Testing Library
  - Test key components (UserSelector, favourites, search)
  - User interaction and workflow testing
- **Days 5-7**: Integration testing and CI setup
  - End-to-end workflow testing
  - Automated testing pipeline configuration
  - Test coverage reporting and analysis

### Week 2: Enhancement & Production Readiness
- **Days 1-2**: Git workflow and releases
  - Create semantic version tags
  - GitHub releases with proper documentation
  - CONTRIBUTING.md with development standards
- **Days 3-4**: Production planning documentation
  - Detailed task breakdown with timelines
  - Infrastructure and monitoring requirements
  - Deployment procedures and rollback plans
- **Days 5-7**: Final documentation and polish
  - API documentation with request/response examples
  - User guide and troubleshooting documentation
  - Performance optimisation and security review

### Quick Wins (Can be completed today)
1. **Create git tags** for existing functionality (30 minutes)
2. **Add test scripts** to package.json files (15 minutes)
3. **Document production task list** with specific timelines (45 minutes)
4. **Add API examples** to README and Swagger docs (30 minutes)

### Marking Criteria Impact Assessment

| Criteria Area | Current Score | With Implementation | Point Gain |
|---------------|---------------|-------------------|------------|
| Testing (10%) | 2/10 | 10/10 | +8 points |
| Git/README (10%) | 8/10 | 10/10 | +2 points |
| Project Planning (10%) | 8/10 | 10/10 | +2 points |
| Documentation (15%) | 13/15 | 15/15 | +2 points |

**Total Potential Improvement: +14 points**

## Future Enhancements (Post-MVP)

### Phase 2 Features (Post-Production)
- User authentication with secure login and sessions
- Deck building and analysis features
- Community sharing of favourite card lists
- Advanced search filters and sorting capabilities
- Card price tracking integration with market APIs
- Offline mode with data synchronisation
- Push notifications for new cards and updates
- Advanced analytics and user behaviour tracking

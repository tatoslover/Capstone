# Capstone Project Document: Planeswalker's Primer

## Introduction

### Purpose

**What is the problem or the opportunity that the project is investigating?**

Magic: The Gathering has a notoriously steep learning curve, with new players often overwhelmed by complex rules, terminology, and strategic concepts. The opportunity lies in creating a centralised, beginner-friendly digital reference platform that provides comprehensive information about MTG fundamentals in an accessible format.

**Why is this problem valuable to address?**

- MTG has over 35 million players worldwide, but player retention among beginners remains a significant challenge
- Local game stores struggle to onboard new players effectively without dedicated reference resources
- The game's complexity creates a barrier to entry that prevents market growth
- Existing resources are fragmented across wikis, rulebooks, and community sites

**What is the current state?**

- New players frequently abandon the game due to feeling lost or intimidated by complexity
- Learning resources are scattered across multiple platforms with varying quality
- No single comprehensive platform designed specifically for beginners
- Local game stores lack standardised reference materials

**What is the desired state?**

- A single, comprehensive reference platform that organises MTG fundamentals
- Easy-to-navigate information hub for quick lookups during gameplay
- Interactive tools for card discovery and reference
- Mobile-friendly access for learning during gameplay

**Has this problem been addressed by other projects?**

Yes, several projects exist but with different focuses:
- MTG Wiki: Comprehensive but overwhelming for beginners
- EDHRec: Focused on deck building for experienced players
- Official MTG website: Marketing-focused rather than education-focused
- YouTube tutorials: Unstructured and difficult to navigate systematically

This project specifically targets the beginner segment with an organised, accessible reference approach.

### Industry/Domain

**What is the industry/domain?**

The trading card game (TCG) industry, specifically focused on Magic: The Gathering - the world's first and most successful TCG with over 30 years of history.

**What is the current state of this industry?**

- Market size: Global TCG market valued at £9.1 billion in 2023
- Digital transformation: Shift towards digital companions for physical games
- Challenges: Competition from digital-only card games, complexity barriers for new players
- Growth: Consistent 20% year-over-year growth in the MTG segment

**What is the overall industry value-chain?**

1. **Game Publisher** (Wizards of the Coast) → Designs and produces cards
2. **Distributors** → Supply products to retailers
3. **Local Game Stores** → Sell products and host events
4. **Players** → Purchase and play the game
5. **Secondary Market** → Card trading and resale
6. **Content Creators** → Tutorials, gameplay videos, strategy guides

**What are the key concepts in the industry?**

- **Mana System**: Resource management using five colours
- **Card Types**: Creatures, Spells, Artefacts, Enchantments, Planeswalkers, Lands
- **Game Phases**: Untap, Upkeep, Draw, Main, Combat, End
- **Stack and Priority**: Timing and interaction rules
- **Formats**: Different ways to play (Standard, Modern, Commander, etc.)
- **Deck Construction**: Building 60+ card decks with strategic synergies

**Is the project relevant to other industries?**

Yes, the organised reference approach applies to:
- Other complex tabletop games
- Educational technology platforms
- Digital reference systems
- Community onboarding tools

### Stakeholders

**Who are the stakeholders?**

Primary Stakeholders:
- **New MTG Players**: Ages 13-35 seeking to understand game fundamentals
- **Returning Players**: Former players needing quick reference on rules and mechanics

Secondary Stakeholders:
- **Local Game Store Owners**: Need reference tools to support new player onboarding
- **Experienced Players**: Mentoring newcomers and needing teaching resources
- **Parents**: Helping children learn the game safely

Tertiary Stakeholders:
- **Content Creators**: Reference material for tutorial creation
- **Tournament Organisers**: Ensuring new players understand competitive rules

**Why do they care about this software?**

- **New Players**: Quick access to comprehensive game information
- **Store Owners**: Improves customer experience and retention
- **Experienced Players**: Reliable reference for teaching
- **Parents**: Provides safe, organised information resource

**What are the stakeholders' expectations?**

- Clear, accurate information following official rules
- Easy navigation to find specific information quickly
- Mobile-friendly interface for reference during games
- Regular updates as new mechanics are introduced
- Free access to core reference materials
- Dark theme for comfortable extended reading

## Product Description

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                      │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Reference   │ │     Card     │ │  Favourites  │            │
│  │   Content    │ │    Search    │ │  Management  │            │
│  └─────────────┘ └──────────────┘ └──────────────┘            │
│                           │                                      │
│  ┌─────────────────────────────────────────────────┐           │
│  │              Theme Context (MTG Colours)         │           │
│  └─────────────────────────────────────────────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                     Backend (Express.js)                         │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   RESTful   │ │   Security   │ │ Performance  │            │
│  │     API     │ │  Middleware  │ │ Monitoring   │            │
│  └─────────────┘ └──────────────┘ └──────────────┘            │
│                           │                                      │
│  ┌─────────────────────────────────────────────────┐           │
│  │            PostgreSQL Database (Railway)         │           │
│  │  ┌────────┐ ┌────────────┐ ┌─────────────┐    │           │
│  │  │ Users  │ │ Favourites │ │  Messages   │    │           │
│  │  └────────┘ └────────────┘ └─────────────┘    │           │
│  └─────────────────────────────────────────────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
                    ┌───────────────┐
                    │ Scryfall API  │
                    │ (Card Data)   │
                    └───────────────┘
```

### User Stories

| # | User Story | Description | Priority | Status |
|---|------------|-------------|----------|--------|
| 1 | Access MTG Reference | As a new player, I want to access comprehensive MTG information in one place so that I can look up rules quickly | High | ✅ Complete |
| 2 | Search MTG Cards | As a user, I want to search for cards and view detailed information so that I can learn about specific cards | High | ✅ Complete |
| 3 | Save Favourites | As a user, I want to save my favourite cards for quick access so that I can reference them later | Medium | ✅ Complete |
| 4 | Browse Mechanics | As a player, I want to explore MTG mechanics with detailed explanations so that I understand how abilities work | High | ✅ Complete |
| 5 | Track Progress | As a learner, I want to see my learning progress so that I know what to study next | Low | ❌ Not Implemented |
| 6 | Mobile Access | As a player, I want to access the platform on my mobile device so that I can reference information during games | High | ✅ Complete |

### User Flow

```
┌─────────────────┐
│   User Lands    │
│  on Homepage    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│ Select/Create   │────▶│ View All Topics │
│ User Profile    │     │ Simultaneously  │
└─────────────────┘     └────────┬─────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
                ▼                                 ▼
       ┌─────────────────┐              ┌─────────────────┐
       │ Browse Any      │              │  Search Cards   │
       │ Topic Section   │              │  via Scryfall   │
       └────────┬────────┘              └────────┬────────┘
                │                                 │
                ▼                                 ▼
       ┌─────────────────┐              ┌─────────────────┐
       │ Read Reference  │              │  View Card      │
       │   Content       │              │   Details       │
       └────────┬────────┘              └────────┬────────┘
                │                                 │
                │                                 ▼
                │                       ┌─────────────────┐
                │                       │ Save to         │
                │                       │ Favourites      │
                │                       └────────┬────────┘
                │                                 │
                └────────────┬────────────────────┘
                             │
                             ▼
                   ┌─────────────────┐
                   │ Reference Quick  │
                   │  Guide Panel     │
                   └─────────────────┘
```

### Wireframe Design

The application features a mobile-first dark theme design optimised for gameplay environments. Key design elements include:

- **Dark Theme**: Reduces eye strain during extended reading sessions
- **MTG Colour Integration**: UI elements themed around the five MTG colours
- **Responsive Layout**: Seamless experience across mobile, tablet, and desktop
- **Card-Based Components**: Information presented in familiar card-like containers
- **High Contrast**: Ensures readability in various lighting conditions

Interactive Figma Prototype: [View Mobile Design](https://www.figma.com/proto/X6Yi5UFrELNmPJqNR5Ghbr/Capstone_Mobile?node-id=1-125&p=f&t=iCqmRz0wtU6cs5wZ-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1)

### Open Questions/Out of Scope

**Features considered out of scope:**
- Structured learning paths with progression tracking
- Curriculum-based lesson sequences
- Prerequisite systems for content
- Learning progress tracking
- Advanced strategy guides and meta-game analysis
- Deck building tools and recommendations
- Multiplayer features or social networking
- Tournament tracking and results
- Real-time gameplay simulation
- Password authentication for users
- Commercialisation of the application
- CI/CD pipeline implementation
- Automated testing workflows
- GitHub Actions integration
- Continuous deployment processes

## Non-functional Requirements

### Security Requirements
- **Security Headers**: Robust implementation including CSP, HSTS, and X-Frame-Options
- **Rate Limiting**: 1000 requests per 15 minutes to prevent API abuse
- **Input Validation**: All user inputs sanitised and validated
- **CORS Configuration**: Secure cross-origin request handling
- **Error Handling**: Secure error messages without information leakage
- **HTTPS Enforcement**: All communications encrypted in transit

### Performance Requirements
- **Response Time**: API endpoints respond within 500ms
- **Caching**: 5-minute cache for static content
- **Compression**: Middleware reduces payload sizes
- **Database Pooling**: Efficient connection management
- **Load Handling**: Support 100 concurrent users
- **Mobile Performance**: Optimised for 3G connections

### Usability Requirements
- **Mobile-First Design**: Full functionality on devices 320px and wider
- **Accessibility**: Keyboard navigation and screen reader support
- **Learning Curve**: New users can navigate content within 5 minutes
- **Error Recovery**: Clear error messages with suggested actions
- **Offline Capability**: Basic content accessible without connection

### Reliability Requirements
- **Availability**: 99.5% uptime target
- **Data Integrity**: Transactional consistency for user data
- **Graceful Degradation**: Core features work if external APIs fail
- **Backup Strategy**: Daily database backups
- **Recovery Time**: < 1 hour for critical failures

### Standards Compliance
- **API Design**: RESTful following OpenAPI 3.0 specification
- **Code Standards**: ESLint configuration for consistency
- **Web Standards**: HTML5, CSS3, ES6+ JavaScript
- **Accessibility**: WCAG 2.1 Level AA compliance target
- **Documentation**: JSDoc comments for all major functions

## Project Planning

### Development Timeline

**Phase 1: Foundation (Weeks 1-2)**
- ✅ Project setup and repository initialisation
- ✅ Database schema design and implementation
- ✅ Basic frontend and backend architecture
- ✅ Development environment configuration

**Phase 2: Core Features (Weeks 3-5)**
- ✅ MTG reference content organisation
- ✅ User management system
- ✅ Favourites functionality
- ✅ Dark theme implementation

**Phase 3: Integration (Weeks 6-7)**
- ✅ Scryfall API integration
- ✅ Performance monitoring
- ✅ Security implementation
- ✅ Theme system with MTG colours

**Phase 4: Polish & Deployment (Weeks 8-9)**
- ✅ Production deployment
- ✅ Testing suite completion
- ✅ API documentation
- ✅ Project documentation

### Risk Management
- **Technical Risks**: Mitigated through extensive testing and fallback strategies
- **API Dependency**: Cached responses and graceful degradation if Scryfall unavailable
- **Scope Creep**: Clear out-of-scope definition and focused feature set
- **Performance**: Monitoring and optimisation throughout development

## Testing Strategy

### Quality Assurance Approach
- **Test Coverage**: Extensive coverage across frontend and backend components
- **Testing Framework**: Jest for both React components and API endpoints
- **Manual Testing**: User experience validation with family and friends
- **Security Testing**: Rate limiting and input validation verification
- **Performance Testing**: Load testing and response time monitoring

### Feature Testing
- **Reference Content**: Information accuracy and navigation flow
- **Card Search**: API integration and error handling
- **Favourites System**: CRUD operations and data persistence
- **User Management**: Profile creation and switching
- **Theme System**: Colour switching and persistence

### Edge Case Handling
- **Network Failures**: Graceful degradation with helpful error messages
- **Invalid Input**: Comprehensive validation with user guidance
- **Rate Limiting**: Clear feedback when limits exceeded
- **Database Errors**: Fallback behaviour and error recovery
- **Missing Data**: Default values and placeholder content

### Testing Process
Tests are run manually during development:
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

## Implementation

### Technology Stack
- **Frontend**: Next.js 13+, React 18, CSS-in-JS with custom global styles
- **Backend**: Node.js with Express.js, Helmet security middleware
- **Database**: PostgreSQL with connection pooling
- **External APIs**: Scryfall API for MTG card data
- **Testing**: Jest framework with unit and integration tests
- **Deployment**: Vercel (frontend) and Railway (backend)

### Deployment Considerations
- **Environment Management**: Separate development and production configurations
- **Security**: HTTPS enforcement and security headers
- **Monitoring**: Real-time performance tracking
- **Scalability**: Stateless architecture ready for horizontal scaling
- **Manual Deployment Process**: Controlled releases through platform dashboards

### Manual Deployment Process
1. **Frontend Deployment**: Push to GitHub, deploy through Vercel dashboard
2. **Backend Deployment**: Push to GitHub, deploy through Railway dashboard
3. **Database Updates**: Execute migrations via Railway PostgreSQL console
4. **Verification**: Test both staging and production environments

## End-to-end Solution

### Objectives Achievement
The software successfully meets its objectives of providing a comprehensive, beginner-friendly MTG reference platform:

1. **Comprehensive Reference Coverage**: ✅ All fundamental concepts covered
2. **User-Friendly Interface**: ✅ Intuitive navigation and dark theme
3. **Mobile Accessibility**: ✅ Fully responsive design
4. **Card Reference System**: ✅ Integrated Scryfall search
5. **Personal Reference Tools**: ✅ Favourites system implemented
6. **Performance**: ✅ Sub-500ms response times achieved
7. **Security**: ✅ Robust security measures implemented

### User Feedback
The application was extensively tested among family and friends, with positive feedback on:
- Easy access to comprehensive information
- Clear organisation of game mechanics
- Mobile usability during actual games
- Quick reference capabilities

### Production Metrics
- **Deployment Success**: Live on production environments
- **Performance**: Meets all performance targets
- **Reliability**: No critical failures in production
- **User Adoption**: Successful onboarding of test users

## References

### Code Repository
- **GitHub**: [github.com/tatoslover/Capstone](https://github.com/tatoslover/Capstone)

### External Resources
- **Scryfall API**: Complete MTG card database and high-resolution images
- **MTG Wiki**: Authoritative source for game mechanics and rules
- **Wizards of the Coast**: Official MTG comprehensive rules (reference only)

### Technology Stack
- **Next.js**: React framework for production applications
- **Express.js**: Fast, unopinionated web framework for Node.js
- **PostgreSQL**: Advanced open-source relational database
- **Jest**: JavaScript testing framework
- **Vercel**: Frontend deployment platform
- **Railway**: Backend deployment and database hosting
- **Helmet**: Security middleware for Express applications
- **Swagger/OpenAPI**: API documentation framework

### Libraries and Dependencies
- **Frontend**: React 18, Next.js 13, CSS-in-JS
- **Backend**: Express 4, pg (PostgreSQL client), cors, helmet
- **Testing**: Jest, React Testing Library
- **Documentation**: Swagger UI Express, OpenAPI 3.0
- **Performance**: Compression middleware, response time tracking
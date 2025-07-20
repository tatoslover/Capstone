# Planeswalker's Primer - Testing Guide

## Overview

This document provides comprehensive guidance on testing for the Planeswalker's Primer MTG application. Our testing strategy covers both backend API testing and frontend component testing, ensuring robust functionality and user experience.

## Testing Architecture

### Backend Testing (Node.js/Express)
- **Framework**: Jest with Supertest
- **Coverage**: API endpoints, database operations, integration workflows
- **Location**: `backend/tests/`

### Frontend Testing (Next.js/React)
- **Framework**: Jest with React Testing Library
- **Coverage**: Components, pages, user interactions
- **Location**: `frontend/tests/`

## Quick Start

### Running All Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test

# Run both with coverage
npm run test:coverage
```

### Test Structure

```
backend/tests/
├── api.test.js           # Complete API endpoint testing
├── database.test.js      # Database operations and constraints
├── integration.test.js   # End-to-end user workflows
└── jest.config.js        # Jest configuration

frontend/tests/
├── components.test.js    # React component testing
├── pages.test.js         # Next.js page testing
├── api-integration.test.js # Frontend-backend integration
├── jest.config.js        # Jest configuration
└── jest.setup.js         # Test environment setup
```

## Backend Testing

### API Endpoint Testing (`api.test.js`)

Tests all CRUD operations for:
- **Users**: Create, read, update, delete user profiles
- **Messages**: Complete message management
- **Favourites**: Card favourite system
- **Cards**: Scryfall API integration

**Key Features:**
- Comprehensive endpoint coverage
- Error handling validation
- Input sanitisation testing
- Response format validation

**Example Test:**
```javascript
test('POST /api/users should create a new user', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ username: 'testuser' })
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.username).toBe('testuser');
});
```

### Database Testing (`database.test.js`)

Validates:
- Connection stability and pooling
- Table structure and constraints
- Foreign key relationships
- Cascade operations
- Transaction handling
- Performance under load

**Key Features:**
- Connection pool testing
- Schema validation
- Constraint enforcement
- Concurrent operation handling

### Integration Testing (`integration.test.js`)

End-to-end workflows:
- User registration and profile management
- Card search to favourites workflow
- Cross-entity operations
- Performance testing
- Error handling scenarios

**Example Workflow Test:**
```javascript
test('Complete user lifecycle: create, read, update, delete', async () => {
  // 1. Create user
  const createResponse = await request(app)
    .post('/api/users')
    .send({ username: 'workflowuser' })
    .expect(201);

  // 2. Verify user appears in list
  const listResponse = await request(app)
    .get('/api/users')
    .expect(200);

  // 3. Update user
  // 4. Delete user
  // 5. Verify deletion
});
```

### Running Backend Tests

```bash
cd backend

# All tests
npm test

# Specific test files
npm run test:api
npm run test:db
npm run test:integration

# With coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Verbose output
npm run test:verbose
```

## Frontend Testing

### Component Testing (`components.test.js`)

Comprehensive testing of the `UserSelector` component:
- Loading states and error handling
- User list display and interaction
- Current user management
- Form validation and submission
- Accessibility compliance
- Responsive behaviour

**Key Features:**
- User interaction simulation
- API mocking and error scenarios
- Accessibility testing
- Environment configuration testing

**Example Component Test:**
```javascript
test('should call onUserSelect when user is clicked', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUsers
  });

  const user = userEvent.setup();
  render(<UserSelector onUserSelect={mockOnUserSelect} />);

  await waitFor(() => {
    expect(screen.getByText('testuser1')).toBeInTheDocument();
  });

  await user.click(screen.getByText('testuser1'));
  expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
});
```

### Page Testing (`pages.test.js`)

Tests key application pages:
- **Home Page**: User selection and localStorage integration
- **Search Page**: Card search functionality
- **Favourites Page**: User favourites management
- **Profile Page**: User profile editing
- **API Test Page**: API health monitoring

**Key Features:**
- Next.js router mocking
- localStorage integration testing
- Form submission and validation
- Error handling and loading states

### API Integration Testing (`api-integration.test.js`)

Frontend-backend communication testing:
- User API operations
- Favourites management
- Card search integration
- Message system
- Health checks
- Error handling and edge cases

**Key Features:**
- Complete API workflow testing
- Response format validation
- Error scenario handling
- Network failure simulation

### Running Frontend Tests

```bash
cd frontend

# All tests
npm test

# Specific test files
npm run test:components
npm run test:pages
npm run test:api

# With coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# CI mode (no watch)
npm run test:ci
```

## Test Configuration

### Backend Jest Configuration

```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  collectCoverageFrom: [
    '*.js',
    '!node_modules/**',
    '!tests/**'
  ],
  coverageDirectory: 'coverage'
};
```

### Frontend Jest Configuration

```javascript
// frontend/jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'components/**/*.{js,jsx}',
    'pages/**/*.{js,jsx}',
    '!pages/_app.js'
  ]
};
```

## Coverage Requirements

### Target Coverage Levels
- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## Mock Strategy

### API Mocking
- Global fetch mocking for consistent API simulation
- Realistic response data and error scenarios
- Network failure and timeout simulation

### Component Mocking
- Next.js components (Image, Link, Router)
- Browser APIs (localStorage, sessionStorage)
- Third-party libraries

### Example Mock Setup:
```javascript
// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

## Best Practices

### Test Organisation
1. **Arrange, Act, Assert** pattern
2. Descriptive test names using UK English
3. Consistent mock data and setup
4. Proper cleanup between tests

### Writing Effective Tests
```javascript
// Good: Descriptive test name
test('should show error when failing to fetch users', async () => {
  // Arrange
  fetch.mockRejectedValueOnce(new Error('Network error'));
  
  // Act
  render(<UserSelector onUserSelect={mockOnUserSelect} />);
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
  });
});
```

### Accessibility Testing
```javascript
test('should have proper ARIA labels and roles', async () => {
  render(<UserSelector onUserSelect={mockOnUserSelect} />);
  
  const usernameInput = screen.getByLabelText('Username');
  expect(usernameInput).toHaveAttribute('id', 'username');
  expect(usernameInput).toHaveAttribute('type', 'text');
});
```

## Continuous Integration

### GitHub Actions Integration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      - name: Run backend tests
        run: cd backend && npm run test:coverage
      - name: Run frontend tests
        run: cd frontend && npm run test:ci
```

## Debugging Tests

### Common Issues and Solutions

1. **Test Timeouts**
   ```javascript
   // Increase timeout for slow operations
   test('slow operation', async () => {
     // test code
   }, 10000); // 10 second timeout
   ```

2. **Async Operations**
   ```javascript
   // Always wait for async operations
   await waitFor(() => {
     expect(screen.getByText('Expected text')).toBeInTheDocument();
   });
   ```

3. **Mock Cleanup**
   ```javascript
   afterEach(() => {
     jest.clearAllMocks();
     fetch.mockClear();
   });
   ```

### Running Tests in Debug Mode
```bash
# Node.js debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# VS Code debugging
# Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

## Performance Testing

### Load Testing Examples
```javascript
test('should handle bulk operations efficiently', async () => {
  const startTime = Date.now();
  
  // Perform bulk operations
  const promises = Array.from({ length: 10 }, (_, i) =>
    request(app).post('/api/favorites').send(favouriteData)
  );
  
  await Promise.all(promises);
  
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(5000); // 5 seconds max
});
```

## Test Data Management

### Mock Data Factories
```javascript
// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: 1,
    username: 'testuser',
    created_at: '2023-01-01T00:00:00Z',
    ...overrides,
  }),
  
  createMockCard: (overrides = {}) => ({
    id: 'abc123',
    name: 'Lightning Bolt',
    mana_cost: '{R}',
    type_line: 'Instant',
    ...overrides,
  })
};
```

## Troubleshooting

### Common Test Failures

1. **Database Connection Issues**
   - Ensure test database is running
   - Check environment variables
   - Verify connection pooling

2. **Frontend Rendering Issues**
   - Check mock setup in jest.setup.js
   - Verify component imports
   - Ensure proper async handling

3. **API Mock Issues**
   - Clear fetch mocks between tests
   - Verify mock response format
   - Check API endpoint URLs

### Getting Help

1. Check test output for specific error messages
2. Review mock setup and data
3. Verify environment configuration
4. Consult Jest and React Testing Library documentation

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Include both success and error scenarios
3. Test edge cases and boundary conditions
4. Maintain consistent mock data
5. Update documentation for new test patterns

## Conclusion

This comprehensive testing suite ensures the reliability and robustness of the Planeswalker's Primer application. The tests cover critical user workflows, API functionality, and component behaviour, providing confidence in the application's stability and user experience.

For questions or improvements to the testing setup, please create an issue or submit a pull request with detailed information about the proposed changes.
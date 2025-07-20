module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/*.(test|spec).js'
  ],

  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    '*.js',
    '!node_modules/**',
    '!tests/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  // Setup and teardown
  setupFilesAfterEnv: [],

  // Test timeout (increased for integration tests)
  testTimeout: 30000,

  // Verbose output
  verbose: false,

  // Clear mocks between tests
  clearMocks: true,

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,

  // Transform configuration
  transform: {},

  // Module file extensions
  moduleFileExtensions: [
    'js',
    'json'
  ],

  // Test run order
  testSequencer: '@jest/test-sequencer',

  // Error handling
  bail: false,

  // Maximum worker processes
  maxWorkers: '50%'
};

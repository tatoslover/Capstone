#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
  if (status === 'PASS') {
    log(`✓ ${name}`, colors.green);
  } else if (status === 'FAIL') {
    log(`✗ ${name}`, colors.red);
  } else {
    log(`ℹ ${name}`, colors.yellow);
  }
  if (details) {
    log(`  ${details}`, colors.yellow);
  }
}

function logSection(title) {
  log(`\n${colors.cyan}${colors.bright}=== ${title} ===${colors.reset}`);
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function checkRouteConfig() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  };

  log(`${colors.bright}${colors.blue}🔍 Frontend Route Analysis - Planeswalker's Primer${colors.reset}`);
  log('Checking Next.js page files and navigation consistency\n');

  // Define the project root
  const projectRoot = path.resolve(__dirname, '..');
  const pagesDir = path.join(projectRoot, 'frontend', 'pages');
  const layoutFile = path.join(projectRoot, 'frontend', 'components', 'Layout', 'Layout.js');

  logSection('Page Files Check');

  // Check for page files
  const expectedPages = [
    { route: '/favourites', file: 'favourites.js', description: 'My Favourites page' },
    { route: '/favorites', file: 'favorites.js', description: 'My Favorites page (US spelling)' },
    { route: '/profile', file: 'profile.js', description: 'Profile management page' },
    { route: '/search', file: 'search.js', description: 'Card search page' },
    { route: '/documentation', file: 'documentation.js', description: 'Documentation page' },
    { route: '/', file: 'index.js', description: 'Home page' }
  ];

  expectedPages.forEach(page => {
    results.total++;
    const filePath = path.join(pagesDir, page.file);
    if (checkFileExists(filePath)) {
      logTest(`${page.description} (${page.file})`, 'PASS', `Route: ${page.route}`);
      results.passed++;
    } else {
      logTest(`${page.description} (${page.file})`, 'FAIL', `Missing file for route: ${page.route}`);
      results.failed++;
    }
  });

  logSection('Navigation Links Analysis');

  // Check navigation links in Layout component
  results.total++;
  if (checkFileExists(layoutFile)) {
    logTest('Layout component exists', 'PASS', layoutFile);
    results.passed++;

    try {
      const layoutContent = fs.readFileSync(layoutFile, 'utf8');

      // Check for navigation links
      const navigationLinks = [
        { route: '/favourites', pattern: /href="\/favourites"/, name: 'Favourites (UK)' },
        { route: '/favorites', pattern: /href="\/favorites"/, name: 'Favorites (US)' },
        { route: '/profile', pattern: /href="\/profile"/, name: 'Profile' },
        { route: '/search', pattern: /href="\/search"/, name: 'Search' },
        { route: '/documentation', pattern: /href="\/documentation"/, name: 'Documentation' }
      ];

      navigationLinks.forEach(link => {
        results.total++;
        if (link.pattern.test(layoutContent)) {
          logTest(`Navigation link: ${link.name}`, 'PASS', `Links to ${link.route}`);
          results.passed++;
        } else {
          logTest(`Navigation link: ${link.name}`, 'FAIL', `No link found for ${link.route}`);
          results.failed++;
        }
      });

    } catch (error) {
      results.total++;
      logTest('Layout content analysis', 'FAIL', `Could not read layout file: ${error.message}`);
      results.failed++;
    }
  } else {
    logTest('Layout component exists', 'FAIL', 'Layout.js not found');
    results.failed++;
  }

  logSection('Spelling Consistency Check');

  // Check for spelling consistency issues
  const favouritesExists = checkFileExists(path.join(pagesDir, 'favourites.js'));
  const favoritesExists = checkFileExists(path.join(pagesDir, 'favorites.js'));

  results.total++;
  if (favouritesExists && favoritesExists) {
    logTest('Spelling consistency', 'FAIL', 'Both favourites.js and favorites.js exist - potential conflict');
    results.failed++;
  } else if (favouritesExists) {
    logTest('Spelling consistency', 'PASS', 'Using UK spelling (favourites.js)');
    results.passed++;
  } else if (favoritesExists) {
    logTest('Spelling consistency', 'INFO', 'Using US spelling (favorites.js) - check navigation links');
    results.warnings++;
  } else {
    logTest('Spelling consistency', 'FAIL', 'No favourites/favorites page found');
    results.failed++;
  }

  logSection('Backend API Endpoint Analysis');

  // Check backend server file for API endpoints
  const backendFile = path.join(projectRoot, 'backend', 'server.js');
  results.total++;

  if (checkFileExists(backendFile)) {
    logTest('Backend server file exists', 'PASS', backendFile);
    results.passed++;

    try {
      const backendContent = fs.readFileSync(backendFile, 'utf8');

      // Check for API endpoints
      const apiEndpoints = [
        { endpoint: '/api/users', pattern: /app\.(get|post|put|delete)\("\/api\/users/, name: 'Users CRUD' },
        { endpoint: '/api/favorites', pattern: /app\.(get|post|put|delete)\("\/api\/favorites/, name: 'Favorites CRUD (US)' },
        { endpoint: '/api/favourites', pattern: /app\.(get|post|put|delete)\("\/api\/favourites/, name: 'Favourites CRUD (UK)' }
      ];

      apiEndpoints.forEach(api => {
        results.total++;
        if (api.pattern.test(backendContent)) {
          logTest(`API endpoint: ${api.name}`, 'PASS', `Found ${api.endpoint} routes`);
          results.passed++;
        } else {
          logTest(`API endpoint: ${api.name}`, 'FAIL', `No ${api.endpoint} routes found`);
          results.failed++;
        }
      });

      // Check database table naming
      results.total++;
      if (/favourites/.test(backendContent) && !/favorites/.test(backendContent.replace(/\/api\/favorites/g, ''))) {
        logTest('Database table spelling', 'PASS', 'Using UK spelling (favourites table)');
        results.passed++;
      } else if (/favorites/.test(backendContent)) {
        logTest('Database table spelling', 'INFO', 'Check database table naming consistency');
        results.warnings++;
      } else {
        logTest('Database table spelling', 'FAIL', 'Could not determine table naming');
        results.failed++;
      }

    } catch (error) {
      results.total++;
      logTest('Backend content analysis', 'FAIL', `Could not read backend file: ${error.message}`);
      results.failed++;
    }
  } else {
    logTest('Backend server file exists', 'FAIL', 'server.js not found in backend/');
    results.failed++;
  }

  logSection('Recommendations');

  if (results.failed > 0 || results.warnings > 0) {
    log('\n📋 Issues Found:', colors.yellow);

    if (!checkFileExists(path.join(pagesDir, 'profile.js'))) {
      log('• Create profile.js page for user management', colors.yellow);
    }

    if (!favouritesExists && favoritesExists) {
      log('• Rename favorites.js to favourites.js to match navigation links', colors.yellow);
    }

    if (favouritesExists && favoritesExists) {
      log('• Remove duplicate page files (keep only one spelling)', colors.yellow);
    }

    log('• Ensure consistent spelling throughout the application', colors.yellow);
    log('• Verify backend database connection and environment variables', colors.yellow);
  }

  log('\n🔧 Quick Fixes:', colors.cyan);
  log('1. If favourites page 404s: Check if favourites.js exists and navigation links match', colors.cyan);
  log('2. If profile page 404s: Create profile.js page in frontend/pages/', colors.cyan);
  log('3. If backend connection fails: Check DATABASE_URL environment variable', colors.cyan);
  log('4. Test frontend routes: npm run dev (frontend) and visit http://localhost:3000', colors.cyan);

  logSection('Test Summary');

  log(`Total Checks: ${results.total}`);
  log(`Passed: ${results.passed}`, colors.green);
  log(`Failed: ${results.failed}`, results.failed > 0 ? colors.red : colors.green);
  log(`Warnings: ${results.warnings}`, results.warnings > 0 ? colors.yellow : colors.green);

  const successRate = Math.round((results.passed / results.total) * 100);
  log(`Success Rate: ${successRate}%`, successRate >= 80 ? colors.green : colors.red);

  if (results.failed === 0 && results.warnings === 0) {
    log('\n🎉 All route checks passed! Your frontend routing should work correctly.', colors.green);
  } else if (results.failed === 0) {
    log('\n⚠️  Minor issues found but no critical routing problems detected.', colors.yellow);
  } else {
    log('\n❌ Critical routing issues found. Please address the failed checks above.', colors.red);
  }

  return results;
}

// Run the route check
if (require.main === module) {
  try {
    checkRouteConfig();
  } catch (error) {
    log(`\n💥 Route check failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

module.exports = { checkRouteConfig };

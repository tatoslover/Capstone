#!/usr/bin/env node

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
const TEST_USER_ID = 1;

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, status, details = "") {
  results.total++;
  if (status === "PASS") {
    results.passed++;
    log(`✓ ${name}`, colors.green);
  } else {
    results.failed++;
    log(`✗ ${name}`, colors.red);
  }
  if (details) {
    log(`  ${details}`, colors.yellow);
  }
  results.tests.push({ name, status, details });
}

function logSection(title) {
  log(`\n${colors.cyan}${colors.bright}=== ${title} ===${colors.reset}`);
}

async function testRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: 5000,
      ...options,
    });
    return {
      success: true,
      status: response.status,
      data: await response.json().catch(() => ({})),
      response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: null,
    };
  }
}

async function runTests() {
  log(
    `${colors.bright}${colors.blue}🔧 Planeswalker's Primer - Connection Test${colors.reset}`,
  );
  log(`Testing backend at: ${BACKEND_URL}\n`);

  // Test 1: Backend Health Check
  logSection("Backend Health Check");

  const healthCheck = await testRequest(`${BACKEND_URL}/api/health`);
  if (healthCheck.success && healthCheck.status === 200) {
    logTest(
      "Backend server is running",
      "PASS",
      `Status: ${healthCheck.status}`,
    );
  } else {
    logTest(
      "Backend server is running",
      "FAIL",
      healthCheck.error || `Status: ${healthCheck.status}`,
    );
  }

  // Test 2: Database Connection
  logSection("Database Connection");

  const dbTest = await testRequest(`${BACKEND_URL}/api/users`);
  if (dbTest.success && [200, 404].includes(dbTest.status)) {
    logTest("Database connection", "PASS", "Users endpoint accessible");
  } else {
    logTest(
      "Database connection",
      "FAIL",
      dbTest.error || `Unexpected status: ${dbTest.status}`,
    );
  }

  // Test 3: User CRUD Operations
  logSection("User Management");

  // Create a test user
  const createUser = await testRequest(`${BACKEND_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: `test_user_${Date.now()}` }),
  });

  if (createUser.success && [200, 201].includes(createUser.status)) {
    logTest("User creation", "PASS", `Created user ID: ${createUser.data.id}`);

    // Test getting the user
    const getUser = await testRequest(
      `${BACKEND_URL}/api/users/${createUser.data.id}`,
    );
    if (getUser.success && getUser.status === 200) {
      logTest("User retrieval", "PASS", `Username: ${getUser.data.username}`);
    } else {
      logTest(
        "User retrieval",
        "FAIL",
        getUser.error || `Status: ${getUser.status}`,
      );
    }
  } else {
    logTest(
      "User creation",
      "FAIL",
      createUser.error || `Status: ${createUser.status}`,
    );
  }

  // Test 4: Favourites CRUD Operations
  logSection("Favourites System");

  // Test favourites endpoint
  const favouritesUK = await testRequest(
    `${BACKEND_URL}/api/favourites/${TEST_USER_ID}`,
  );

  if (favouritesUK.success && [200, 404].includes(favouritesUK.status)) {
    logTest(
      "Favourites endpoint (UK spelling)",
      "PASS",
      `Status: ${favouritesUK.status}, Records: ${Array.isArray(favouritesUK.data) ? favouritesUK.data.length : 0}`,
    );
  } else {
    logTest(
      "Favourites endpoint (UK spelling)",
      "FAIL",
      favouritesUK.error || `Status: ${favouritesUK.status}`,
    );
  }

  if (favouritesUK.success && [200, 404].includes(favouritesUK.status)) {
    logTest(
      "Favourites endpoint (UK spelling)",
      "PASS",
      `Status: ${favouritesUK.status}, Records: ${Array.isArray(favouritesUK.data) ? favouritesUK.data.length : 0}`,
    );
  } else {
    logTest(
      "Favourites endpoint (UK spelling)",
      "FAIL",
      favouritesUK.error || `Status: ${favouritesUK.status}`,
    );
  }

  // Test adding a favourite
  const addFavourite = await testRequest(`${BACKEND_URL}/api/favourites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: TEST_USER_ID,
      card_name: "Lightning Bolt",
      scryfall_id: "test-id",
      ability_type: "Instant",
      notes: "Test card for connection testing",
    }),
  });

  if (addFavorite.success && [200, 201].includes(addFavorite.status)) {
    logTest("Add favorite", "PASS", `Added: ${addFavorite.data.card_name}`);
  } else {
    logTest(
      "Add favorite",
      "FAIL",
      addFavorite.error || `Status: ${addFavorite.status}`,
    );
  }

  // Test 5: External API (Scryfall) Connection
  logSection("External API Integration");

  const scryfallTest = await testRequest(
    "https://api.scryfall.com/cards/search?q=lightning+bolt&unique=cards&order=released&dir=asc",
  );
  if (scryfallTest.success && scryfallTest.status === 200) {
    logTest(
      "Scryfall API connection",
      "PASS",
      `Found ${scryfallTest.data.total_cards || 0} results`,
    );
  } else {
    logTest(
      "Scryfall API connection",
      "FAIL",
      scryfallTest.error || `Status: ${scryfallTest.status}`,
    );
  }

  // Test 6: Frontend Route Analysis
  logSection("Frontend Route Analysis");

  const routeTests = [
    { route: "/favourites", expected: "UK spelling route" },
    { route: "/profile", expected: "Profile route" },
  ];

  for (const test of routeTests) {
    // This is just informational since we can't test Next.js routes directly
    logTest(`Route ${test.route}`, "INFO", test.expected);
  }

  // Summary
  logSection("Test Summary");

  log(`Total Tests: ${results.total}`);
  log(`Passed: ${results.passed}`, colors.green);
  log(
    `Failed: ${results.failed}`,
    results.failed > 0 ? colors.red : colors.green,
  );

  const successRate = Math.round((results.passed / results.total) * 100);
  log(
    `Success Rate: ${successRate}%`,
    successRate >= 80 ? colors.green : colors.red,
  );

  if (results.failed > 0) {
    log("\n🔍 Issues to investigate:", colors.yellow);
    results.tests
      .filter((test) => test.status === "FAIL")
      .forEach((test) => log(`- ${test.name}: ${test.details}`, colors.yellow));
  }

  // Recommendations
  logSection("Recommendations");

  log(
    "1. All spelling has been updated to UK English (favourites) for consistency",
  );
  log("2. Create missing profile.js page");
  log(
    "3. Consider standardizing on either US or UK spelling throughout the codebase",
  );
  log("4. Ensure backend server is running before testing frontend");

  return results;
}

// Run the tests
if (require.main === module) {
  runTests().catch((error) => {
    log(`\n💥 Test runner failed: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { runTests, testRequest };

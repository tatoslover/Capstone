#!/usr/bin/env node

/**
 * Database cleanup script to remove orphaned test users
 * This script removes users created during testing that weren't properly cleaned up
 */

require('dotenv').config();
const { pool } = require('./db-enhanced');

const CLEANUP_PATTERNS = [
  'integration_user_%',
  'favourites_user_%',
  'test_user_%',
  'temp_user_%'
];

async function cleanupTestUsers() {
  let client;

  try {
    client = await pool.connect();
    console.log('🧹 Starting test user cleanup...');

    let totalDeleted = 0;

    for (const pattern of CLEANUP_PATTERNS) {
      // First, get users matching the pattern
      const selectQuery = 'SELECT id, username, created_at FROM users WHERE username LIKE $1';
      const selectResult = await client.query(selectQuery, [pattern]);

      if (selectResult.rows.length === 0) {
        console.log(`✅ No users found matching pattern: ${pattern}`);
        continue;
      }

      console.log(`🔍 Found ${selectResult.rows.length} users matching pattern: ${pattern}`);

      // Show what will be deleted
      selectResult.rows.forEach(user => {
        console.log(`   - ${user.username} (ID: ${user.id}, Created: ${user.created_at})`);
      });

      // Delete users (this will cascade delete their favourites due to foreign key constraints)
      const deleteQuery = 'DELETE FROM users WHERE username LIKE $1';
      const deleteResult = await client.query(deleteQuery, [pattern]);

      console.log(`🗑️  Deleted ${deleteResult.rowCount} users matching pattern: ${pattern}`);
      totalDeleted += deleteResult.rowCount;
    }

    console.log(`✅ Cleanup complete. Total users removed: ${totalDeleted}`);

    if (totalDeleted > 0) {
      console.log('ℹ️  Note: Associated favourites were automatically deleted due to foreign key constraints');
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Show usage if --help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Database Test User Cleanup Script

Usage:
  node cleanup-test-users.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be deleted without actually deleting

This script removes test users created during automated testing that match these patterns:
${CLEANUP_PATTERNS.map(p => `  - ${p}`).join('\n')}

Examples:
  node cleanup-test-users.js           # Remove all matching test users
  node cleanup-test-users.js --dry-run # Preview what would be deleted
`);
  process.exit(0);
}

// Dry run mode - just show what would be deleted
if (process.argv.includes('--dry-run')) {
  console.log('🔍 DRY RUN MODE - No users will actually be deleted');

  pool.connect()
    .then(async (client) => {
      try {
        let totalFound = 0;

        for (const pattern of CLEANUP_PATTERNS) {
          const selectQuery = 'SELECT id, username, created_at FROM users WHERE username LIKE $1';
          const result = await client.query(selectQuery, [pattern]);

          if (result.rows.length > 0) {
            console.log(`\n📋 Users matching pattern "${pattern}":`);
            result.rows.forEach(user => {
              console.log(`   - ${user.username} (ID: ${user.id}, Created: ${user.created_at})`);
            });
            totalFound += result.rows.length;
          }
        }

        if (totalFound === 0) {
          console.log('✅ No test users found to clean up');
        } else {
          console.log(`\n📊 Total test users that would be deleted: ${totalFound}`);
          console.log('💡 Run without --dry-run to actually delete these users');
        }

      } finally {
        client.release();
        await pool.end();
      }
    })
    .catch(error => {
      console.error('❌ Error during dry run:', error);
      process.exit(1);
    });
} else {
  // Regular cleanup mode
  cleanupTestUsers();
}

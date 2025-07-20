const { pool, initTables } = require('../db');

describe('Database Connection and Operations', () => {
  beforeAll(async () => {
    // Ensure tables are initialised before running tests
    await initTables();
  });

  afterAll(async () => {
    // Close database connections after all tests
    await pool.end();
  });

  describe('Database Connection', () => {
    test('Should connect to database successfully', async () => {
      const client = await pool.connect();
      expect(client).toBeDefined();
      client.release();
    });

    test('Should execute basic query', async () => {
      const result = await pool.query('SELECT NOW() as current_time');
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toHaveProperty('current_time');
    });

    test('Should handle connection pool properly', async () => {
      // Test multiple concurrent connections
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(pool.query('SELECT $1 as test_value', [i]));
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.rows[0].test_value).toBe(index.toString());
      });
    });
  });

  describe('Table Structure Validation', () => {
    test('Users table should exist with correct structure', async () => {
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);

      const columns = result.rows;
      expect(columns.length).toBeGreaterThan(0);

      // Check essential columns exist
      const columnNames = columns.map(col => col.column_name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('username');
      expect(columnNames).toContain('created_at');
    });

    test('Messages table should exist with correct structure', async () => {
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'messages'
        ORDER BY ordinal_position;
      `);

      const columns = result.rows;
      expect(columns.length).toBeGreaterThan(0);

      const columnNames = columns.map(col => col.column_name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('text');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
    });

    test('Favourites table should exist with correct structure', async () => {
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'favourites'
        ORDER BY ordinal_position;
      `);

      const columns = result.rows;
      expect(columns.length).toBeGreaterThan(0);

      const columnNames = columns.map(col => col.column_name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('user_id');
      expect(columnNames).toContain('card_name');
      expect(columnNames).toContain('scryfall_id');
      expect(columnNames).toContain('ability_type');
      expect(columnNames).toContain('notes');
      expect(columnNames).toContain('created_at');
    });
  });

  describe('Database Constraints and Relationships', () => {
    test('Users table should enforce unique username constraint', async () => {
      const testUsername = 'constraint_test_' + Date.now();

      // First insert should succeed
      await pool.query('INSERT INTO users (username) VALUES ($1)', [testUsername]);

      // Second insert should fail due to unique constraint
      await expect(
        pool.query('INSERT INTO users (username) VALUES ($1)', [testUsername])
      ).rejects.toThrow();

      // Cleanup
      await pool.query('DELETE FROM users WHERE username = $1', [testUsername]);
    });

    test('Favourites should have foreign key relationship with users', async () => {
      // Try to insert favourite with non-existent user_id
      await expect(
        pool.query(
          'INSERT INTO favourites (user_id, card_name) VALUES ($1, $2)',
          [99999, 'Test Card']
        )
      ).rejects.toThrow();
    });

    test('Cascading delete should work for user favourites', async () => {
      // Create test user
      const userResult = await pool.query(
        'INSERT INTO users (username) VALUES ($1) RETURNING id',
        ['cascade_test_' + Date.now()]
      );
      const userId = userResult.rows[0].id;

      // Create test favourite
      await pool.query(
        'INSERT INTO favourites (user_id, card_name) VALUES ($1, $2)',
        [userId, 'Test Card']
      );

      // Verify favourite exists
      const favouritesBefore = await pool.query(
        'SELECT * FROM favourites WHERE user_id = $1',
        [userId]
      );
      expect(favouritesBefore.rows.length).toBe(1);

      // Delete user
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);

      // Verify favourites are deleted due to cascade
      const favouritesAfter = await pool.query(
        'SELECT * FROM favourites WHERE user_id = $1',
        [userId]
      );
      expect(favouritesAfter.rows.length).toBe(0);
    });
  });

  describe('Data Operations', () => {
    let testUserId;

    beforeEach(async () => {
      // Create test user for each test
      const result = await pool.query(
        'INSERT INTO users (username) VALUES ($1) RETURNING id',
        ['db_test_user_' + Date.now()]
      );
      testUserId = result.rows[0].id;
    });

    afterEach(async () => {
      // Clean up test data
      if (testUserId) {
        await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
      }
    });

    test('Should handle transaction rollback on error', async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Insert valid data
        await client.query(
          'INSERT INTO messages (text) VALUES ($1)',
          ['Transaction test message']
        );

        // Try to insert invalid data (this should fail)
        await client.query(
          'INSERT INTO users (username) VALUES ($1)',
          [null] // This should violate NOT NULL constraint
        );

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');

        // Verify the valid insert was rolled back
        const result = await client.query(
          'SELECT * FROM messages WHERE text = $1',
          ['Transaction test message']
        );
        expect(result.rows.length).toBe(0);
      } finally {
        client.release();
      }
    });

    test('Should handle bulk operations efficiently', async () => {
      const messages = [];
      for (let i = 0; i < 10; i++) {
        messages.push(`Bulk test message ${i}`);
      }

      // Insert multiple messages
      const insertPromises = messages.map(text =>
        pool.query('INSERT INTO messages (text) VALUES ($1) RETURNING id', [text])
      );

      const results = await Promise.all(insertPromises);
      expect(results.length).toBe(10);

      // Verify all messages were inserted
      const selectResult = await pool.query(
        'SELECT * FROM messages WHERE text LIKE $1',
        ['Bulk test message%']
      );
      expect(selectResult.rows.length).toBe(10);

      // Cleanup
      const messageIds = results.map(result => result.rows[0].id);
      await pool.query(
        'DELETE FROM messages WHERE id = ANY($1)',
        [messageIds]
      );
    });

    test('Should handle date operations correctly', async () => {
      // Insert message and check timestamps
      const result = await pool.query(
        'INSERT INTO messages (text) VALUES ($1) RETURNING created_at, updated_at',
        ['Timestamp test']
      );

      const { created_at, updated_at } = result.rows[0];
      expect(new Date(created_at)).toBeInstanceOf(Date);
      expect(new Date(updated_at)).toBeInstanceOf(Date);

      // Test timestamp updates
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const updateResult = await pool.query(
        'UPDATE messages SET text = $1 WHERE created_at = $2 RETURNING updated_at',
        ['Updated timestamp test', created_at]
      );

      const newUpdatedAt = updateResult.rows[0].updated_at;
      expect(new Date(newUpdatedAt)).toBeInstanceOf(Date);
      expect(new Date(newUpdatedAt).getTime()).toBeGreaterThan(new Date(updated_at).getTime());

      // Cleanup
      await pool.query('DELETE FROM messages WHERE created_at = $1', [created_at]);
    });
  });

  describe('Performance and Indexing', () => {
    test('Should have appropriate indexes for common queries', async () => {
      // Check for primary key indexes
      const indexResult = await pool.query(`
        SELECT indexname, tablename
        FROM pg_indexes
        WHERE tablename IN ('users', 'messages', 'favourites')
        AND indexname LIKE '%_pkey';
      `);

      expect(indexResult.rows.length).toBeGreaterThanOrEqual(3);

      const indexNames = indexResult.rows.map(row => row.indexname);
      expect(indexNames).toContain('users_pkey');
      expect(indexNames).toContain('messages_pkey');
      expect(indexNames).toContain('favourites_pkey');
    });

    test('Should handle concurrent access without deadlocks', async () => {
      const concurrentOperations = [];

      // Create multiple concurrent read/write operations
      for (let i = 0; i < 5; i++) {
        concurrentOperations.push(
          pool.query('INSERT INTO messages (text) VALUES ($1) RETURNING id', [`Concurrent test ${i}`])
        );
        concurrentOperations.push(
          pool.query('SELECT COUNT(*) FROM messages')
        );
      }

      // All operations should complete without deadlock
      const results = await Promise.all(concurrentOperations);
      expect(results.length).toBe(10);

      // Cleanup
      await pool.query('DELETE FROM messages WHERE text LIKE $1', ['Concurrent test%']);
    });
  });

  describe('Error Handling', () => {
    test('Should handle malformed queries gracefully', async () => {
      await expect(
        pool.query('INVALID SQL QUERY')
      ).rejects.toThrow();
    });

    test('Should handle connection timeouts appropriately', async () => {
      // This test would normally require more complex setup to simulate network issues
      // For now, we'll test that the pool handles basic connection management
      const client = await pool.connect();
      expect(client).toBeDefined();

      // Test that we can release and reconnect
      client.release();

      const newClient = await pool.connect();
      expect(newClient).toBeDefined();
      newClient.release();
    });

    test('Should handle invalid data types gracefully', async () => {
      await expect(
        pool.query('INSERT INTO users (id, username) VALUES ($1, $2)', ['not_a_number', 'test'])
      ).rejects.toThrow();
    });
  });
});

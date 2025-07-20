const { Pool } = require("pg");
const { queryPerformanceTracker } = require("./middleware/performance");

// Enhanced connection pool with optimised settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  // Performance optimisation settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close connections after they have been used 7500 times
});

// Connection monitoring
pool.on("connect", (client) => {
  console.log("📊 Connected to PostgreSQL database");
  console.log(`🔗 Total connections: ${pool.totalCount}, Idle: ${pool.idleCount}, Waiting: ${pool.waitingCount}`);
});

pool.on("error", (err, client) => {
  console.error("🚨 Database connection error:", err);
});

pool.on("acquire", (client) => {
  console.log("🎯 Client acquired from pool");
});

pool.on("remove", (client) => {
  console.log("🗑️ Client removed from pool");
});

// Enhanced query method with performance tracking
const query = async (text, params, queryName = 'unknown') => {
  const startTime = Date.now();
  const client = await pool.connect();

  try {
    const result = await client.query(text, params);
    const duration = queryPerformanceTracker.track(queryName, startTime);

    // Log query performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗄️ Query executed: ${queryName} - ${duration}ms`);
    }

    return result;
  } catch (error) {
    console.error(`🚨 Database query error (${queryName}):`, error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Optimised queries with proper indexing
const initTables = async () => {
  try {
    console.log("🔧 Initialising database tables with performance optimisations...");

    // Messages table with indexes
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, [], 'create_messages_table');

    // Add index on created_at for sorting
    await query(`
      CREATE INDEX IF NOT EXISTS idx_messages_created_at
      ON messages(created_at DESC)
    `, [], 'create_messages_index');

    // Users table with optimisations
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, [], 'create_users_table');

    // Add index on username for faster lookups
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_username
      ON users(username)
    `, [], 'create_users_username_index');

    // Favourites table with proper foreign key constraints and indexes
    await query(`
      CREATE TABLE IF NOT EXISTS favourites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        card_name VARCHAR(255) NOT NULL,
        scryfall_id VARCHAR(255),
        ability_type VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, [], 'create_favourites_table');

    // Add composite index for user favourites queries
    await query(`
      CREATE INDEX IF NOT EXISTS idx_favourites_user_created
      ON favourites(user_id, created_at DESC)
    `, [], 'create_favourites_user_index');

    // Add index on ability_type for filtering
    await query(`
      CREATE INDEX IF NOT EXISTS idx_favourites_ability_type
      ON favourites(ability_type)
    `, [], 'create_favourites_ability_index');

    // Add index on scryfall_id for card lookups
    await query(`
      CREATE INDEX IF NOT EXISTS idx_favourites_scryfall_id
      ON favourites(scryfall_id)
    `, [], 'create_favourites_scryfall_index');

    // Update trigger for messages table
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `, [], 'create_update_trigger_function');

    await query(`
      DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
      CREATE TRIGGER update_messages_updated_at
        BEFORE UPDATE ON messages
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `, [], 'create_messages_update_trigger');

    // Add table statistics update
    await query(`ANALYZE messages, users, favourites`, [], 'analyze_tables');

    console.log("✅ Database tables and indexes initialised successfully");

    // Log current connection pool status
    console.log(`📊 Pool status - Total: ${pool.totalCount}, Idle: ${pool.idleCount}, Waiting: ${pool.waitingCount}`);

  } catch (error) {
    console.error("🚨 Error initialising tables:", error);
    throw error;
  }
};

// Enhanced CRUD operations with performance optimisations

// Optimised user operations
const userOperations = {
  // Create user with duplicate check
  create: async (username) => {
    return await query(
      `INSERT INTO users (username) VALUES ($1)
       ON CONFLICT (username) DO NOTHING
       RETURNING *`,
      [username],
      'create_user'
    );
  },

  // Get user by ID with prepared statement-like approach
  getById: async (id) => {
    return await query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
      'get_user_by_id'
    );
  },

  // Get user by username with index utilisation
  getByUsername: async (username) => {
    return await query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
      'get_user_by_username'
    );
  },

  // Get all users with pagination
  getAll: async (limit = 50, offset = 0) => {
    return await query(
      `SELECT * FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
      'get_all_users'
    );
  },

  // Update user
  update: async (id, username) => {
    return await query(
      `UPDATE users SET username = $1 WHERE id = $2 RETURNING *`,
      [username, id],
      'update_user'
    );
  },

  // Delete user (will cascade to favourites)
  delete: async (id) => {
    return await query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
      'delete_user'
    );
  }
};

// Optimised favourites operations
const favouritesOperations = {
  // Create favourite with duplicate prevention
  create: async (userId, cardName, scryfallId, abilityType, notes) => {
    return await query(
      `INSERT INTO favourites (user_id, card_name, scryfall_id, ability_type, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, cardName, scryfallId, abilityType, notes],
      'create_favourite'
    );
  },

  // Get user favourites with optimised query
  getByUserId: async (userId, limit = 50, offset = 0) => {
    return await query(
      `SELECT * FROM favourites
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
      'get_user_favourites'
    );
  },

  // Get favourites by ability type
  getByAbilityType: async (userId, abilityType) => {
    return await query(
      `SELECT * FROM favourites
       WHERE user_id = $1 AND ability_type = $2
       ORDER BY created_at DESC`,
      [userId, abilityType],
      'get_favourites_by_ability'
    );
  },

  // Update favourite notes
  update: async (id, notes) => {
    return await query(
      `UPDATE favourites SET notes = $1 WHERE id = $2 RETURNING *`,
      [notes, id],
      'update_favourite'
    );
  },

  // Delete favourite
  delete: async (id) => {
    return await query(
      `DELETE FROM favourites WHERE id = $1 RETURNING *`,
      [id],
      'delete_favourite'
    );
  },

  // Get favourite count for user
  getCount: async (userId) => {
    return await query(
      `SELECT COUNT(*) as count FROM favourites WHERE user_id = $1`,
      [userId],
      'get_favourite_count'
    );
  }
};

// Optimised message operations
const messageOperations = {
  // Create message
  create: async (text) => {
    return await query(
      `INSERT INTO messages (text) VALUES ($1) RETURNING *`,
      [text],
      'create_message'
    );
  },

  // Get all messages with pagination
  getAll: async (limit = 50, offset = 0) => {
    return await query(
      `SELECT * FROM messages
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
      'get_all_messages'
    );
  },

  // Get message by ID
  getById: async (id) => {
    return await query(
      `SELECT * FROM messages WHERE id = $1`,
      [id],
      'get_message_by_id'
    );
  },

  // Update message
  update: async (id, text) => {
    return await query(
      `UPDATE messages SET text = $1 WHERE id = $2 RETURNING *`,
      [text, id],
      'update_message'
    );
  },

  // Delete message
  delete: async (id) => {
    return await query(
      `DELETE FROM messages WHERE id = $1 RETURNING *`,
      [id],
      'delete_message'
    );
  }
};

// Database health check with performance metrics
const healthCheck = async () => {
  const startTime = Date.now();

  try {
    const result = await query(
      `SELECT
        NOW() as timestamp,
        version() as postgres_version,
        current_database() as database_name,
        current_user as current_user
      `,
      [],
      'health_check'
    );

    const responseTime = Date.now() - startTime;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      database: result.rows[0],
      pool: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    };
  }
};

// Graceful shutdown
const closePool = async () => {
  console.log("🔄 Closing database connection pool...");
  await pool.end();
  console.log("✅ Database connection pool closed");
};

// Handle process termination
process.on('SIGINT', closePool);
process.on('SIGTERM', closePool);

module.exports = {
  pool,
  query,
  initTables,
  healthCheck,
  closePool,

  // Enhanced operations
  userOperations,
  favouritesOperations,
  messageOperations
};

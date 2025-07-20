const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

// Import enhanced modules
const { initTables, healthCheck } = require("./db-enhanced");
const {
  helmet,
  compression,
  limiter,
  scryfallLimiter,
  responseTimeMiddleware,
  performanceLogger,
  errorTracker,
  cacheMiddleware,
  getPerformanceMetrics
} = require("./middleware/performance");
const monitoringRoutes = require("./routes/monitoring");

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Capstone API",
      version: "1.0.0",
      description: "Enhanced API with performance monitoring for the Capstone MTG application",
      contact: {
        name: "API Support",
        email: "support@capstone.com"
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production"
          ? "https://capstone-production-e2db.up.railway.app"
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === "production" ? "Production server" : "Development server"
      }
    ],
    tags: [
      { name: "Health", description: "Server health endpoints" },
      { name: "Monitoring", description: "Performance monitoring and metrics" },
      { name: "Users", description: "User management operations" },
      { name: "Messages", description: "Message CRUD operations" },
      { name: "Favourites", description: "User favourite cards management" },
      { name: "Cards", description: "MTG card search via Scryfall API" }
    ]
  },
  apis: ["./server.js", "./routes/*.js"]
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Security and Performance Middleware (order matters!)
console.log("🔧 Initialising performance middleware...");

// Security headers with iframe-friendly configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'self'", "http://localhost:3000", "https://localhost:3000", "https://*.vercel.app"],
    },
  },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
}));

// Compression for better performance
app.use(compression());

// Performance tracking
app.use(responseTimeMiddleware);
app.use(performanceLogger);

// CORS and JSON parsing (MUST come before rate limiting to set headers)
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any Vercel deployment URL that contains 'capstone'
        if (origin.includes('vercel.app') && origin.includes('capstone')) {
          return callback(null, true);
        }

        // Reject other origins
        callback(new Error('Not allowed by CORS'));
      }
    : ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting (after CORS to ensure proper headers)
app.use("/api/cards", scryfallLimiter); // Specific rate limiting for Scryfall API
app.use(limiter); // General rate limiting

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.set('X-Request-ID', req.id);
  next();
});

// Cache middleware for GET requests
app.use(cacheMiddleware(300)); // 5 minutes cache

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Planeswalker's Primer API Documentation",
  customfavIcon: "/favicon.ico"
}));

// Initialize database tables on startup
initTables().then(() => {
  console.log("✅ Enhanced database initialisation complete");
}).catch(err => {
  console.error("❌ Database initialisation failed:", err);
});

// Monitoring Routes
app.use("/api/monitoring", monitoringRoutes);

// Enhanced Health Check Routes

/**
 * @swagger
 * /:
 *   get:
 *     summary: Server welcome message with performance info
 *     tags: [Health]
 *     description: Returns a welcome message, server status, and basic performance metrics
 *     responses:
 *       200:
 *         description: Server is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello World from Planeswalker's Primer Backend!"
 *                 status:
 *                   type: string
 *                   example: "Server is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 performance:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: string
 *                     totalRequests:
 *                       type: number
 *                     averageResponseTime:
 *                       type: number
 */
app.get("/", (req, res) => {
  const metrics = getPerformanceMetrics();

  res.json({
    message: "Hello World from Planeswalker's Primer Backend! 🎴⚡",
    status: "Server is running with performance monitoring",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0-enhanced",
    performance: {
      uptime: metrics.server.uptime.human,
      totalRequests: metrics.server.requests.total,
      averageResponseTime: metrics.server.requests.averageResponseTime,
      errorRate: metrics.server.requests.errorRate
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check endpoint
 *     tags: [Health]
 *     description: Returns basic server health status
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", async (req, res) => {
  try {
    const dbHealth = await healthCheck();

    res.json({
      status: dbHealth.status === 'healthy' ? "OK" : "DEGRADED",
      timestamp: new Date().toISOString(),
      database: dbHealth.status,
      responseTime: dbHealth.responseTime
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: "Health check failed"
    });
  }
});

// CRUD Operations for Messages

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated message ID
 *         text:
 *           type: string
 *           description: Message content
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     User:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *         username:
 *           type: string
 *           description: Unique username
 *           maxLength: 50
 *         created_at:
 *           type: string
 *           format: date-time
 *     Favourite:
 *       type: object
 *       required:
 *         - user_id
 *         - card_name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated favourite ID
 *         user_id:
 *           type: integer
 *           description: ID of the user who favourited the card
 *         card_name:
 *           type: string
 *           description: Name of the MTG card
 *         scryfall_id:
 *           type: string
 *           description: Scryfall API card ID
 *         ability_type:
 *           type: string
 *           description: Type of ability or keyword
 *         notes:
 *           type: string
 *           description: User's personal notes about the card
 *         created_at:
 *           type: string
 *           format: date-time
 */

// Import enhanced database operations
const { messageOperations, userOperations, favouritesOperations } = require("./db-enhanced");

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages with pagination
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of messages to skip
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
app.get("/api/messages", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 items
    const offset = parseInt(req.query.offset) || 0;

    const result = await messageOperations.getAll(limit, offset);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      error: "Failed to fetch messages",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Message content
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid input
 */
app.post("/api/messages", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Message text is required",
        requestId: req.id
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        error: "Message text too long (max 1000 characters)",
        requestId: req.id
      });
    }

    const result = await messageOperations.create(text.trim());
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      error: "Failed to create message",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message found
 *       404:
 *         description: Message not found
 */
app.get("/api/messages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid message ID",
        requestId: req.id
      });
    }

    const result = await messageOperations.getById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Message not found",
        requestId: req.id
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({
      error: "Failed to fetch message",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Update a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 */
app.put("/api/messages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { text } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid message ID",
        requestId: req.id
      });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Message text is required",
        requestId: req.id
      });
    }

    const result = await messageOperations.update(id, text.trim());

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Message not found",
        requestId: req.id
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({
      error: "Failed to update message",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid message ID",
        requestId: req.id
      });
    }

    const result = await messageOperations.delete(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Message not found",
        requestId: req.id
      });
    }

    res.json({
      message: "Message deleted successfully",
      deletedMessage: result.rows[0],
      requestId: req.id
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      error: "Failed to delete message",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

// User Management Routes (Enhanced with validation)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or username already exists
 */
app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
        requestId: req.id
      });
    }

    if (username.length > 50) {
      return res.status(400).json({
        error: "Username too long (max 50 characters)",
        requestId: req.id
      });
    }

    // Check for alphanumeric username
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error: "Username can only contain letters, numbers, and underscores",
        requestId: req.id
      });
    }

    const result = await userOperations.create(username.trim());

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Username already exists",
        requestId: req.id
      });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Failed to create user",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve all users ordered by creation date (newest first)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
app.get("/api/users", async (req, res) => {
  try {
    const result = await userOperations.getAll();
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
app.get("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
        requestId: req.id
      });
    }

    const result = await userOperations.getById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        requestId: req.id
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to fetch user",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
app.put("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
        requestId: req.id
      });
    }

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
        requestId: req.id
      });
    }

    if (username.length > 50) {
      return res.status(400).json({
        error: "Username too long (max 50 characters)",
        requestId: req.id
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error: "Username can only contain letters, numbers, and underscores",
        requestId: req.id
      });
    }

    const result = await userOperations.update(id, username.trim());

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        requestId: req.id
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Failed to update user",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
        requestId: req.id
      });
    }

    const result = await userOperations.delete(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        requestId: req.id
      });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
      requestId: req.id
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Failed to delete user",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

// CRUD Operations for Favourites

/**
 * @swagger
 * /api/favourites:
 *   get:
 *     summary: Get all favourites for a user
 *     tags: [Favourites]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: User ID to get favourites for
 *       - in: query
 *         name: ability_type
 *         schema:
 *           type: string
 *         description: Filter by ability type
 *     responses:
 *       200:
 *         description: List of favourites
 *       400:
 *         description: Invalid user ID
 */
app.get("/api/favourites", async (req, res) => {
  try {
    const { user_id, ability_type } = req.query;

    if (!user_id) {
      return res.status(400).json({
        error: "user_id parameter is required",
        requestId: req.id
      });
    }

    const userId = parseInt(user_id);
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        requestId: req.id
      });
    }

    let result;
    if (ability_type) {
      result = await favouritesOperations.getByAbilityType(userId, ability_type);
    } else {
      result = await favouritesOperations.getByUserId(userId);
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({
      error: "Failed to fetch favourites",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/favourites/{id}:
 *   get:
 *     summary: Get a favourite by ID
 *     tags: [Favourites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favourite found
 *       404:
 *         description: Favourite not found
 */
app.get("/api/favourites/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid favourite ID",
        requestId: req.id
      });
    }

    const result = await favouritesOperations.getById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Favourite not found",
        requestId: req.id
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching favourite:", error);
    res.status(500).json({
      error: "Failed to fetch favourite",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/favourites:
 *   post:
 *     summary: Create a new favourite
 *     tags: [Favourites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - card_name
 *             properties:
 *               user_id:
 *                 type: integer
 *               card_name:
 *                 type: string
 *               scryfall_id:
 *                 type: string
 *               ability_type:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Favourite created successfully
 *       400:
 *         description: Invalid input
 */
app.post("/api/favourites", async (req, res) => {
  try {
    const { user_id, card_name, scryfall_id, ability_type, mana_cost, color_identity, notes } = req.body;

    if (!user_id || !card_name) {
      return res.status(400).json({
        error: "user_id and card_name are required",
        requestId: req.id
      });
    }

    if (typeof user_id !== 'number' || user_id <= 0) {
      return res.status(400).json({
        error: "user_id must be a positive number",
        requestId: req.id
      });
    }

    if (!card_name.trim()) {
      return res.status(400).json({
        error: "card_name cannot be empty",
        requestId: req.id
      });
    }

    const result = await favouritesOperations.create(
      user_id,
      card_name.trim(),
      scryfall_id,
      ability_type,
      mana_cost,
      color_identity,
      notes
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating favourite:", error);
    res.status(500).json({
      error: "Failed to create favourite",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/favourites/{id}:
 *   put:
 *     summary: Update a favourite's notes
 *     tags: [Favourites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favourite updated successfully
 *       404:
 *         description: Favourite not found
 */
app.put("/api/favourites/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { notes } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid favourite ID",
        requestId: req.id
      });
    }

    if (notes === undefined) {
      return res.status(400).json({
        error: "notes field is required",
        requestId: req.id
      });
    }

    const result = await favouritesOperations.update(id, notes);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Favourite not found",
        requestId: req.id
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating favourite:", error);
    res.status(500).json({
      error: "Failed to update favourite",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/favourites/{id}:
 *   delete:
 *     summary: Delete a favourite by ID
 *     tags: [Favourites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favourite deleted successfully
 *       404:
 *         description: Favourite not found
 */
app.delete("/api/favourites/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid favourite ID",
        requestId: req.id
      });
    }

    const result = await favouritesOperations.delete(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Favourite not found",
        requestId: req.id
      });
    }

    res.json({
      message: "Favourite deleted successfully",
      favourite: result.rows[0],
      requestId: req.id
    });
  } catch (error) {
    console.error("Error deleting favourite:", error);
    res.status(500).json({
      error: "Failed to delete favourite",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

// Client metrics endpoint for frontend performance monitoring
app.post("/api/monitoring/client-metrics", (req, res) => {
  try {
    const { url, userAgent, timestamp, metrics } = req.body;

    // Log client metrics (in production, you'd save these to a metrics database)
    console.log("📊 Client metrics received:", {
      url,
      userAgent: userAgent?.substring(0, 100),
      timestamp,
      sessionDuration: metrics.session?.duration,
      apiCalls: metrics.apiCalls?.total,
      errors: metrics.errors?.total
    });

    res.json({
      message: "Client metrics received",
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  } catch (error) {
    console.error("Error processing client metrics:", error);
    res.status(500).json({
      error: "Failed to process client metrics",
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware (must be last)
app.use(errorTracker);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});

// Graceful shutdown handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Enhanced server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Monitoring: http://localhost:${PORT}/api/monitoring/health`);
  console.log(`⚡ Performance optimisations enabled`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;

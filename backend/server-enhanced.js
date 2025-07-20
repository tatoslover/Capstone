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
      title: "Planeswalker's Primer API",
      version: "1.0.0",
      description: "Enhanced API with performance monitoring for the Planeswalker's Primer MTG application",
      contact: {
        name: "API Support",
        email: "support@plansewalkersprimer.com"
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production"
          ? "https://plansewalkers-primer-api.railway.app"
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
  apis: ["./server-enhanced.js", "./routes/*.js"]
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Security and Performance Middleware (order matters!)
console.log("🔧 Initialising performance middleware...");

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression for better performance
app.use(compression());

// Performance tracking
app.use(responseTimeMiddleware);
app.use(performanceLogger);

// Rate limiting
app.use("/api/cards", scryfallLimiter); // Specific rate limiting for Scryfall API
app.use(limiter); // General rate limiting

// CORS and JSON parsing
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? ["https://plansewalkers-primer.vercel.app"]
    : ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

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

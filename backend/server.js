const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const { pool, initTables } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Planeswalker's Primer API",
      version: "1.0.0",
      description:
        "API documentation for the Planeswalker's Primer MTG application",
      contact: {
        name: "API Support",
        email: "support@plansewalkersprimer.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://plansewalkers-primer-api.railway.app"
            : `http://localhost:${PORT}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    tags: [
      { name: "Health", description: "Server health endpoints" },
      { name: "Users", description: "User management operations" },
      { name: "Messages", description: "Message CRUD operations" },
      { name: "Favourites", description: "User favourite cards management" },
      { name: "Cards", description: "MTG card search via Scryfall API" },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Planeswalker's Primer API Documentation",
  }),
);

// Initialize database tables on startup
initTables();

// Routes

/**
 * @swagger
 * /:
 *   get:
 *     summary: Server welcome message
 *     tags: [Health]
 *     description: Returns a welcome message and server status
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
 */
app.get("/", (req, res) => {
  res.json({
    message: "Hello World from Planeswalker's Primer Backend!",
    status: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Returns server health status
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
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
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
 *           minLength: 1
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
 *           description: Scryfall UUID for the card
 *         ability_type:
 *           type: string
 *           description: Type of ability or card category
 *         notes:
 *           type: string
 *           description: User's personal notes about the card
 *         created_at:
 *           type: string
 *           format: date-time
 */

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
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request - missing text
 *       500:
 *         description: Database error
 */
app.post("/api/messages", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (text) VALUES ($1) RETURNING *",
      [text],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     description: Retrieve all messages ordered by creation date (newest first)
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Database error
 */
app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Database error" });
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
 *         description: Message ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *       500:
 *         description: Database error
 */
app.get("/api/messages/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Update a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
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
 *                 description: Updated message content
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request - missing text
 *       404:
 *         description: Message not found
 *       500:
 *         description: Database error
 */
app.put("/api/messages/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE messages SET text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [text, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message deleted"
 *                 deleted:
 *                   $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *       500:
 *         description: Database error
 */
app.delete("/api/messages/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// User CRUD Operations

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
 *                 description: Unique username (1-50 characters)
 *                 minLength: 1
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing username or username already exists
 *       500:
 *         description: Database error
 */
app.post("/api/users", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING *",
      [username],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Database error" });
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
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Database error
 */
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Database error" });
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
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
app.get("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "SELECT id, username, created_at FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Database error" });
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
 *         description: User ID
 *         schema:
 *           type: integer
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
 *                 description: Updated username (1-50 characters)
 *                 minLength: 1
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing username or username already exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
app.put("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, created_at",
      [username, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Database error" });
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
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted"
 *                 deleted:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
app.delete("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, username",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Scryfall API Integration

/**
 * @swagger
 * /api/cards/search:
 *   get:
 *     summary: Search MTG cards via Scryfall API
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Search query for cards
 *         schema:
 *           type: string
 *           example: "lightning bolt"
 *     responses:
 *       200:
 *         description: Search results from Scryfall
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 has_more:
 *                   type: boolean
 *                 total_cards:
 *                   type: integer
 *       400:
 *         description: Bad request - missing search query
 *       500:
 *         description: Failed to search cards
 */
app.get("/api/cards/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query (q) is required" });
  }

  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.json({ data: [], has_more: false, total_cards: 0 });
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error searching cards:", error);
    res.status(500).json({ error: "Failed to search cards" });
  }
});

/**
 * @swagger
 * /api/cards/random:
 *   get:
 *     summary: Get random MTG cards
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: ability
 *         required: false
 *         description: Filter by ability type
 *         schema:
 *           type: string
 *           example: "flying"
 *     responses:
 *       200:
 *         description: Random cards from Scryfall (max 10)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 has_more:
 *                   type: boolean
 *                 total_cards:
 *                   type: integer
 *       500:
 *         description: Failed to get random cards
 */
app.get("/api/cards/random", async (req, res) => {
  const { ability } = req.query;

  let query = "is:permanent";
  if (ability) {
    query += ` o:${ability}`;
  }

  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=random`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.json({ data: [], has_more: false, total_cards: 0 });
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data = await response.json();

    // Return only first 10 random cards
    const limitedData = {
      ...data,
      data: data.data ? data.data.slice(0, 10) : [],
    };

    res.json(limitedData);
  } catch (error) {
    console.error("Error getting random cards:", error);
    res.status(500).json({ error: "Failed to get random cards" });
  }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get a specific MTG card by Scryfall ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Scryfall card ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card details from Scryfall
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Card not found
 *       500:
 *         description: Failed to fetch card
 */
app.get("/api/cards/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`https://api.scryfall.com/cards/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Card not found" });
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});

// Favourites CRUD Operations

/**
 * @swagger
 * /api/favourites:
 *   post:
 *     summary: Add a card to user's favourites
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
 *                 description: ID of the user
 *               card_name:
 *                 type: string
 *                 description: Name of the MTG card
 *               scryfall_id:
 *                 type: string
 *                 description: Scryfall UUID for the card
 *               ability_type:
 *                 type: string
 *                 description: Type of ability or card category
 *               notes:
 *                 type: string
 *                 description: User's personal notes
 *     responses:
 *       201:
 *         description: Favourite added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favourite'
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Database error
 */
app.post("/api/favourites", async (req, res) => {
  const { user_id, card_name, scryfall_id, ability_type, notes } = req.body;

  if (!user_id || !card_name) {
    return res
      .status(400)
      .json({ error: "User ID and card name are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO favourites (user_id, card_name, scryfall_id, ability_type, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, card_name, scryfall_id, ability_type, notes],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding favourite:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /api/favourites/{userId}:
 *   get:
 *     summary: Get all favourites for a user
 *     tags: [Favourites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's favourite cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favourite'
 *       500:
 *         description: Database error
 */
app.get("/api/favourites/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const result = await pool.query(
      "SELECT * FROM favourites WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /api/favourites/{id}:
 *   put:
 *     summary: Update a favourite (mainly for notes)
 *     tags: [Favourites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Favourite ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Updated notes
 *               ability_type:
 *                 type: string
 *                 description: Updated ability type
 *     responses:
 *       200:
 *         description: Favourite updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favourite'
 *       404:
 *         description: Favourite not found
 *       500:
 *         description: Database error
 */
app.put("/api/favourites/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { notes, ability_type } = req.body;

  try {
    const result = await pool.query(
      "UPDATE favourites SET notes = $1, ability_type = $2 WHERE id = $3 RETURNING *",
      [notes, ability_type, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favourite not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating favourite:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /api/favourites/{id}:
 *   delete:
 *     summary: Remove a favourite
 *     tags: [Favourites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Favourite ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favourite removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Favourite removed"
 *                 deleted:
 *                   $ref: '#/components/schemas/Favourite'
 *       404:
 *         description: Favourite not found
 *       500:
 *         description: Database error
 */
app.delete("/api/favourites/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM favourites WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favourite not found" });
    }

    res.json({ message: "Favourite removed", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting favourite:", error);
    res.status(500).json({ error: "Database error" });
  }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }

  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Only start server if not being imported for testing
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API available at http://localhost:${PORT}/api/messages`);
  });
}

module.exports = app;

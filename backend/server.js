const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool, initTables } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database tables on startup
initTables();

// Routes

// Hello World endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hello World from Planeswalker's Primer Backend!",
    status: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// CRUD Operations for Messages

// CREATE - Add a new message
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

// READ - Get all messages
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

// READ - Get a specific message by ID
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

// UPDATE - Update a message by ID
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

// DELETE - Delete a message by ID
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

// CREATE - Add a new user
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

// READ - Get all users
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

// READ - Get a specific user by ID
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

// UPDATE - Update a user by ID
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

// DELETE - Delete a user by ID
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

// Search cards via Scryfall API
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

// Get random cards by ability type
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

// Get specific card by Scryfall ID
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

// Favorites CRUD Operations

// CREATE - Add a card to user's favorites
app.post("/api/favorites", async (req, res) => {
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
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// READ - Get all favorites for a user
app.get("/api/favorites/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const result = await pool.query(
      "SELECT * FROM favourites WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE - Update a favorite (mainly for notes)
app.put("/api/favorites/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { notes, ability_type } = req.body;

  try {
    const result = await pool.query(
      "UPDATE favourites SET notes = $1, ability_type = $2 WHERE id = $3 RETURNING *",
      [notes, ability_type, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating favorite:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE - Remove a favorite
app.delete("/api/favorites/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM favourites WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite removed", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/messages`);
});

module.exports = app;

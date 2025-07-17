const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for simple CRUD (will replace with database later)
let messages = [
  { id: 1, text: "Hello World!", timestamp: new Date().toISOString() },
  {
    id: 2,
    text: "Welcome to Plansewalker's Primer!",
    timestamp: new Date().toISOString(),
  },
];
let nextId = 3;

// Routes

// Hello World endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hello World from Plansewalker's Primer Backend!",
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
app.post("/api/messages", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const newMessage = {
    id: nextId++,
    text,
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// READ - Get all messages
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// READ - Get a specific message by ID
app.get("/api/messages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const message = messages.find((m) => m.id === id);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  res.json(message);
});

// UPDATE - Update a message by ID
app.put("/api/messages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const messageIndex = messages.findIndex((m) => m.id === id);

  if (messageIndex === -1) {
    return res.status(404).json({ error: "Message not found" });
  }

  messages[messageIndex] = {
    ...messages[messageIndex],
    text,
    timestamp: new Date().toISOString(),
  };

  res.json(messages[messageIndex]);
});

// DELETE - Delete a message by ID
app.delete("/api/messages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const messageIndex = messages.findIndex((m) => m.id === id);

  if (messageIndex === -1) {
    return res.status(404).json({ error: "Message not found" });
  }

  const deletedMessage = messages.splice(messageIndex, 1)[0];
  res.json({ message: "Message deleted", deleted: deletedMessage });
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

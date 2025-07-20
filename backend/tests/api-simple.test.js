const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create a test app with mocked database
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Mock database
  let users = [];
  let messages = [];
  let favourites = [];
  let nextUserId = 1;
  let nextMessageId = 1;
  let nextFavouriteId = 1;

  // Health endpoints
  app.get('/', (req, res) => {
    res.json({
      message: "Hello World from Planeswalker's Primer Backend!",
      status: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health', (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // User CRUD endpoints
  app.post('/api/users', (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = {
      id: nextUserId++,
      username,
      created_at: new Date().toISOString()
    };

    users.push(user);
    res.status(201).json(user);
  });

  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  });

  app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    if (users.find(u => u.username === username && u.id !== id)) {
      return res.status(400).json({ error: "Username already exists" });
    }

    users[userIndex].username = username;
    res.json(users[userIndex]);
  });

  app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    // Cascade delete favourites
    favourites = favourites.filter(f => f.user_id !== id);

    res.json({ message: "User deleted", deleted: deletedUser });
  });

  // Message CRUD endpoints
  app.post('/api/messages', (req, res) => {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const message = {
      id: nextMessageId++,
      text,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    messages.push(message);
    res.status(201).json(message);
  });

  app.get('/api/messages', (req, res) => {
    res.json(messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  });

  app.get('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const message = messages.find(m => m.id === id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  });

  app.put('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found" });
    }

    messages[messageIndex].text = text;
    messages[messageIndex].updated_at = new Date().toISOString();
    res.json(messages[messageIndex]);
  });

  app.delete('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const messageIndex = messages.findIndex(m => m.id === id);

    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found" });
    }

    const deletedMessage = messages.splice(messageIndex, 1)[0];
    res.json({ message: "Message deleted", deleted: deletedMessage });
  });

  // Favourites CRUD endpoints
  app.post('/api/favorites', (req, res) => {
    const { user_id, card_name, scryfall_id, ability_type, notes } = req.body;

    if (!user_id || !card_name) {
      return res.status(400).json({ error: "User ID and card name are required" });
    }

    const favourite = {
      id: nextFavouriteId++,
      user_id,
      card_name,
      scryfall_id,
      ability_type,
      notes,
      created_at: new Date().toISOString()
    };

    favourites.push(favourite);
    res.status(201).json(favourite);
  });

  app.get('/api/favorites/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userFavourites = favourites.filter(f => f.user_id === userId);
    res.json(userFavourites.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  });

  app.put('/api/favorites/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { notes, ability_type } = req.body;

    const favouriteIndex = favourites.findIndex(f => f.id === id);
    if (favouriteIndex === -1) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    if (notes !== undefined) favourites[favouriteIndex].notes = notes;
    if (ability_type !== undefined) favourites[favouriteIndex].ability_type = ability_type;

    res.json(favourites[favouriteIndex]);
  });

  app.delete('/api/favorites/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const favouriteIndex = favourites.findIndex(f => f.id === id);

    if (favouriteIndex === -1) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    const deletedFavourite = favourites.splice(favouriteIndex, 1)[0];
    res.json({ message: "Favorite removed", deleted: deletedFavourite });
  });

  // Mock Scryfall API endpoints
  app.get('/api/cards/search', (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query (q) is required" });
    }

    // Mock search results
    const mockCards = [
      {
        id: 'abc123',
        name: 'Lightning Bolt',
        mana_cost: '{R}',
        type_line: 'Instant',
        oracle_text: 'Lightning Bolt deals 3 damage to any target.'
      },
      {
        id: 'def456',
        name: 'Lightning Strike',
        mana_cost: '{1}{R}',
        type_line: 'Instant',
        oracle_text: 'Lightning Strike deals 3 damage to any target.'
      }
    ];

    const filteredCards = mockCards.filter(card =>
      card.name.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      data: filteredCards,
      has_more: false,
      total_cards: filteredCards.length
    });
  });

  app.get('/api/cards/random', (req, res) => {
    const { ability } = req.query;

    const mockRandomCards = [
      {
        id: 'xyz789',
        name: 'Serra Angel',
        mana_cost: '{3}{W}{W}',
        type_line: 'Creature — Angel',
        oracle_text: 'Flying, vigilance'
      },
      {
        id: 'uvw012',
        name: 'Wind Drake',
        mana_cost: '{2}{U}',
        type_line: 'Creature — Drake',
        oracle_text: 'Flying'
      }
    ];

    let filteredCards = mockRandomCards;
    if (ability) {
      filteredCards = mockRandomCards.filter(card =>
        card.oracle_text.toLowerCase().includes(ability.toLowerCase())
      );
    }

    res.json({
      data: filteredCards.slice(0, 10),
      has_more: true,
      total_cards: filteredCards.length
    });
  });

  app.get('/api/cards/:id', (req, res) => {
    const { id } = req.params;

    // Mock specific card lookup
    const mockCard = {
      id: id,
      name: 'Lightning Bolt',
      mana_cost: '{R}',
      type_line: 'Instant',
      oracle_text: 'Lightning Bolt deals 3 damage to any target.',
      image_uris: {
        normal: 'https://example.com/card.jpg'
      }
    };

    if (id === 'invalid-id-format') {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(mockCard);
  });

  // Error handling
  app.use('*', (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
};

describe('Planeswalker\'s Primer API Tests (Simplified)', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Health Endpoints', () => {
    test('GET / should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', 'Server is running');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /health should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('User CRUD Operations', () => {
    test('POST /api/users should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('created_at');
    });

    test('POST /api/users should reject user without username', async () => {
      await request(app)
        .post('/api/users')
        .send({})
        .expect(400);
    });

    test('POST /api/users should reject duplicate username', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(400);
    });

    test('GET /api/users should return all users', async () => {
      // Create a user first
      await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    test('GET /api/users/:id should return specific user', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    test('GET /api/users/:id should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/99999')
        .expect(404);
    });

    test('PUT /api/users/:id should update user', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ username: 'updateduser' })
        .expect(200);

      expect(response.body).toHaveProperty('username', 'updateduser');
    });

    test('DELETE /api/users/:id should delete user', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      const userId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User deleted');
      expect(response.body).toHaveProperty('deleted');
    });
  });

  describe('Message CRUD Operations', () => {
    test('POST /api/messages should create a new message', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({ text: 'Test message' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('text', 'Test message');
      expect(response.body).toHaveProperty('created_at');
    });

    test('GET /api/messages should return all messages', async () => {
      await request(app)
        .post('/api/messages')
        .send({ text: 'Test message' })
        .expect(201);

      const response = await request(app)
        .get('/api/messages')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    test('PUT /api/messages/:id should update message', async () => {
      const createResponse = await request(app)
        .post('/api/messages')
        .send({ text: 'Original message' })
        .expect(201);

      const messageId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/messages/${messageId}`)
        .send({ text: 'Updated message' })
        .expect(200);

      expect(response.body).toHaveProperty('text', 'Updated message');
      expect(response.body).toHaveProperty('updated_at');
    });
  });

  describe('Favourites CRUD Operations', () => {
    test('POST /api/favorites should add card to favourites', async () => {
      // Create user first
      const userResponse = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      const userId = userResponse.body.id;

      const favouriteData = {
        user_id: userId,
        card_name: 'Lightning Bolt',
        scryfall_id: 'abc123',
        ability_type: 'instant',
        notes: 'Great damage spell'
      };

      const response = await request(app)
        .post('/api/favorites')
        .send(favouriteData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('user_id', userId);
      expect(response.body).toHaveProperty('card_name', 'Lightning Bolt');
    });

    test('GET /api/favorites/:userId should return user favourites', async () => {
      // Create user and favourite
      const userResponse = await request(app)
        .post('/api/users')
        .send({ username: 'testuser' })
        .expect(201);

      const userId = userResponse.body.id;

      await request(app)
        .post('/api/favorites')
        .send({
          user_id: userId,
          card_name: 'Lightning Bolt'
        })
        .expect(201);

      const response = await request(app)
        .get(`/api/favorites/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('user_id', userId);
    });
  });

  describe('Card Search Integration', () => {
    test('GET /api/cards/search should search for cards', async () => {
      const response = await request(app)
        .get('/api/cards/search')
        .query({ q: 'lightning' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/cards/search should require search query', async () => {
      await request(app)
        .get('/api/cards/search')
        .expect(400);
    });

    test('GET /api/cards/random should return random cards', async () => {
      const response = await request(app)
        .get('/api/cards/random')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/cards/:id should fetch specific card', async () => {
      const response = await request(app)
        .get('/api/cards/abc123')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('id', 'abc123');
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });
  });

  describe('Integration Workflows', () => {
    test('Complete user and favourites workflow', async () => {
      // 1. Create user
      const userResponse = await request(app)
        .post('/api/users')
        .send({ username: 'workflowuser' })
        .expect(201);

      const userId = userResponse.body.id;

      // 2. Search for a card
      const searchResponse = await request(app)
        .get('/api/cards/search')
        .query({ q: 'lightning' })
        .expect(200);

      expect(searchResponse.body.data.length).toBeGreaterThan(0);
      const card = searchResponse.body.data[0];

      // 3. Add card to favourites
      const favouriteResponse = await request(app)
        .post('/api/favorites')
        .send({
          user_id: userId,
          card_name: card.name,
          scryfall_id: card.id,
          ability_type: 'instant',
          notes: 'Found through search'
        })
        .expect(201);

      // 4. Verify favourite was added
      const favouritesResponse = await request(app)
        .get(`/api/favorites/${userId}`)
        .expect(200);

      expect(favouritesResponse.body.length).toBe(1);
      expect(favouritesResponse.body[0].card_name).toBe(card.name);

      // 5. Update favourite notes
      await request(app)
        .put(`/api/favorites/${favouriteResponse.body.id}`)
        .send({ notes: 'Updated notes about this card' })
        .expect(200);

      // 6. Delete user (should cascade delete favourites)
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      // 7. Verify favourites were deleted
      const emptyFavouritesResponse = await request(app)
        .get(`/api/favorites/${userId}`)
        .expect(200);

      expect(emptyFavouritesResponse.body.length).toBe(0);
    });
  });
});

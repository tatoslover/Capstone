const request = require("supertest");
const app = require("../server");

describe("Planeswalker's Primer API Tests", () => {
  let testUserId;
  let testMessageId;
  let testFavouriteId;

  // Test data
  const testUser = {
    username: "testuser_" + Date.now(),
  };

  const testMessage = {
    text: "Test message for API testing",
  };

  const testFavourite = {
    card_name: "Lightning Bolt",
    scryfall_id: "e3285e6b-3e79-4d7c-bf96-d920f973b122",
    ability_type: "instant",
    notes: "Classic red damage spell",
  };

  describe("Health Endpoints", () => {
    test("GET / should return welcome message", async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("status", "Server is running");
      expect(response.body).toHaveProperty("timestamp");
    });

    test("GET /health should return OK status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("User CRUD Operations", () => {
    test("POST /api/users should create a new user", async () => {
      const response = await request(app)
        .post("/api/users")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username", testUser.username);
      expect(response.body).toHaveProperty("created_at");

      testUserId = response.body.id;
    });

    test("POST /api/users should reject user without username", async () => {
      await request(app).post("/api/users").send({}).expect(400);
    });

    test("POST /api/users should reject duplicate username", async () => {
      await request(app).post("/api/users").send(testUser).expect(400);
    });

    test("GET /api/users should return all users", async () => {
      const response = await request(app).get("/api/users").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("GET /api/users/:id should return specific user", async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", testUserId);
      expect(response.body).toHaveProperty("username", testUser.username);
    });

    test("GET /api/users/:id should return 404 for non-existent user", async () => {
      await request(app).get("/api/users/99999").expect(404);
    });

    test("PUT /api/users/:id should update user", async () => {
      const updatedUsername = "updated_" + testUser.username;

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send({ username: updatedUsername })
        .expect(200);

      expect(response.body).toHaveProperty("username", updatedUsername);
    });

    test("PUT /api/users/:id should reject update without username", async () => {
      await request(app).put(`/api/users/${testUserId}`).send({}).expect(400);
    });
  });

  describe("Message CRUD Operations", () => {
    test("POST /api/messages should create a new message", async () => {
      const response = await request(app)
        .post("/api/messages")
        .send(testMessage)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("text", testMessage.text);
      expect(response.body).toHaveProperty("created_at");

      testMessageId = response.body.id;
    });

    test("POST /api/messages should reject message without text", async () => {
      await request(app).post("/api/messages").send({}).expect(400);
    });

    test("GET /api/messages should return all messages", async () => {
      const response = await request(app).get("/api/messages").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("GET /api/messages/:id should return specific message", async () => {
      const response = await request(app)
        .get(`/api/messages/${testMessageId}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", testMessageId);
      expect(response.body).toHaveProperty("text", testMessage.text);
    });

    test("GET /api/messages/:id should return 404 for non-existent message", async () => {
      await request(app).get("/api/messages/99999").expect(404);
    });

    test("PUT /api/messages/:id should update message", async () => {
      const updatedText = "Updated message text";

      const response = await request(app)
        .put(`/api/messages/${testMessageId}`)
        .send({ text: updatedText })
        .expect(200);

      expect(response.body).toHaveProperty("text", updatedText);
      expect(response.body).toHaveProperty("updated_at");
    });

    test("PUT /api/messages/:id should reject update without text", async () => {
      await request(app)
        .put(`/api/messages/${testMessageId}`)
        .send({})
        .expect(400);
    });
  });

  describe("Favourites CRUD Operations", () => {
    test("POST /api/favourites should add card to favourites", async () => {
      const favouriteData = {
        ...testFavourite,
        user_id: testUserId,
      };

      const response = await request(app)
        .post("/api/favourites")
        .send(favouriteData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("user_id", testUserId);
      expect(response.body).toHaveProperty(
        "card_name",
        testFavourite.card_name,
      );
      expect(response.body).toHaveProperty(
        "scryfall_id",
        testFavourite.scryfall_id,
      );
      expect(response.body).toHaveProperty(
        "ability_type",
        testFavourite.ability_type,
      );
      expect(response.body).toHaveProperty("notes", testFavourite.notes);

      testFavouriteId = response.body.id;
    });

    test("POST /api/favourites should reject favourite without required fields", async () => {
      await request(app)
        .post("/api/favourites")
        .send({ user_id: testUserId })
        .expect(400);

      await request(app)
        .post("/api/favourites")
        .send({ card_name: "Test Card" })
        .expect(400);
    });

    test("GET /api/favourites/:userId should return user favourites", async () => {
      const response = await request(app)
        .get(`/api/favourites/${testUserId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("user_id", testUserId);
    });

    test("PUT /api/favourites/:id should update favourite notes", async () => {
      const updatedNotes = "Updated notes about this powerful spell";

      const response = await request(app)
        .put(`/api/favourites/${testFavouriteId}`)
        .send({
          notes: updatedNotes,
          ability_type: "damage_spell",
        })
        .expect(200);

      expect(response.body).toHaveProperty("notes", updatedNotes);
      expect(response.body).toHaveProperty("ability_type", "damage_spell");
    });

    test("PUT /api/favourites/:id should return 404 for non-existent favourite", async () => {
      await request(app)
        .put("/api/favourites/99999")
        .send({ notes: "Test notes" })
        .expect(404);
    });
  });

  describe("Card Search Integration", () => {
    test("GET /api/cards/search should search for cards", async () => {
      const response = await request(app)
        .get("/api/cards/search")
        .query({ q: "lightning bolt" })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/cards/search should require search query", async () => {
      await request(app).get("/api/cards/search").expect(400);
    });

    test("GET /api/cards/random should return random cards", async () => {
      const response = await request(app).get("/api/cards/random").expect(200);

      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/cards/random should filter by ability", async () => {
      const response = await request(app)
        .get("/api/cards/random")
        .query({ ability: "flying" })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("GET /api/cards/:id should fetch specific card", async () => {
      // Use a known Scryfall ID for Lightning Bolt
      const lightningBoltId = "e3285e6b-3e79-4d7c-bf96-d920f973b122";

      const response = await request(app)
        .get(`/api/cards/${lightningBoltId}`)
        .expect(200);

      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("id", lightningBoltId);
    });
  });

  describe("Error Handling", () => {
    test("Should return 404 for non-existent routes", async () => {
      await request(app).get("/api/nonexistent").expect(404);
    });

    test("Should handle malformed JSON gracefully", async () => {
      await request(app)
        .post("/api/users")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);
    });
  });

  // Cleanup tests - run last
  describe("Cleanup Operations", () => {
    test("DELETE /api/favourites/:id should remove favourite", async () => {
      const response = await request(app)
        .delete(`/api/favourites/${testFavouriteId}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Favourite removed");
      expect(response.body).toHaveProperty("deleted");
    });

    test("DELETE /api/messages/:id should delete message", async () => {
      const response = await request(app)
        .delete(`/api/messages/${testMessageId}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Message deleted");
      expect(response.body).toHaveProperty("deleted");
    });

    test("DELETE /api/users/:id should delete user", async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "User deleted");
      expect(response.body).toHaveProperty("deleted");
    });

    test("DELETE operations should return 404 for non-existent resources", async () => {
      await request(app).delete("/api/users/99999").expect(404);

      await request(app).delete("/api/messages/99999").expect(404);

      await request(app).delete("/api/favourites/99999").expect(404);
    });
  });
});

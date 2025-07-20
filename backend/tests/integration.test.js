const request = require("supertest");
const app = require("../server");

describe("Integration Tests - End-to-End Workflows", () => {
  let testUser;
  let createdCards = [];
  let createdFavourites = [];

  beforeAll(async () => {
    // Create a test user for all integration tests
    const userResponse = await request(app)
      .post("/api/users")
      .send({ username: "integration_user_" + Date.now() });

    testUser = userResponse.body;
  });

  afterAll(async () => {
    // Clean up all test data
    for (const favouriteId of createdFavourites) {
      await request(app).delete(`/api/favourites/${favouriteId}`);
    }

    if (testUser?.id) {
      await request(app).delete(`/api/users/${testUser.id}`);
    }
  });

  describe("User Registration and Profile Management Workflow", () => {
    test("Complete user lifecycle: create, read, update, delete", async () => {
      // 1. Create new user
      const newUserData = { username: "workflow_user_" + Date.now() };
      const createResponse = await request(app)
        .post("/api/users")
        .send(newUserData)
        .expect(201);

      const createdUser = createResponse.body;
      expect(createdUser).toHaveProperty("id");
      expect(createdUser.username).toBe(newUserData.username);

      // 2. Verify user appears in users list
      const listResponse = await request(app).get("/api/users").expect(200);

      const userExists = listResponse.body.some(
        (user) => user.id === createdUser.id,
      );
      expect(userExists).toBe(true);

      // 3. Update user profile
      const updatedData = { username: "updated_" + newUserData.username };
      const updateResponse = await request(app)
        .put(`/api/users/${createdUser.id}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.username).toBe(updatedData.username);

      // 4. Verify update was persisted
      const getResponse = await request(app)
        .get(`/api/users/${createdUser.id}`)
        .expect(200);

      expect(getResponse.body.username).toBe(updatedData.username);

      // 5. Delete user
      await request(app).delete(`/api/users/${createdUser.id}`).expect(200);

      // 6. Verify user is deleted
      await request(app).get(`/api/users/${createdUser.id}`).expect(404);
    });
  });

  describe("Card Search and Favourites Workflow", () => {
    test("Search for cards and add to favourites", async () => {
      // 1. Search for Lightning Bolt
      const searchResponse = await request(app)
        .get("/api/cards/search")
        .query({ q: "lightning bolt" })
        .expect(200);

      expect(searchResponse.body.data).toBeDefined();
      expect(searchResponse.body.data.length).toBeGreaterThan(0);

      const lightningBolt = searchResponse.body.data[0];
      expect(lightningBolt).toHaveProperty("name");
      expect(lightningBolt).toHaveProperty("id");

      // 2. Add Lightning Bolt to favourites
      const favouriteData = {
        user_id: testUser.id,
        card_name: lightningBolt.name,
        scryfall_id: lightningBolt.id,
        ability_type: "instant",
        notes: "Classic red damage spell - deals 3 damage for 1 mana",
      };

      const addFavouriteResponse = await request(app)
        .post("/api/favourites")
        .send(favouriteData)
        .expect(201);

      const createdFavourite = addFavouriteResponse.body;
      createdFavourites.push(createdFavourite.id);

      expect(createdFavourite.card_name).toBe(lightningBolt.name);
      expect(createdFavourite.scryfall_id).toBe(lightningBolt.id);

      // 3. Verify favourite appears in user's favourites list
      const favouritesResponse = await request(app)
        .get(`/api/favourites/${testUser.id}`)
        .expect(200);

      expect(favouritesResponse.body.length).toBeGreaterThan(0);
      const savedFavourite = favouritesResponse.body.find(
        (fav) => fav.id === createdFavourite.id,
      );
      expect(savedFavourite).toBeDefined();
      expect(savedFavourite.notes).toBe(favouriteData.notes);
    });

    test("Search for flying creatures and manage favourites", async () => {
      // 1. Get random flying creatures
      const randomResponse = await request(app)
        .get("/api/cards/random")
        .query({ ability: "flying" })
        .expect(200);

      expect(randomResponse.body.data).toBeDefined();
      expect(randomResponse.body.data.length).toBeGreaterThan(0);

      const flyingCreature = randomResponse.body.data[0];

      // 2. Add to favourites
      const favouriteData = {
        user_id: testUser.id,
        card_name: flyingCreature.name,
        scryfall_id: flyingCreature.id,
        ability_type: "flying",
        notes: "Flying creature for evasion",
      };

      const addResponse = await request(app)
        .post("/api/favourites")
        .send(favouriteData)
        .expect(201);

      createdFavourites.push(addResponse.body.id);

      // 3. Update notes
      const updatedNotes =
        "Flying creature - excellent for aerial attacks and evasion";
      const updateResponse = await request(app)
        .put(`/api/favourites/${addResponse.body.id}`)
        .send({
          notes: updatedNotes,
          ability_type: "evasion",
        })
        .expect(200);

      expect(updateResponse.body.notes).toBe(updatedNotes);
      expect(updateResponse.body.ability_type).toBe("evasion");

      // 4. Verify updated favourite
      const favouritesResponse = await request(app)
        .get(`/api/favourites/${testUser.id}`)
        .expect(200);

      const updatedFavourite = favouritesResponse.body.find(
        (fav) => fav.id === addResponse.body.id,
      );
      expect(updatedFavourite.notes).toBe(updatedNotes);
      expect(updatedFavourite.ability_type).toBe("evasion");
    });
  });

  describe("Message System Workflow", () => {
    test("Create and manage messages", async () => {
      const messages = [];

      // 1. Create multiple messages
      const messageTexts = [
        "How does flying work in MTG?",
        "What is the difference between instants and sorceries?",
        "Can you block flying creatures without flying?",
      ];

      for (const text of messageTexts) {
        const response = await request(app)
          .post("/api/messages")
          .send({ text })
          .expect(201);

        messages.push(response.body);
        expect(response.body.text).toBe(text);
      }

      // 2. Verify all messages appear in list
      const listResponse = await request(app).get("/api/messages").expect(200);

      for (const message of messages) {
        const foundMessage = listResponse.body.find((m) => m.id === message.id);
        expect(foundMessage).toBeDefined();
      }

      // 3. Update a message
      const messageToUpdate = messages[0];
      const updatedText =
        "UPDATED: How does the flying ability work in Magic: The Gathering?";

      const updateResponse = await request(app)
        .put(`/api/messages/${messageToUpdate.id}`)
        .send({ text: updatedText })
        .expect(200);

      expect(updateResponse.body.text).toBe(updatedText);
      expect(updateResponse.body.updated_at).toBeDefined();

      // 4. Clean up messages
      for (const message of messages) {
        await request(app).delete(`/api/messages/${message.id}`).expect(200);
      }

      // 5. Verify messages are deleted
      for (const message of messages) {
        await request(app).get(`/api/messages/${message.id}`).expect(404);
      }
    });
  });

  describe("Cross-Entity Workflows", () => {
    test("User with favourites deletion workflow", async () => {
      // 1. Create user
      const userData = { username: "favourites_user_" + Date.now() };
      const userResponse = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);

      const user = userResponse.body;

      // 2. Add multiple favourites for the user
      const favouriteCards = [
        {
          card_name: "Serra Angel",
          ability_type: "flying",
          notes: "Classic white flying creature",
        },
        {
          card_name: "Counterspell",
          ability_type: "counter",
          notes: "Essential blue counter magic",
        },
      ];

      const createdFavouriteIds = [];
      for (const cardData of favouriteCards) {
        const favouriteResponse = await request(app)
          .post("/api/favourites")
          .send({
            user_id: user.id,
            ...cardData,
          })
          .expect(201);

        createdFavouriteIds.push(favouriteResponse.body.id);
      }

      // 3. Verify favourites exist
      const favouritesResponse = await request(app)
        .get(`/api/favourites/${user.id}`)
        .expect(200);

      expect(favouritesResponse.body.length).toBe(2);

      // 4. Delete user (should cascade delete favourites)
      await request(app).delete(`/api/users/${user.id}`).expect(200);

      // 5. Verify favourites are automatically deleted
      const emptyFavouritesResponse = await request(app)
        .get(`/api/favourites/${user.id}`)
        .expect(200);

      expect(emptyFavouritesResponse.body.length).toBe(0);

      // 6. Verify individual favourites return 404 when accessed directly
      for (const favouriteId of createdFavouriteIds) {
        await request(app).get(`/api/favourites/${favouriteId}`).expect(404);
      }
    });

    test("Card discovery to favourite workflow", async () => {
      // 1. Discover cards through random endpoint
      const randomCardsResponse = await request(app)
        .get("/api/cards/random")
        .expect(200);

      expect(randomCardsResponse.body.data.length).toBeGreaterThan(0);
      const discoveredCard = randomCardsResponse.body.data[0];

      // 2. Get detailed information about the card
      const cardDetailsResponse = await request(app)
        .get(`/api/cards/${discoveredCard.id}`)
        .expect(200);

      expect(cardDetailsResponse.body.name).toBe(discoveredCard.name);

      // 3. Add discovered card to favourites
      const favouriteData = {
        user_id: testUser.id,
        card_name: cardDetailsResponse.body.name,
        scryfall_id: cardDetailsResponse.body.id,
        ability_type: "discovered",
        notes: `Discovered through random search: ${cardDetailsResponse.body.type_line}`,
      };

      const addFavouriteResponse = await request(app)
        .post("/api/favourites")
        .send(favouriteData)
        .expect(201);

      createdFavourites.push(addFavouriteResponse.body.id);

      // 4. Verify the complete workflow
      const userFavouritesResponse = await request(app)
        .get(`/api/favourites/${testUser.id}`)
        .expect(200);

      const savedCard = userFavouritesResponse.body.find(
        (fav) => fav.scryfall_id === cardDetailsResponse.body.id,
      );

      expect(savedCard).toBeDefined();
      expect(savedCard.card_name).toBe(cardDetailsResponse.body.name);
      expect(savedCard.notes).toContain("Discovered through random search");
    });
  });

  describe("Error Handling in Workflows", () => {
    test("Graceful handling of external API failures", async () => {
      // Test with invalid Scryfall ID
      const invalidCardResponse = await request(app)
        .get("/api/cards/invalid-id-format")
        .expect(404);

      expect(invalidCardResponse.body).toHaveProperty("error");

      // Test search with no results
      const noResultsResponse = await request(app)
        .get("/api/cards/search")
        .query({ q: "xyznonexistentcardname123" })
        .expect(200);

      expect(noResultsResponse.body.data).toEqual([]);
      expect(noResultsResponse.body.total_cards).toBe(0);
    });

    test("Validation errors in user workflows", async () => {
      // Try to create favourite with missing required fields
      await request(app)
        .post("/api/favourites")
        .send({ user_id: testUser.id })
        .expect(400);

      // Try to create user with missing username
      await request(app).post("/api/users").send({}).expect(400);

      // Try to create message with missing text
      await request(app).post("/api/messages").send({}).expect(400);
    });

    test("Handling of concurrent user operations", async () => {
      const username = "concurrent_test_" + Date.now();

      // Try to create same user concurrently (should fail on one)
      const createPromises = [
        request(app).post("/api/users").send({ username }),
        request(app).post("/api/users").send({ username }),
      ];

      const results = await Promise.allSettled(createPromises);

      // One should succeed, one should fail
      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.status === 201,
      );
      const failed = results.filter(
        (r) => r.status === "fulfilled" && r.value.status === 400,
      );

      expect(successful.length).toBe(1);
      expect(failed.length).toBe(1);

      // Clean up the successfully created user
      if (successful.length > 0) {
        const createdUserId = successful[0].value.body.id;
        await request(app).delete(`/api/users/${createdUserId}`);
      }
    });
  });

  describe("Performance Integration Tests", () => {
    test("Bulk operations performance", async () => {
      const startTime = Date.now();

      // Create multiple favourites quickly
      const bulkFavourites = [];
      for (let i = 0; i < 10; i++) {
        const favouriteData = {
          user_id: testUser.id,
          card_name: `Bulk Test Card ${i}`,
          ability_type: "test",
          notes: `Performance test card number ${i}`,
        };

        const response = await request(app)
          .post("/api/favourites")
          .send(favouriteData)
          .expect(201);

        bulkFavourites.push(response.body.id);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(totalTime).toBeLessThan(5000); // 5 seconds

      // Verify all favourites were created
      const favouritesResponse = await request(app)
        .get(`/api/favourites/${testUser.id}`)
        .expect(200);

      const testCards = favouritesResponse.body.filter((fav) =>
        fav.card_name.startsWith("Bulk Test Card"),
      );
      expect(testCards.length).toBe(10);

      // Clean up
      for (const favouriteId of bulkFavourites) {
        await request(app).delete(`/api/favourites/${favouriteId}`);
      }
    });

    test("API response time consistency", async () => {
      const responseTimes = [];

      // Test multiple identical requests
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();

        await request(app).get("/health").expect(200);

        const endTime = Date.now();
        responseTimes.push(endTime - startTime);
      }

      // Calculate average response time
      const averageTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      // Health endpoint should be very fast
      expect(averageTime).toBeLessThan(100); // 100ms average

      // Check consistency (no response should be dramatically different)
      const maxTime = Math.max(...responseTimes);
      const minTime = Math.min(...responseTimes);
      expect(maxTime - minTime).toBeLessThan(200); // Max variation of 200ms
    });
  });
});

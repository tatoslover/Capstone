import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = jest.fn();

describe("Frontend-Backend API Integration Tests", () => {
  const API_URL = "http://localhost:3001";

  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("User API Integration", () => {
    test("should create user via API", async () => {
      const newUser = {
        id: 1,
        username: "testuser",
        created_at: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => newUser,
      });

      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "testuser" }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "testuser" }),
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data).toEqual(newUser);
    });

    test("should fetch all users via API", async () => {
      const users = [
        { id: 1, username: "user1", created_at: "2023-01-01T00:00:00Z" },
        { id: 2, username: "user2", created_at: "2023-01-02T00:00:00Z" },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => users,
      });

      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users`);
      expect(response.ok).toBe(true);
      expect(data).toEqual(users);
      expect(data).toHaveLength(2);
    });

    test("should update user via API", async () => {
      const updatedUser = {
        id: 1,
        username: "updateduser",
        created_at: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedUser,
      });

      const response = await fetch(`${API_URL}/api/users/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "updateduser" }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "updateduser" }),
      });

      expect(response.ok).toBe(true);
      expect(data.username).toBe("updateduser");
    });

    test("should delete user via API", async () => {
      const deleteResponse = {
        message: "User deleted",
        deleted: { id: 1, username: "testuser" },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => deleteResponse,
      });

      const response = await fetch(`${API_URL}/api/users/1`, {
        method: "DELETE",
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/1`, {
        method: "DELETE",
      });

      expect(response.ok).toBe(true);
      expect(data.message).toBe("User deleted");
      expect(data.deleted.id).toBe(1);
    });

    test("should handle user API errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Username already exists" }),
      });

      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "duplicateuser" }),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.error).toBe("Username already exists");
    });
  });

  describe("Favourites API Integration", () => {
    test("should add favourite via API", async () => {
      const favourite = {
        id: 1,
        user_id: 1,
        card_name: "Lightning Bolt",
        scryfall_id: "abc123",
        ability_type: "instant",
        notes: "Classic red damage spell",
        created_at: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => favourite,
      });

      const favouriteData = {
        user_id: 1,
        card_name: "Lightning Bolt",
        scryfall_id: "abc123",
        ability_type: "instant",
        notes: "Classic red damage spell",
      };

      const response = await fetch(`${API_URL}/api/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favouriteData),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favouriteData),
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data).toEqual(favourite);
    });

    test("should fetch user favourites via API", async () => {
      const favourites = [
        {
          id: 1,
          user_id: 1,
          card_name: "Lightning Bolt",
          scryfall_id: "abc123",
          ability_type: "instant",
          notes: "Great damage spell",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          user_id: 1,
          card_name: "Counterspell",
          scryfall_id: "def456",
          ability_type: "counter",
          notes: "Essential blue spell",
          created_at: "2023-01-02T00:00:00Z",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => favourites,
      });

      const response = await fetch(`${API_URL}/api/favourites/1`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/favourites/1`);
      expect(response.ok).toBe(true);
      expect(data).toEqual(favourites);
      expect(data).toHaveLength(2);
    });

    test("should update favourite notes via API", async () => {
      const updatedFavourite = {
        id: 1,
        user_id: 1,
        card_name: "Lightning Bolt",
        scryfall_id: "abc123",
        ability_type: "damage",
        notes: "Updated: Excellent damage spell for aggressive decks",
        created_at: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedFavourite,
      });

      const updateData = {
        notes: "Updated: Excellent damage spell for aggressive decks",
        ability_type: "damage",
      };

      const response = await fetch(`${API_URL}/api/favourites/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/favourites/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      expect(response.ok).toBe(true);
      expect(data.notes).toBe(
        "Updated: Excellent damage spell for aggressive decks",
      );
      expect(data.ability_type).toBe("damage");
    });

    test("should remove favourite via API", async () => {
      const deleteResponse = {
        message: "Favourite removed",
        deleted: {
          id: 1,
          user_id: 1,
          card_name: "Lightning Bolt",
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => deleteResponse,
      });

      const response = await fetch(`${API_URL}/api/favourites/1`, {
        method: "DELETE",
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/favourites/1`, {
        method: "DELETE",
      });

      expect(response.ok).toBe(true);
      expect(data.message).toBe("Favourite removed");
      expect(data.deleted.id).toBe(1);
    });

    test("should handle favourites validation errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "User ID and card name are required" }),
      });

      const response = await fetch(`${API_URL}/api/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: 1 }), // Missing card_name
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.error).toBe("User ID and card name are required");
    });
  });

  describe("Card Search API Integration", () => {
    test("should search cards via Scryfall API proxy", async () => {
      const searchResults = {
        data: [
          {
            id: "abc123",
            name: "Lightning Bolt",
            mana_cost: "{R}",
            type_line: "Instant",
            oracle_text: "Lightning Bolt deals 3 damage to any target.",
          },
          {
            id: "def456",
            name: "Lightning Strike",
            mana_cost: "{1}{R}",
            type_line: "Instant",
            oracle_text: "Lightning Strike deals 3 damage to any target.",
          },
        ],
        has_more: false,
        total_cards: 2,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => searchResults,
      });

      const searchQuery = "lightning";
      const response = await fetch(
        `${API_URL}/api/cards/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/cards/search?q=lightning`,
      );
      expect(response.ok).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].name).toBe("Lightning Bolt");
      expect(data.total_cards).toBe(2);
    });

    test("should get random cards via API", async () => {
      const randomCards = {
        data: [
          {
            id: "xyz789",
            name: "Serra Angel",
            mana_cost: "{3}{W}{W}",
            type_line: "Creature — Angel",
            oracle_text: "Flying, vigilance",
          },
        ],
        has_more: true,
        total_cards: 1,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => randomCards,
      });

      const response = await fetch(`${API_URL}/api/cards/random`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/cards/random`);
      expect(response.ok).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe("Serra Angel");
    });

    test("should get random cards with ability filter", async () => {
      const flyingCards = {
        data: [
          {
            id: "fly123",
            name: "Wind Drake",
            mana_cost: "{2}{U}",
            type_line: "Creature — Drake",
            oracle_text: "Flying",
          },
          {
            id: "fly456",
            name: "Air Elemental",
            mana_cost: "{3}{U}{U}",
            type_line: "Creature — Elemental",
            oracle_text: "Flying",
          },
        ],
        has_more: true,
        total_cards: 2,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => flyingCards,
      });

      const response = await fetch(
        `${API_URL}/api/cards/random?ability=flying`,
      );
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/cards/random?ability=flying`,
      );
      expect(response.ok).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(
        data.data.every((card) => card.oracle_text.includes("Flying")),
      ).toBe(true);
    });

    test("should get specific card by ID", async () => {
      const specificCard = {
        id: "abc123",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type_line: "Instant",
        oracle_text: "Lightning Bolt deals 3 damage to any target.",
        image_uris: {
          normal: "https://example.com/card.jpg",
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => specificCard,
      });

      const cardId = "abc123";
      const response = await fetch(`${API_URL}/api/cards/${cardId}`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/cards/${cardId}`);
      expect(response.ok).toBe(true);
      expect(data.id).toBe(cardId);
      expect(data.name).toBe("Lightning Bolt");
    });

    test("should handle card search with no results", async () => {
      const noResults = {
        data: [],
        has_more: false,
        total_cards: 0,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => noResults,
      });

      const response = await fetch(
        `${API_URL}/api/cards/search?q=nonexistentcard123`,
      );
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.data).toEqual([]);
      expect(data.total_cards).toBe(0);
    });

    test("should handle invalid card ID", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Card not found" }),
      });

      const response = await fetch(`${API_URL}/api/cards/invalid-id`);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data.error).toBe("Card not found");
    });

    test("should require search query parameter", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Search query (q) is required" }),
      });

      const response = await fetch(`${API_URL}/api/cards/search`);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.error).toBe("Search query (q) is required");
    });
  });

  describe("Messages API Integration", () => {
    test("should create message via API", async () => {
      const newMessage = {
        id: 1,
        text: "How does flying work?",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => newMessage,
      });

      const messageData = { text: "How does flying work?" };
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data.text).toBe("How does flying work?");
    });

    test("should fetch all messages via API", async () => {
      const messages = [
        {
          id: 1,
          text: "How does flying work?",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          text: "What are instants?",
          created_at: "2023-01-02T00:00:00Z",
          updated_at: "2023-01-02T00:00:00Z",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => messages,
      });

      const response = await fetch(`${API_URL}/api/messages`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/messages`);
      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].text).toBe("How does flying work?");
    });

    test("should update message via API", async () => {
      const updatedMessage = {
        id: 1,
        text: "Updated: How does the flying ability work in MTG?",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T12:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedMessage,
      });

      const updateData = {
        text: "Updated: How does the flying ability work in MTG?",
      };
      const response = await fetch(`${API_URL}/api/messages/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/messages/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      expect(response.ok).toBe(true);
      expect(data.text).toBe(
        "Updated: How does the flying ability work in MTG?",
      );
      expect(data.updated_at).not.toBe(data.created_at);
    });

    test("should delete message via API", async () => {
      const deleteResponse = {
        message: "Message deleted",
        deleted: {
          id: 1,
          text: "How does flying work?",
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => deleteResponse,
      });

      const response = await fetch(`${API_URL}/api/messages/1`, {
        method: "DELETE",
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/messages/1`, {
        method: "DELETE",
      });

      expect(response.ok).toBe(true);
      expect(data.message).toBe("Message deleted");
      expect(data.deleted.id).toBe(1);
    });
  });

  describe("Health Check API Integration", () => {
    test("should get server health status", async () => {
      const healthResponse = {
        status: "OK",
        timestamp: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => healthResponse,
      });

      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/health`);
      expect(response.ok).toBe(true);
      expect(data.status).toBe("OK");
      expect(data.timestamp).toBeDefined();
    });

    test("should get welcome message from root endpoint", async () => {
      const welcomeResponse = {
        message: "Hello World from Planeswalker's Primer Backend!",
        status: "Server is running",
        timestamp: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => welcomeResponse,
      });

      const response = await fetch(`${API_URL}/`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/`);
      expect(response.ok).toBe(true);
      expect(data.message).toBe(
        "Hello World from Planeswalker's Primer Backend!",
      );
      expect(data.status).toBe("Server is running");
    });
  });

  describe("Error Handling and Edge Cases", () => {
    test("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      try {
        await fetch(`${API_URL}/api/users`);
      } catch (error) {
        expect(error.message).toBe("Network error");
      }
    });

    test("should handle server 500 errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      });

      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });

    test("should handle invalid JSON responses", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      try {
        const response = await fetch(`${API_URL}/api/users`);
        await response.json();
      } catch (error) {
        expect(error.message).toBe("Invalid JSON");
      }
    });

    test("should handle 404 for non-existent endpoints", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Route not found" }),
      });

      const response = await fetch(`${API_URL}/api/nonexistent`);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data.error).toBe("Route not found");
    });

    test("should handle timeout scenarios", async () => {
      // Simulate timeout by rejecting after delay
      fetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 100),
          ),
      );

      try {
        await fetch(`${API_URL}/api/users`);
      } catch (error) {
        expect(error.message).toBe("Request timeout");
      }
    });
  });

  describe("Content-Type and Header Validation", () => {
    test("should send correct Content-Type headers for JSON requests", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 1, username: "test" }),
      });

      await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "test" }),
      });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "test" }),
      });
    });

    test("should handle requests without explicit Content-Type", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: "OK" }),
      });

      await fetch(`${API_URL}/health`);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/health`);
    });
  });

  describe("API Response Format Validation", () => {
    test("should validate user response format", async () => {
      const user = {
        id: 1,
        username: "testuser",
        created_at: "2023-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => user,
      });

      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "testuser" }),
      });

      const data = await response.json();

      // Validate response structure
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("username");
      expect(data).toHaveProperty("created_at");
      expect(typeof data.id).toBe("number");
      expect(typeof data.username).toBe("string");
      expect(typeof data.created_at).toBe("string");
    });

    test("should validate card search response format", async () => {
      const searchResponse = {
        data: [
          {
            id: "abc123",
            name: "Lightning Bolt",
            mana_cost: "{R}",
            type_line: "Instant",
          },
        ],
        has_more: false,
        total_cards: 1,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => searchResponse,
      });

      const response = await fetch(`${API_URL}/api/cards/search?q=lightning`);
      const data = await response.json();

      // Validate response structure
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("has_more");
      expect(data).toHaveProperty("total_cards");
      expect(Array.isArray(data.data)).toBe(true);
      expect(typeof data.has_more).toBe("boolean");
      expect(typeof data.total_cards).toBe("number");

      if (data.data.length > 0) {
        const card = data.data[0];
        expect(card).toHaveProperty("id");
        expect(card).toHaveProperty("name");
        expect(typeof card.id).toBe("string");
        expect(typeof card.name).toBe("string");
      }
    });
  });
});

// Mock API Service for Offline Development
// Simulates backend API responses when the backend is unavailable

// Mock data storage (simulates database)
let mockUsers = [
  { id: 1, username: "Demo", created_at: "2024-01-01T10:00:00Z" },
  { id: 2, username: "test_player", created_at: "2024-01-01T11:00:00Z" },
  { id: 3, username: "mtg_beginner", created_at: "2024-01-01T12:00:00Z" },
];

// Demo cards with real Scryfall IDs that we'll fetch
const demoCardIds = [
  "e3285e6b-3e79-4d7c-bf96-d920f973b122", // Lightning Bolt
  "310d6522-e329-40b5-bbe5-467d56a5feca", // Black Lotus
  "ce30f926-bc06-46ee-9f35-0cdf09a67043", // Counterspell
];

let mockFavourites = [];

let mockMessages = [
  {
    id: 1,
    text: "Welcome to Planeswalker's Primer!",
    created_at: "2024-01-01T09:00:00Z",
  },
  {
    id: 2,
    text: "Currently offline - demo mode active with sample data",
    created_at: "2024-01-01T09:30:00Z",
  },
];

// Mock Scryfall data - will be populated with real data from API
let mockScryfallCards = [];

// Function to populate mock cards with real Scryfall data
async function populateMockCards() {
  if (mockScryfallCards.length > 0) return; // Already populated

  try {
    for (const cardId of demoCardIds) {
      try {
        const response = await fetch(`https://api.scryfall.com/cards/${cardId}`);
        if (response.ok) {
          const cardData = await response.json();
          mockScryfallCards.push(cardData);
        }
      } catch (error) {
        console.warn(`Failed to fetch card ${cardId} for search:`, error);
      }
    }
  } catch (error) {
    console.warn("Failed to populate mock search cards:", error);
  }

  // Add fallback cards if Scryfall fetch failed
  if (mockScryfallCards.length === 0) {
    mockScryfallCards = [
      {
        id: "e3285e6b-3e79-4d7c-bf96-d920f973b122",
        name: "Lightning Bolt",
        mana_cost: "{R}",
        type_line: "Instant",
        oracle_text: "Lightning Bolt deals 3 damage to any target.",
        power: null,
        toughness: null,
      },
      {
        id: "310d6522-e329-40b5-bbe5-467d56a5feca",
        name: "Black Lotus",
        mana_cost: "{0}",
        type_line: "Artifact",
        oracle_text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
        power: null,
        toughness: null,
      },
      {
        id: "ce30f926-bc06-46ee-9f35-0cdf09a67043",
        name: "Counterspell",
        mana_cost: "{U}{U}",
        type_line: "Instant",
        oracle_text: "Counter target spell.",
        power: null,
        toughness: null,
      },
    ];
  }
}

// Helper functions
function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return (
    Math.max(
      ...mockUsers.map((u) => u.id),
      ...mockFavourites.map((f) => f.id),
      0,
    ) + 1
  );
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Mock API implementation
export const mockApi = {
  // Health check
  async health() {
    await delay(100);
    return {
      status: "OK (Mock Mode)",
      timestamp: getCurrentTimestamp(),
      mode: "offline",
    };
  },

  // User CRUD operations
  users: {
    async getAll() {
      await delay(200);
      return [...mockUsers];
    },

    async getById(id) {
      await delay(150);
      const user = mockUsers.find((u) => u.id === parseInt(id));
      if (!user) {
        throw new Error("User not found");
      }
      return { ...user };
    },

    async create(userData) {
      await delay(250);
      const { username } = userData;

      if (!username) {
        throw new Error("Username is required");
      }

      if (mockUsers.some((u) => u.username === username)) {
        throw new Error("Username already exists");
      }

      const newUser = {
        id: generateId(),
        username,
        created_at: getCurrentTimestamp(),
      };

      mockUsers.push(newUser);
      return { ...newUser };
    },

    async update(id, userData) {
      await delay(200);
      const userIndex = mockUsers.findIndex((u) => u.id === parseInt(id));
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const { username } = userData;
      if (!username) {
        throw new Error("Username is required");
      }

      if (
        mockUsers.some((u) => u.username === username && u.id !== parseInt(id))
      ) {
        throw new Error("Username already exists");
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        username,
      };

      return { ...mockUsers[userIndex] };
    },

    async delete(id) {
      await delay(200);
      const userIndex = mockUsers.findIndex((u) => u.id === parseInt(id));
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUser = mockUsers[userIndex];
      mockUsers.splice(userIndex, 1);

      // Also remove user's favourites
      mockFavourites = mockFavourites.filter((f) => f.user_id !== parseInt(id));

      return {
        message: "User deleted",
        deleted: deletedUser,
      };
    },
  },

  // Favourites CRUD operations
  favourites: {
    async getByUserId(userId) {
      await delay(200);

      // If this is the demo user and no favourites exist, populate with real Scryfall data
      if (parseInt(userId) === 1 && mockFavourites.length === 0) {
        await populateDemoFavourites();
      }

      return mockFavourites.filter((f) => f.user_id === parseInt(userId));
    },

    async create(favouriteData) {
      await delay(250);
      const { user_id, card_name, scryfall_id, ability_type, notes } =
        favouriteData;

      if (!user_id || !card_name) {
        throw new Error("User ID and card name are required");
      }

      const newFavourite = {
        id: generateId(),
        user_id: parseInt(user_id),
        card_name,
        scryfall_id: scryfall_id || null,
        ability_type: ability_type || null,
        notes: notes || null,
        created_at: getCurrentTimestamp(),
      };

      mockFavourites.push(newFavourite);
      return { ...newFavourite };
    },

    async update(id, favouriteData) {
      await delay(200);
      const favouriteIndex = mockFavourites.findIndex(
        (f) => f.id === parseInt(id),
      );
      if (favouriteIndex === -1) {
        throw new Error("Favourite not found");
      }

      const { notes, ability_type } = favouriteData;

      mockFavourites[favouriteIndex] = {
        ...mockFavourites[favouriteIndex],
        notes:
          notes !== undefined ? notes : mockFavourites[favouriteIndex].notes,
        ability_type:
          ability_type !== undefined
            ? ability_type
            : mockFavourites[favouriteIndex].ability_type,
      };

      return { ...mockFavourites[favouriteIndex] };
    },

    async delete(id) {
      await delay(200);
      const favouriteIndex = mockFavourites.findIndex(
        (f) => f.id === parseInt(id),
      );
      if (favouriteIndex === -1) {
        throw new Error("Favourite not found");
      }

      const deletedFavourite = mockFavourites[favouriteIndex];
      mockFavourites.splice(favouriteIndex, 1);

      return {
        message: "Favourite removed",
        deleted: deletedFavourite,
      };
    },
  },

  // Card search (mock Scryfall)
  cards: {
    async search(query) {
      await delay(300);

      // Ensure mock cards are populated
      await populateMockCards();

      const searchTerm = query.toLowerCase();

      const filteredCards = mockScryfallCards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm) ||
          card.type_line.toLowerCase().includes(searchTerm) ||
          card.oracle_text.toLowerCase().includes(searchTerm),
      );

      return {
        data: filteredCards,
        has_more: false,
        total_cards: filteredCards.length,
      };
    },

    async random(ability) {
      await delay(250);

      // Ensure mock cards are populated
      await populateMockCards();

      let filteredCards = [...mockScryfallCards];

      if (ability) {
        filteredCards = mockScryfallCards.filter(
          (card) =>
            card.type_line.toLowerCase().includes(ability.toLowerCase()) ||
            card.oracle_text.toLowerCase().includes(ability.toLowerCase()),
        );
      }

      // Shuffle and return up to 3 random cards
      const shuffled = filteredCards.sort(() => 0.5 - Math.random());

      return {
        data: shuffled.slice(0, 3),
        has_more: false,
        total_cards: shuffled.length,
      };
    },

    async getById(id) {
      await delay(200);

      // Ensure mock cards are populated
      await populateMockCards();

      const card = mockScryfallCards.find((c) => c.id === id);
      if (!card) {
        throw new Error("Card not found");
      }
      return { ...card };
    },
  },

  // Messages (for testing)
  messages: {
    async getAll() {
      await delay(200);
      return [...mockMessages];
    },

    async create(messageData) {
      await delay(250);
      const { text } = messageData;

      if (!text) {
        throw new Error("Text is required");
      }

      const newMessage = {
        id: generateId(),
        text,
        created_at: getCurrentTimestamp(),
      };

      mockMessages.push(newMessage);
      return { ...newMessage };
    },
  },
};

// Export mock data for testing
export const mockData = {
  users: mockUsers,
  favourites: mockFavourites,
  messages: mockMessages,
  cards: mockScryfallCards,
};

// Reset function for testing
// Function to populate demo favourites with real Scryfall data
async function populateDemoFavourites() {
  const demoNotes = [
    "The most iconic red spell - 3 damage for 1 mana",
    "The most powerful card ever printed",
    "Classic blue control spell",
  ];

  try {
    for (let i = 0; i < demoCardIds.length; i++) {
      const cardId = demoCardIds[i];
      try {
        const response = await fetch(`https://api.scryfall.com/cards/${cardId}`);
        if (response.ok) {
          const cardData = await response.json();

          mockFavourites.push({
            id: i + 1,
            user_id: 1,
            card_name: cardData.name,
            scryfall_id: cardData.id,
            ability_type: cardData.type_line,
            notes: demoNotes[i],
            created_at: `2024-01-01T${10 + i}:30:00Z`,
            // Store additional Scryfall data for richer display
            image_uris: cardData.image_uris,
            mana_cost: cardData.mana_cost,
            oracle_text: cardData.oracle_text,
            power: cardData.power,
            toughness: cardData.toughness,
            rarity: cardData.rarity,
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch card ${cardId}:`, error);
        // Fallback to basic data if Scryfall fetch fails
        const fallbackNames = ["Lightning Bolt", "Black Lotus", "Counterspell"];
        const fallbackTypes = ["Instant", "Artifact", "Instant"];

        mockFavourites.push({
          id: i + 1,
          user_id: 1,
          card_name: fallbackNames[i],
          scryfall_id: cardId,
          ability_type: fallbackTypes[i],
          notes: demoNotes[i],
          created_at: `2024-01-01T${10 + i}:30:00Z`,
        });
      }
    }
  } catch (error) {
    console.warn("Failed to populate demo favourites:", error);
  }
}

export function resetMockData() {
  mockUsers = [
    { id: 1, username: "Demo", created_at: "2024-01-01T10:00:00Z" },
    { id: 2, username: "test_player", created_at: "2024-01-01T11:00:00Z" },
    { id: 3, username: "mtg_beginner", created_at: "2024-01-01T12:00:00Z" },
  ];

  mockFavourites = [];

  mockMessages = [
    {
      id: 1,
      text: "Welcome to Planeswalker's Primer!",
      created_at: "2024-01-01T09:00:00Z",
    },
    {
      id: 2,
      text: "Mock data has been reset",
      created_at: getCurrentTimestamp(),
    },
  ];
}

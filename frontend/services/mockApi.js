// Mock API Service for Offline Development
// Simulates backend API responses when the backend is unavailable

// Mock data storage (simulates database)
let mockUsers = [
  { id: 1, username: "Demo", created_at: "2024-01-01T10:00:00Z" },
  { id: 2, username: "test_player", created_at: "2024-01-01T11:00:00Z" },
  { id: 3, username: "mtg_beginner", created_at: "2024-01-01T12:00:00Z" },
];

let mockFavourites = [
  {
    id: 1,
    user_id: 1,
    card_name: "Lightning Bolt",
    scryfall_id: "e3285e6b-3e79-4d7c-bf96-d920f973b122",
    ability_type: "Instant",
    notes: "The most iconic red spell - 3 damage for 1 mana",
    created_at: "2024-01-01T10:30:00Z",
  },
  {
    id: 2,
    user_id: 1,
    card_name: "Black Lotus",
    scryfall_id: "310d6522-e329-40b5-bbe5-467d56a5feca",
    ability_type: "Artifact",
    notes: "The most powerful card ever printed",
    created_at: "2024-01-01T10:45:00Z",
  },
  {
    id: 3,
    user_id: 1,
    card_name: "Counterspell",
    scryfall_id: "ce30f926-bc06-46ee-9f35-0cdf09a67043",
    ability_type: "Instant",
    notes: "Classic blue control spell",
    created_at: "2024-01-01T11:00:00Z",
  },
  {
    id: 4,
    user_id: 1,
    card_name: "Birds of Paradise",
    scryfall_id: "472f0e6b-9b95-4c8f-9ce5-0b5f7ac3d1a2",
    ability_type: "Creature - Bird",
    notes: "Perfect mana fixing for any deck",
    created_at: "2024-01-01T11:15:00Z",
  },
  {
    id: 5,
    user_id: 1,
    card_name: "Wrath of God",
    scryfall_id: "664e6656-36a3-4635-9f33-9f8901afd397",
    ability_type: "Sorcery",
    notes: "The original board wipe",
    created_at: "2024-01-01T11:30:00Z",
  },
  {
    id: 6,
    user_id: 1,
    card_name: "Dark Ritual",
    scryfall_id: "e4dc7423-3b76-43f8-a3a9-bddc07dc1b5e",
    ability_type: "Instant",
    notes: "Fast mana acceleration in black",
    created_at: "2024-01-01T11:45:00Z",
  },
  {
    id: 7,
    user_id: 2,
    card_name: "Serra Angel",
    scryfall_id: "b5d97e72-8c85-4f1e-9a55-8e4b6c54c9b1",
    ability_type: "Creature - Angel",
    notes: "Flying and vigilance make this a strong creature",
    created_at: "2024-01-01T12:00:00Z",
  },
];

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

// Mock Scryfall data for card searches
const mockScryfallCards = [
  {
    id: "e3285e6b-3e79-4d7c-bf96-d920f973b122",
    name: "Lightning Bolt",
    mana_cost: "{R}",
    type_line: "Instant",
    oracle_text: "Lightning Bolt deals 3 damage to any target.",
    power: null,
    toughness: null,
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/e/3/e3285e6b-3e79-4d7c-bf96-d920f973b122.jpg",
    },
  },
  {
    id: "310d6522-e329-40b5-bbe5-467d56a5feca",
    name: "Black Lotus",
    mana_cost: "{0}",
    type_line: "Artifact",
    oracle_text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
    power: null,
    toughness: null,
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/3/1/310d6522-e329-40b5-bbe5-467d56a5feca.jpg",
    },
  },
  {
    id: "ce30f926-bc06-46ee-9f35-0cdf09a67043",
    name: "Counterspell",
    mana_cost: "{U}{U}",
    type_line: "Instant",
    oracle_text: "Counter target spell.",
    power: null,
    toughness: null,
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/c/e/ce30f926-bc06-46ee-9f35-0cdf09a67043.jpg",
    },
  },
  {
    id: "472f0e6b-9b95-4c8f-9ce5-0b5f7ac3d1a2",
    name: "Birds of Paradise",
    mana_cost: "{G}",
    type_line: "Creature — Bird",
    oracle_text: "Flying\n{T}: Add one mana of any color.",
    power: "0",
    toughness: "1",
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/4/7/472f0e6b-9b95-4c8f-9ce5-0b5f7ac3d1a2.jpg",
    },
  },
  {
    id: "664e6656-36a3-4635-9f33-9f8901afd397",
    name: "Wrath of God",
    mana_cost: "{2}{W}{W}",
    type_line: "Sorcery",
    oracle_text: "Destroy all creatures. They can't be regenerated.",
    power: null,
    toughness: null,
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/6/6/664e6656-36a3-4635-9f33-9f8901afd397.jpg",
    },
  },
  {
    id: "e4dc7423-3b76-43f8-a3a9-bddc07dc1b5e",
    name: "Dark Ritual",
    mana_cost: "{B}",
    type_line: "Instant",
    oracle_text: "Add {B}{B}{B}.",
    power: null,
    toughness: null,
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/e/4/e4dc7423-3b76-43f8-a3a9-bddc07dc1b5e.jpg",
    },
  },
  {
    id: "b5d97e72-8c85-4f1e-9a55-8e4b6c54c9b1",
    name: "Serra Angel",
    mana_cost: "{3}{W}{W}",
    type_line: "Creature — Angel",
    oracle_text: "Flying, vigilance",
    power: "4",
    toughness: "4",
    image_uris: {
      normal:
        "https://cards.scryfall.io/normal/front/b/5/b5d97e72-8c85-4f1e-9a55-8e4b6c54c9b1.jpg",
    },
  },
];

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
export function resetMockData() {
  mockUsers = [
    { id: 1, username: "Demo", created_at: "2024-01-01T10:00:00Z" },
    { id: 2, username: "test_player", created_at: "2024-01-01T11:00:00Z" },
    { id: 3, username: "mtg_beginner", created_at: "2024-01-01T12:00:00Z" },
  ];

  mockFavourites = [
    {
      id: 1,
      user_id: 1,
      card_name: "Lightning Bolt",
      scryfall_id: "e3285e6b-3e79-4d7c-bf96-d920f973b122",
      ability_type: "Instant",
      notes: "The most iconic red spell - 3 damage for 1 mana",
      created_at: "2024-01-01T10:30:00Z",
    },
    {
      id: 2,
      user_id: 1,
      card_name: "Black Lotus",
      scryfall_id: "310d6522-e329-40b5-bbe5-467d56a5feca",
      ability_type: "Artifact",
      notes: "The most powerful card ever printed",
      created_at: "2024-01-01T10:45:00Z",
    },
  ];

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

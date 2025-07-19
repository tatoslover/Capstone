// Mock API Service for Offline Development
// Simulates backend API responses when the backend is unavailable

// Mock data storage (simulates database)
let mockUsers = [
  { id: 1, username: "Demo", created_at: "2024-01-01T10:00:00Z" },
];

// Demo cards representing all 16 evergreen abilities
// Mix of real Scryfall IDs (2/3) and placeholder-only cards (1/3)
const demoCardIds = [
  // Real Scryfall cards (will show actual images)
  "3cee9303-9d65-45a2-93d4-ef4aba59141b", // Serra Angel (Flying, Vigilance) - White
  "77c6fa74-5543-42ac-9ead-0e890b188e99", // Lightning Bolt - Red
  "d555457a-6d68-4a4e-8bb0-1d2b7b2d8e3c", // Vampire Nighthawk (Flying, Deathtouch, Lifelink) - Black
  "310d6522-e329-40b5-bbe5-467d56a5feca", // Black Lotus - Artifact
  "4f616706-ec97-4923-bb1e-11a69fbaa1f8", // Counterspell - Blue
  "472f0e6b-9b95-4c8f-9ce5-0b5f7ac3d1a2", // Birds of Paradise - Green
  "664e6656-36a3-4635-9f33-9f8901afd397", // Wrath of God - White
  "e4dc7423-3b76-43f8-a3a9-bddc07dc1b5e", // Dark Ritual - Black
  "7737d5c9-502b-4bb0-b2f9-b28f5c5de7a4", // Sol Ring - Artifact
  "bbad3ef0-6c8e-4938-b6c8-e12b8d4e3c55", // Llanowar Elves - Green
  "99ae5991-6c95-4484-b508-a14739d4d671", // Akroan Crusader - Red

  // Placeholder-only cards (will show coloured placeholders)
  null, // Indestructible creature - Colourless
  null, // Flash creature - Blue
  null, // Protection creature - White
  null, // Ward creature - Blue
  null, // Menace creature - Red
];

// Card data for all demo cards (including placeholder-only ones)
const demoCardData = [
  // Real Scryfall cards (indexes 0-10)
  { id: "3cee9303-9d65-45a2-93d4-ef4aba59141b", useReal: true },
  { id: "77c6fa74-5543-42ac-9ead-0e890b188e99", useReal: true },
  { id: "d555457a-6d68-4a4e-8bb0-1d2b7b2d8e3c", useReal: true },
  { id: "310d6522-e329-40b5-bbe5-467d56a5feca", useReal: true },
  { id: "4f616706-ec97-4923-bb1e-11a69fbaa1f8", useReal: true },
  { id: "472f0e6b-9b95-4c8f-9ce5-0b5f7ac3d1a2", useReal: true },
  { id: "664e6656-36a3-4635-9f33-9f8901afd397", useReal: true },
  { id: "e4dc7423-3b76-43f8-a3a9-bddc07dc1b5e", useReal: true },
  { id: "7737d5c9-502b-4bb0-b2f9-b28f5c5de7a4", useReal: true },
  { id: "bbad3ef0-6c8e-4938-b6c8-e12b8d4e3c55", useReal: true },
  { id: "99ae5991-6c95-4484-b508-a14739d4d671", useReal: true },

  // Placeholder-only cards (indexes 11-15)
  {
    id: "demo-indestructible-001",
    name: "Darksteel Colossus",
    mana_cost: "{11}",
    type_line: "Artifact Creature — Beast",
    oracle_text: "Trample, indestructible\nDarksteel Colossus can't be put into a graveyard from anywhere. If it would be put into a graveyard from anywhere, reveal Darksteel Colossus and shuffle it into its owner's library instead.",
    power: "11",
    toughness: "11",
    color_identity: [],
    colours: [],
    rarity: "mythic",
    useReal: false
  },
  {
    id: "demo-flash-001",
    name: "Vendilion Clique",
    mana_cost: "{1}{U}{U}",
    type_line: "Legendary Creature — Faerie Wizard",
    oracle_text: "Flash\nFlying\nWhen Vendilion Clique enters the battlefield, look at target player's hand. You may choose a nonland card from it. If you do, that player reveals that card, puts it on the bottom of their library, then draws a card.",
    power: "3",
    toughness: "1",
    color_identity: ["U"],
    colours: ["U"],
    rarity: "mythic",
    useReal: false
  },
  {
    id: "demo-protection-001",
    name: "White Knight",
    mana_cost: "{W}{W}",
    type_line: "Creature — Human Knight",
    oracle_text: "First strike\nProtection from black",
    power: "2",
    toughness: "2",
    color_identity: ["W"],
    colours: ["W"],
    rarity: "uncommon",
    useReal: false
  },
  {
    id: "demo-ward-001",
    name: "Spectral Adversary",
    mana_cost: "{1}{U}",
    type_line: "Creature — Spirit",
    oracle_text: "Flash\nFlying\nWhen Spectral Adversary enters the battlefield, you may pay {1}{U} any number of times. When you pay this cost one or more times, put that many +1/+1 counters on Spectral Adversary, then up to that many other target artifacts, creatures, and/or planeswalkers phase out.\nWard {2}",
    power: "2",
    toughness: "1",
    color_identity: ["U"],
    colours: ["U"],
    rarity: "rare",
    useReal: false
  },
  {
    id: "demo-menace-001",
    name: "Falkenrath Gorger",
    mana_cost: "{R}",
    type_line: "Creature — Vampire Berserker",
    oracle_text: "Menace\nEach Vampire creature card you own that isn't on the battlefield has madness. The madness cost is equal to its mana cost.",
    power: "2",
    toughness: "1",
    color_identity: ["R"],
    colours: ["R"],
    rarity: "rare",
    useReal: false
  }
];

// Helper function to determine background colour from colour identity
function getCardBackgroundColour(colours) {
  if (!colours || colours.length === 0) {
    return "#6b7280"; // Grey for colourless
  } else if (colours.length === 1) {
    const colourMap = {
      W: "#f8f4dc", // White - warm off-white
      U: "#0ea5e9", // Blue - sky blue
      B: "#8b5cf6", // Black - purple (as requested)
      R: "#ef4444", // Red - bright red
      G: "#22c55e", // Green - bright green
    };
    return colourMap[colours[0]] || "#8b5cf6";
  } else {
    return "#ffd700"; // Gold for multicoloured
  }
}

// Helper function to determine text colour for readability
function getCardTextColour(colours) {
  if (!colours || colours.length === 0) {
    return "#ffffff"; // White text on grey
  } else if (colours.length === 1) {
    const textMap = {
      W: "#1f2937", // Dark text on light background
      U: "#ffffff", // White text on blue
      B: "#ffffff", // White text on purple
      R: "#ffffff", // White text on red
      G: "#ffffff", // White text on green
    };
    return textMap[colours[0]] || "#ffffff";
  } else {
    return "#1f2937"; // Dark text on gold
  }
}

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
    for (let i = 0; i < demoCardIds.length; i++) {
      const cardId = demoCardIds[i];

      if (cardId && demoCardData[i]?.useReal) {
        try {
          console.log(`🃏 Fetching card from Scryfall: ${cardId}`);
          const response = await fetch(`https://api.scryfall.com/cards/${cardId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors'
          });
          if (response.ok) {
            const cardData = await response.json();
            console.log(`✅ Successfully fetched: ${cardData.name}`);
            mockScryfallCards.push(cardData);
          } else {
            console.warn(`❌ Scryfall API returned ${response.status} for card ${cardId}`);
            // Add fallback card
            addFallbackCard(i);
          }
        } catch (error) {
          console.warn(`❌ Failed to fetch card ${cardId} (${error.name}: ${error.message})`);
          // Add fallback card
          addFallbackCard(i);
        }
      } else if (!cardId) {
        // This is a placeholder-only card, add it directly
        const cardData = demoCardData[i];
        if (cardData && !cardData.useReal) {
          mockScryfallCards.push({
            ...cardData,
            image_uris: null // Force placeholder mode
          });
        }
      }
    }
  } catch (error) {
    console.warn("❌ Failed to populate mock search cards:", error);
  }

  console.log(`🎯 Populated ${mockScryfallCards.length} demo cards for search`);
}

// Helper function to add fallback card when Scryfall fetch fails
function addFallbackCard(index) {
  const cardData = demoCardData[index];
  const fallbackNames = [
    "Serra Angel", "Lightning Bolt", "Vampire Nighthawk", "Black Lotus",
    "Counterspell", "Birds of Paradise", "Wrath of God", "Dark Ritual",
    "Sol Ring", "Llanowar Elves", "Lightning Mauler"
  ];

  mockScryfallCards.push({
    id: cardData?.id || `demo-fallback-${index}`,
    name: fallbackNames[index] || `Demo Card ${index + 1}`,
    mana_cost: index % 2 === 0 ? `{${Math.floor(index/2) + 1}}` : `{${index % 5 === 0 ? 'W' : index % 5 === 1 ? 'U' : index % 5 === 2 ? 'B' : index % 5 === 3 ? 'R' : 'G'}}`,
    type_line: "Creature — Beast",
    oracle_text: "This is a fallback demo card representing evergreen abilities.",
    power: "2",
    toughness: "2",
    color_identity: index % 5 === 0 ? ["W"] : index % 5 === 1 ? ["U"] : index % 5 === 2 ? ["B"] : index % 5 === 3 ? ["R"] : ["G"],
    colours: index % 5 === 0 ? ["W"] : index % 5 === 1 ? ["U"] : index % 5 === 2 ? ["B"] : index % 5 === 3 ? ["R"] : ["G"],
    image_uris: null, // Will show placeholder
    rarity: "common"
  });
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

      // If this is the demo user and no favourites exist, populate with offline demo data
      if (parseInt(userId) === 1 && mockFavourites.filter(f => f.user_id === 1).length === 0) {
        populateOfflineDemoFavourites();
      }

      const userFavourites = mockFavourites.filter((f) => f.user_id === parseInt(userId));
      return userFavourites;
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

  // Card search (direct Scryfall API calls)
  cards: {
    async search(query) {
      try {
        console.log(`🔍 Searching Scryfall for: "${query}"`);
        const response = await fetch(
          `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors'
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found ${data.data.length} cards from Scryfall`);
          return data;
        } else if (response.status === 404) {
          console.log(`📭 No cards found for "${query}"`);
          return { data: [], has_more: false, total_cards: 0 };
        } else {
          throw new Error(`Scryfall API error: ${response.status}`);
        }
      } catch (error) {
        console.warn(`❌ Scryfall search failed (${error.name}: ${error.message}), using mock data`);

        // Fallback to mock data
        await delay(300);
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
      }
    },

    async random(ability) {
      try {
        let query = "is:permanent";
        if (ability) {
          query += ` o:${ability}`;
        }

        console.log(`🎲 Getting random cards from Scryfall with query: "${query}"`);
        const response = await fetch(
          `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=random`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors'
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Return only first 10 random cards
          const limitedData = {
            ...data,
            data: data.data.slice(0, 10),
          };
          console.log(`✅ Got ${limitedData.data.length} random cards from Scryfall`);
          return limitedData;
        } else if (response.status === 404) {
          return { data: [], has_more: false, total_cards: 0 };
        } else {
          throw new Error(`Scryfall API error: ${response.status}`);
        }
      } catch (error) {
        console.warn(`❌ Scryfall random search failed (${error.name}: ${error.message}), using mock data`);

        // Fallback to mock data
        await delay(250);
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
      }
    },

    async getById(id) {
      try {
        console.log(`🃏 Fetching card by ID from Scryfall: ${id}`);
        const response = await fetch(`https://api.scryfall.com/cards/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (response.ok) {
          const cardData = await response.json();
          console.log(`✅ Successfully fetched: ${cardData.name}`);
          return cardData;
        } else if (response.status === 404) {
          throw new Error("Card not found");
        } else {
          throw new Error(`Scryfall API error: ${response.status}`);
        }
      } catch (error) {
        console.warn(`❌ Scryfall getById failed (${error.name}: ${error.message}), checking mock data`);

        // Fallback to mock data
        await delay(200);
        await populateMockCards();

        const card = mockScryfallCards.find((c) => c.id === id);
        if (!card) {
          throw new Error("Card not found");
        }
        return { ...card };
      }
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

// Function to populate demo favourites with offline data only
function populateOfflineDemoFavourites() {
  const evergreenAbilities = [
    "Flying", "Trample", "Deathtouch", "Lifelink", "Vigilance", "Haste",
    "Reach", "Hexproof", "First Strike", "Defender", "Double Strike",
    "Indestructible", "Flash", "Protection", "Ward", "Menace"
  ];

  const demoNotes = [
    "Classic flying creature - great for learning evasion",
    "Trample lets excess damage through to the player",
    "Deathtouch makes even 1 damage lethal to creatures",
    "Lifelink gives you life equal to damage dealt",
    "Vigilance means attacking doesn't tap the creature",
    "Haste lets creatures attack immediately",
    "Reach can block flying creatures",
    "Hexproof protects from targeted spells",
    "First strike deals damage before regular combat",
    "Defender can't attack but often has good blocking stats",
    "Double strike deals first strike and regular damage",
    "Indestructible can't be destroyed by damage or effects",
    "Flash lets you cast this at instant speed",
    "Protection prevents damage and targeting from the specified quality",
    "Ward makes opponents pay extra to target this",
    "Menace requires two creatures to block this"
  ];

  const demoNames = [
    "Serra Angel", "Lightning Bolt", "Vampire Nighthawk", "Black Lotus",
    "Counterspell", "Birds of Paradise", "Wrath of God", "Dark Ritual",
    "Sol Ring", "Llanowar Elves", "Lightning Mauler", "Darksteel Colossus",
    "Vendilion Clique", "White Knight", "Spectral Adversary", "Falkenrath Gorger"
  ];

  const demoTypes = [
    "Creature — Angel", "Instant", "Creature — Vampire", "Artifact",
    "Instant", "Creature — Bird", "Sorcery", "Instant",
    "Artifact", "Creature — Elf Druid", "Creature — Human Berserker", "Artifact Creature — Beast",
    "Legendary Creature — Faerie Wizard", "Creature — Human Knight", "Creature — Spirit", "Creature — Vampire Berserker"
  ];

  const demoManaCosts = [
    "{3}{W}{W}", "{R}", "{1}{B}{B}", "{0}",
    "{U}{U}", "{G}", "{2}{W}{W}", "{B}",
    "{1}", "{G}", "{1}{R}", "{11}",
    "{1}{U}{U}", "{W}{W}", "{1}{U}", "{R}"
  ];

  const demoOracleTexts = [
    "Flying, vigilance",
    "Lightning Bolt deals 3 damage to any target.",
    "Flying, deathtouch, lifelink",
    "{T}, Sacrifice Black Lotus: Add three mana of any one colour.",
    "Counter target spell.",
    "Flying\n{T}: Add one mana of any colour.",
    "Destroy all creatures.",
    "Add {B}{B}{B}.",
    "{T}: Add {C}{C}.",
    "{T}: Add {G}.",
    "Haste\nSoulbond (You may pair this creature with another unpaired creature when either enters the battlefield.)",
    "Trample, indestructible\nDarksteel Colossus can't be put into a graveyard from anywhere.",
    "Flash\nFlying\nWhen Vendilion Clique enters the battlefield, look at target player's hand.",
    "First strike\nProtection from black",
    "Flash\nFlying\nWard {2}",
    "Menace\nEach Vampire creature card you own that isn't on the battlefield has madness."
  ];

  const demoColours = [
    ["W"], ["R"], ["B"], [],
    ["U"], ["G"], ["W"], ["B"],
    [], ["G"], ["R"], [],
    ["U"], ["W"], ["U"], ["R"]
  ];

  const demoPowers = ["4", null, "2", null, null, "0", null, null, null, "1", "2", "11", "3", "2", "2", "2"];
  const demoToughnesses = ["4", null, "3", null, null, "1", null, null, null, "1", "1", "11", "1", "2", "1", "1"];

  for (let i = 0; i < 16; i++) {
    const cardId = demoCardData[i] ? (demoCardData[i].useReal ? demoCardIds[i] : demoCardData[i].id) : `demo-${i}`;

    mockFavourites.push({
      id: i + 1,
      user_id: 1,
      card_name: demoNames[i],
      scryfall_id: cardId,
      ability_type: evergreenAbilities[i],
      notes: demoNotes[i],
      created_at: `2024-01-01T${String(10 + i).padStart(2, '0')}:30:00Z`,
      // Store colour information for placeholders
      colours: demoColours[i] || [],
      colour_identity: demoColours[i] || [],
      mana_cost: demoManaCosts[i],
      oracle_text: demoOracleTexts[i],
      power: demoPowers[i],
      toughness: demoToughnesses[i],
      rarity: i % 4 === 0 ? "mythic" : i % 4 === 1 ? "rare" : i % 4 === 2 ? "uncommon" : "common",
      // Show placeholders only for last 5 cards (indexes 11-15) to demonstrate placeholder feature
      image_uris: i >= 11 ? null : undefined
    });
  }
}

export function resetMockData() {
  mockUsers = [
    { id: 1, username: "Demo", created_at: "2024-01-01T10:00:00Z" },
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

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

// Enhanced MTG Mechanics Scraper with comprehensive descriptions
const scrapeMechanics = async () => {
  try {
    console.log("⚡ Scraping Enhanced MTG Mechanics...");

    // Get comprehensive mechanics list from Scryfall
    console.log("📡 Fetching mechanics from Scryfall API...");

    const [keywordAbilitiesResponse, abilityWordsResponse] = await Promise.all([
      axios.get("https://api.scryfall.com/catalog/keyword-abilities"),
      axios.get("https://api.scryfall.com/catalog/ability-words"),
    ]);

    const keywordAbilities = keywordAbilitiesResponse.data.data;
    const abilityWords = abilityWordsResponse.data.data;
    const allMechanics = [...keywordAbilities, ...abilityWords];

    console.log(
      `📊 Found ${allMechanics.length} total mechanics from Scryfall`,
    );

    // Define comprehensive priority mechanics for detailed scraping
    const priorityMechanics = [
      // Evergreen mechanics
      "Flying",
      "Trample",
      "First strike",
      "Deathtouch",
      "Lifelink",
      "Vigilance",
      "Haste",
      "Hexproof",
      "Reach",
      "Menace",
      "Defender",
      "Double strike",
      "Indestructible",
      "Flash",
      "Protection",
      "Ward",

      // Common keyword abilities
      "Cycling",
      "Landfall",
      "Prowess",
      "Scry",
      "Flashback",
      "Convoke",
      "Delve",
      "Escape",
      "Kicker",
      "Morph",
      "Mutate",
      "Adventure",
      "Cascade",
      "Storm",
      "Suspend",
      "Madness",
      "Threshold",
      "Affinity",

      // Popular newer mechanics
      "Foretell",
      "Disturb",
      "Transform",
      "Daybound",
      "Nightbound",
      "Cleave",
      "Training",
      "Channel",
      "Ninjutsu",
      "Reconfigure",

      // Classic mechanics
      "Fear",
      "Intimidate",
      "Shroud",
      "Banding",
      "Flanking",
      "Echo",
      "Buyback",
      "Shadow",
      "Phasing",
      "Rampage",
    ];

    const mechanicsData = {};
    const scrapingErrors = [];

    console.log("🔍 Scraping detailed descriptions...");

    // Scrape detailed information for priority mechanics
    for (let i = 0; i < priorityMechanics.length; i++) {
      const mechanic = priorityMechanics[i];

      if (!allMechanics.includes(mechanic)) {
        console.log(
          `  ⚠️  ${mechanic} not found in Scryfall data, skipping...`,
        );
        continue;
      }

      try {
        // Rate limiting - be respectful to wiki
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log(
          `  📖 Scraping ${mechanic} (${i + 1}/${priorityMechanics.length})...`,
        );

        const mechanicData = await scrapeMechanicFromWiki(mechanic);
        mechanicsData[mechanic.toLowerCase().replace(/\s+/g, "_")] =
          mechanicData;
      } catch (error) {
        console.warn(`  ⚠️  Could not scrape ${mechanic}: ${error.message}`);
        scrapingErrors.push({ mechanic, error: error.message });

        // Use fallback data
        mechanicsData[mechanic.toLowerCase().replace(/\s+/g, "_")] =
          getFallbackMechanicData(mechanic);
      }
    }

    console.log("📝 Adding basic entries for remaining mechanics...");

    // Add basic entries for all other mechanics
    allMechanics.forEach((mechanic) => {
      const key = mechanic.toLowerCase().replace(/\s+/g, "_");
      if (!mechanicsData[key]) {
        mechanicsData[key] = {
          name: mechanic,
          description: `${mechanic} is a Magic: The Gathering mechanic. See the MTG Wiki for detailed information.`,
          simpleDescription: `A ${keywordAbilities.includes(mechanic) ? "keyword ability" : "ability word"} in Magic: The Gathering.`,
          rulesText: "",
          reminderText: "",
          category: "other",
          type: keywordAbilities.includes(mechanic)
            ? "keyword_ability"
            : "ability_word",
          isEvergreen: false,
          isBeginnerFriendly: false,
          complexity: "medium",
          firstAppeared: "Unknown",
          wikiUrl: `https://mtg.fandom.com/wiki/${mechanic.replace(/\s+/g, "_")}`,
          exampleCards: [],
        };
      }
    });

    // Create comprehensive final data structure
    const finalData = {
      lastUpdated: new Date().toISOString(),
      source: "Scryfall API + MTG Wiki + Manual curation",
      scrapingInfo: {
        totalMechanics: allMechanics.length,
        detailedMechanics: Object.keys(mechanicsData).filter(
          (k) => mechanicsData[k].rulesText,
        ).length,
        scrapingErrors: scrapingErrors.length,
        errorDetails: scrapingErrors,
      },
      mechanics: mechanicsData,
      categories: {
        evergreen: Object.values(mechanicsData)
          .filter((m) => m.isEvergreen)
          .map((m) => m.name),
        beginnerFriendly: Object.values(mechanicsData)
          .filter((m) => m.isBeginnerFriendly)
          .map((m) => m.name),
        keywordAbilities: keywordAbilities,
        abilityWords: abilityWords,
        byComplexity: {
          simple: Object.values(mechanicsData)
            .filter((m) => m.complexity === "simple")
            .map((m) => m.name),
          medium: Object.values(mechanicsData)
            .filter((m) => m.complexity === "medium")
            .map((m) => m.name),
          complex: Object.values(mechanicsData)
            .filter((m) => m.complexity === "complex")
            .map((m) => m.name),
        },
      },
      stats: {
        totalCount: allMechanics.length,
        keywordAbilitiesCount: keywordAbilities.length,
        abilityWordsCount: abilityWords.length,
        evergreenCount: Object.values(mechanicsData).filter(
          (m) => m.isEvergreen,
        ).length,
        beginnerFriendlyCount: Object.values(mechanicsData).filter(
          (m) => m.isBeginnerFriendly,
        ).length,
      },
    };

    // Save the enhanced data
    const outputPath = path.join(__dirname, "../data/mechanics.json");
    await fs.writeJson(outputPath, finalData, { spaces: 2 });

    console.log(`✅ Enhanced mechanics data saved to ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   Total mechanics: ${finalData.stats.totalCount}`);
    console.log(
      `   Keyword abilities: ${finalData.stats.keywordAbilitiesCount}`,
    );
    console.log(`   Ability words: ${finalData.stats.abilityWordsCount}`);
    console.log(
      `   Detailed descriptions: ${finalData.scrapingInfo.detailedMechanics}`,
    );
    console.log(`   Evergreen mechanics: ${finalData.stats.evergreenCount}`);
    console.log(
      `   Beginner-friendly: ${finalData.stats.beginnerFriendlyCount}`,
    );
    console.log(`   Scraping errors: ${finalData.scrapingInfo.scrapingErrors}`);

    return finalData;
  } catch (error) {
    console.error("❌ Error in enhanced mechanics scraping:", error.message);
    throw error;
  }
};

async function scrapeMechanicFromWiki(mechanicName) {
  const wikiUrl = `https://mtg.fandom.com/wiki/${mechanicName.replace(/\s+/g, "_")}`;

  try {
    const { data } = await axios.get(wikiUrl);
    const $ = cheerio.load(data);

    let description = "";
    let simpleDescription = "";
    let rulesText = "";
    let reminderText = "";
    let firstAppeared = "";
    let exampleCards = [];

    // Extract main description (first substantial paragraph)
    $("p").each((i, element) => {
      const text = $(element).text().trim();
      if (
        text.length > 100 &&
        !description &&
        !text.startsWith("For other uses") &&
        !text.startsWith("This article") &&
        !text.includes("disambiguation") &&
        !text.startsWith("From the Comprehensive Rules")
      ) {
        description = cleanWikiText(text);
        return false;
      }
    });

    // Look for reminder text in parentheses or italics
    $("p, li").each((i, element) => {
      const text = $(element).text().trim();
      const parenthesesMatch = text.match(/\(([^)]+)\)/);
      if (
        parenthesesMatch &&
        text.toLowerCase().includes(mechanicName.toLowerCase())
      ) {
        reminderText = parenthesesMatch[1];
      }
    });

    // Look for comprehensive rules section
    $("h2, h3").each((i, element) => {
      const headingText = $(element).text().toLowerCase();
      if (
        headingText.includes("rules") ||
        headingText.includes("comprehensive")
      ) {
        const nextElements = $(element).nextUntil("h2, h3");
        nextElements.each((j, nextEl) => {
          if ($(nextEl).is("p") && !rulesText) {
            const text = $(nextEl).text().trim();
            if (text.length > 50) {
              rulesText = cleanWikiText(text);
              return false;
            }
          }
        });
      }
    });

    // Look for first appearance/introduction
    $("p, li").each((i, element) => {
      const text = $(element).text().trim();
      if (
        (text.includes("first appeared") ||
          text.includes("introduced") ||
          text.includes("debuted")) &&
        !firstAppeared
      ) {
        // Try to extract set name or year
        const setMatch = text.match(
          /(?:in|with)\s+([A-Z][^.]+?)(?:\s+in\s+(\d{4}))?[.,]/i,
        );
        if (setMatch) {
          firstAppeared = setMatch[1].trim();
        }
      }
    });

    // Look for example cards
    $("li").each((i, element) => {
      const text = $(element).text().trim();
      // Look for card names (typically in quotes or as links)
      if (text.includes("{{Card|") || text.match(/["'"]/)) {
        const cardMatch = text.match(/["'"]([^"'"]+)["'"]/);
        if (cardMatch && exampleCards.length < 3) {
          exampleCards.push(cardMatch[1]);
        }
      }
    });

    // Create simple description if main description is too complex
    if (description.length > 200) {
      simpleDescription = createSimpleDescription(mechanicName, description);
    } else {
      simpleDescription = description;
    }

    return {
      name: mechanicName,
      description: description || getFallbackDescription(mechanicName),
      simpleDescription:
        simpleDescription || getFallbackSimpleDescription(mechanicName),
      rulesText: rulesText || "",
      reminderText: reminderText || getFallbackReminderText(mechanicName),
      category: getMechanicCategory(mechanicName),
      type: getMethodicType(mechanicName),
      isEvergreen: isEvergreenMechanic(mechanicName),
      isBeginnerFriendly: isBeginnerFriendly(mechanicName),
      complexity: getMechanicComplexity(mechanicName),
      firstAppeared: firstAppeared || "Unknown",
      wikiUrl: wikiUrl,
      exampleCards: exampleCards,
    };
  } catch (error) {
    throw new Error(`Failed to scrape ${mechanicName}: ${error.message}`);
  }
}

function getFallbackMechanicData(mechanicName) {
  return {
    name: mechanicName,
    description: getFallbackDescription(mechanicName),
    simpleDescription: getFallbackSimpleDescription(mechanicName),
    rulesText: "",
    reminderText: getFallbackReminderText(mechanicName),
    category: getMechanicCategory(mechanicName),
    type: getMethodicType(mechanicName),
    isEvergreen: isEvergreenMechanic(mechanicName),
    isBeginnerFriendly: isBeginnerFriendly(mechanicName),
    complexity: getMechanicComplexity(mechanicName),
    firstAppeared: "Unknown",
    wikiUrl: `https://mtg.fandom.com/wiki/${mechanicName.replace(/\s+/g, "_")}`,
    exampleCards: [],
  };
}

function cleanWikiText(text) {
  return text
    .replace(/\[edit\]/g, "")
    .replace(/\[\d+\]/g, "") // Remove reference numbers
    .replace(/\s+/g, " ")
    .trim();
}

function createSimpleDescription(mechanicName, fullDescription) {
  // Take first sentence or first 150 characters
  const firstSentence = fullDescription.split(".")[0] + ".";
  if (firstSentence.length <= 150) {
    return firstSentence;
  }
  return fullDescription.substring(0, 147) + "...";
}

function getFallbackDescription(mechanicName) {
  const descriptions = {
    Flying:
      "A creature with flying can only be blocked by other creatures with flying or reach.",
    Trample:
      "If a creature with trample would deal excess combat damage to a defending creature, that excess damage is dealt to the defending player instead.",
    "First strike":
      "A creature with first strike deals combat damage before creatures without first strike or double strike.",
    Deathtouch:
      "Any amount of damage dealt by a source with deathtouch to a creature is enough to destroy that creature.",
    Lifelink:
      "Damage dealt by a source with lifelink causes you to gain that much life.",
    Vigilance: "Attacking doesn't cause a creature with vigilance to tap.",
    Haste:
      "A creature with haste can attack and use activated abilities with tap symbols the turn it enters the battlefield.",
    Hexproof:
      "A permanent with hexproof can't be the target of spells or abilities your opponents control.",
    Reach: "A creature with reach can block creatures with flying.",
    Menace:
      "A creature with menace can't be blocked except by two or more creatures.",
    Defender: "A creature with defender can't attack.",
    "Double strike":
      "A creature with double strike deals both first strike and regular combat damage.",
    Indestructible:
      'A permanent with indestructible can\'t be destroyed by damage or effects that say "destroy".',
    Flash:
      "You may cast a spell with flash at any time you could cast an instant.",
    Protection:
      "A permanent with protection from X can't be damaged, enchanted, equipped, blocked, or targeted by anything with the quality X.",
    Ward: "Whenever a permanent with ward becomes the target of a spell or ability an opponent controls, counter that spell or ability unless its controller pays the ward cost.",
  };
  return (
    descriptions[mechanicName] ||
    `${mechanicName} is a mechanic in Magic: The Gathering.`
  );
}

function getFallbackSimpleDescription(mechanicName) {
  const simple = {
    Flying: "Can only be blocked by creatures with flying or reach.",
    Trample: "Extra damage goes to the player.",
    "First strike": "Deals damage first in combat.",
    Deathtouch: "Any damage destroys creatures.",
    Lifelink: "Damage dealt gains you life.",
    Vigilance: "Doesn't tap when attacking.",
    Haste: "Can attack immediately.",
    Hexproof: "Can't be targeted by opponents.",
    Reach: "Can block flying creatures.",
    Menace: "Must be blocked by two or more creatures.",
    Defender: "Can't attack.",
    "Double strike": "Deals damage twice.",
    Indestructible: "Can't be destroyed.",
    Flash: "Can be cast at instant speed.",
    Protection: "Can't be affected by the protected quality.",
    Ward: "Costs extra to target.",
  };
  return simple[mechanicName] || `A Magic: The Gathering mechanic.`;
}

function getFallbackReminderText(mechanicName) {
  const reminderTexts = {
    Flying:
      "This creature can't be blocked except by creatures with flying or reach.",
    Trample:
      "This creature can deal excess combat damage to the player or planeswalker it's attacking.",
    Vigilance: "Attacking doesn't cause this creature to tap.",
    Haste:
      "This creature can attack and tap as soon as it comes under your control.",
    Menace: "This creature can't be blocked except by two or more creatures.",
  };
  return reminderTexts[mechanicName] || "";
}

function getMechanicCategory(mechanicName) {
  const categories = {
    Flying: "evasion",
    Trample: "damage",
    "First strike": "combat",
    "Double strike": "combat",
    Deathtouch: "combat",
    Lifelink: "lifegain",
    Vigilance: "combat",
    Haste: "timing",
    Hexproof: "protection",
    Protection: "protection",
    Ward: "protection",
    Reach: "combat",
    Menace: "evasion",
    Defender: "restriction",
    Indestructible: "protection",
    Flash: "timing",
    Cycling: "card_advantage",
    Scry: "card_selection",
    Landfall: "triggered_ability",
  };
  return categories[mechanicName] || "other";
}

function getMethodicType(mechanicName) {
  // This would typically come from Scryfall data, but we'll hardcode common ones
  const keywordAbilities = [
    "Flying",
    "Trample",
    "First strike",
    "Deathtouch",
    "Lifelink",
    "Vigilance",
    "Haste",
    "Hexproof",
    "Reach",
    "Menace",
    "Defender",
    "Double strike",
    "Indestructible",
    "Flash",
    "Protection",
    "Ward",
    "Cycling",
    "Flashback",
  ];
  return keywordAbilities.includes(mechanicName)
    ? "keyword_ability"
    : "ability_word";
}

function isEvergreenMechanic(mechanicName) {
  const evergreen = [
    "Deathtouch",
    "Defender",
    "Double strike",
    "First strike",
    "Flash",
    "Flying",
    "Haste",
    "Hexproof",
    "Indestructible",
    "Lifelink",
    "Menace",
    "Protection",
    "Reach",
    "Trample",
    "Vigilance",
    "Ward",
  ];
  return evergreen.includes(mechanicName);
}

function isBeginnerFriendly(mechanicName) {
  const beginnerFriendly = [
    "Flying",
    "Trample",
    "First strike",
    "Deathtouch",
    "Lifelink",
    "Vigilance",
    "Haste",
    "Reach",
    "Menace",
    "Defender",
    "Cycling",
    "Scry",
  ];
  return beginnerFriendly.includes(mechanicName);
}

function getMechanicComplexity(mechanicName) {
  const simple = [
    "Flying",
    "Trample",
    "Vigilance",
    "Haste",
    "Reach",
    "Menace",
    "Defender",
  ];
  const complex = [
    "Protection",
    "Banding",
    "Phasing",
    "Storm",
    "Dredge",
    "Suspend",
  ];

  if (simple.includes(mechanicName)) return "simple";
  if (complex.includes(mechanicName)) return "complex";
  return "medium";
}

// Run if called directly
if (require.main === module) {
  scrapeMechanics()
    .then((data) => {
      console.log("\n⚡ Enhanced MTG Mechanics Summary:");
      console.log(`📊 Total mechanics: ${data.stats.totalCount}`);
      console.log(`🔑 Keyword abilities: ${data.stats.keywordAbilitiesCount}`);
      console.log(`💬 Ability words: ${data.stats.abilityWordsCount}`);
      console.log(
        `📝 Detailed descriptions: ${data.scrapingInfo.detailedMechanics}`,
      );
      console.log(`🌟 Evergreen: ${data.stats.evergreenCount}`);
      console.log(`👶 Beginner-friendly: ${data.stats.beginnerFriendlyCount}`);
      console.log(`⚠️ Scraping errors: ${data.scrapingInfo.scrapingErrors}`);
    })
    .catch(console.error);
}

module.exports = { scrapeMechanics };

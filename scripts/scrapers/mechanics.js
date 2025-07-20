const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

// Enhanced MTG Mechanics Scraper - essential fields plus wiki links
const scrapeMechanics = async () => {
  try {
    console.log("⚡ Scraping MTG Mechanics...");

    // Get mechanics list from Scryfall
    console.log("📡 Fetching mechanics from Scryfall API...");

    const [keywordAbilitiesResponse, abilityWordsResponse] = await Promise.all([
      axios.get("https://api.scryfall.com/catalog/keyword-abilities"),
      axios.get("https://api.scryfall.com/catalog/ability-words"),
    ]);

    const keywordAbilities = keywordAbilitiesResponse.data.data;
    const abilityWords = abilityWordsResponse.data.data;
    const allMechanics = [...keywordAbilities, ...abilityWords];

    console.log(`📊 Found ${allMechanics.length} total mechanics from Scryfall`);

    // Define evergreen mechanics
    const evergreenMechanics = [
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
      "Ward"
    ];

    const mechanicsData = {};
    let successCount = 0;
    let errorCount = 0;

    console.log("🌐 Scraping mechanic details from MTG Wiki...");

    for (const mechanic of allMechanics) {
      try {
        console.log(`📖 Scraping: ${mechanic}`);

        const mechanicData = await scrapeMechanicFromWiki(mechanic);

        if (mechanicData) {
          // Keep essential fields plus wiki URL
          mechanicsData[mechanic.toLowerCase().replace(/[^a-z0-9]/g, "_")] = {
            name: mechanicData.name || mechanic,
            description: mechanicData.description || getFallbackDescription(mechanic),
            category: getMechanicCategory(mechanic),
            isEvergreen: evergreenMechanics.includes(mechanic),
            wikiUrl: mechanicData.wikiUrl || getConstructedWikiUrl(mechanic)
          };
          successCount++;
        } else {
          // Create fallback data with constructed wiki URL
          mechanicsData[mechanic.toLowerCase().replace(/[^a-z0-9]/g, "_")] = {
            name: mechanic,
            description: getFallbackDescription(mechanic),
            category: getMechanicCategory(mechanic),
            isEvergreen: evergreenMechanics.includes(mechanic),
            wikiUrl: getConstructedWikiUrl(mechanic)
          };
          errorCount++;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.warn(`⚠️  Error scraping ${mechanic}:`, error.message);

        // Create fallback data for failed scrapes
        mechanicsData[mechanic.toLowerCase().replace(/[^a-z0-9]/g, "_")] = {
          name: mechanic,
          description: getFallbackDescription(mechanic),
          category: getMechanicCategory(mechanic),
          isEvergreen: evergreenMechanics.includes(mechanic),
          wikiUrl: getConstructedWikiUrl(mechanic)
        };
        errorCount++;
      }
    }

    // Create final data structure
    const finalData = {
      lastUpdated: new Date().toISOString(),
      source: "MTG Wiki + Scryfall API",
      scrapingInfo: {
        totalMechanics: allMechanics.length,
        successfulScrapes: successCount,
        fallbackEntries: errorCount
      },
      mechanics: mechanicsData,
      categories: {
        evergreen: evergreenMechanics.filter(m => allMechanics.includes(m))
      },
      stats: {
        totalCount: allMechanics.length,
        evergreenCount: evergreenMechanics.filter(m => allMechanics.includes(m)).length
      }
    };

    // Save data
    const outputPath = path.join(__dirname, "../data/mechanics.json");
    await fs.writeJson(outputPath, finalData, { spaces: 2 });

    console.log("✅ Mechanics scraping completed!");
    console.log(`📊 Stats: ${successCount} successful, ${errorCount} fallbacks`);
    console.log(`💾 Saved to: ${outputPath}`);

    return finalData;

  } catch (error) {
    console.error("❌ Error in mechanics scraper:", error);
    throw error;
  }
};

// Helper function to construct wiki URLs for fallback cases
function getConstructedWikiUrl(mechanicName) {
  const specialMappings = {
    "First strike": "First_strike",
    "Double strike": "Double_strike",
    "Battle cry": "Battle_cry",
    "Living weapon": "Living_weapon",
    "More than meets the eye": "More_than_meets_the_eye",
    "Friends forever": "Friends_forever",
    "Partner with": "Partner_with",
    "Choose a background": "Choose_a_Background",
    "Commander ninjutsu": "Commander_ninjutsu",
    "Doctor's companion": "Doctor%27s_companion",
    "For Mirrodin!": "For_Mirrodin!",
    "Split second": "Split_second",
    "Double agenda": "Double_agenda",
    "Hidden agenda": "Hidden_agenda",
    "Legendary landwalk": "Legendary_landwalk",
    "Nonbasic landwalk": "Nonbasic_landwalk",
    "Aura swap": "Aura_swap",
    "Level up": "Level_up",
    "Jump-start": "Jump-start",
    "Read ahead": "Read_ahead",
    "Start your engines!": "Start_your_engines!",
    "Will of the council": "Will_of_the_council",
    "Council's dilemma": "Council%27s_dilemma",
    "Hero's reward": "Hero%27s_reward",
    "Join forces": "Join_forces",
    "Tempting offer": "Tempting_offer",
    "Will of the planeswalkers": "Will_of_the_planeswalkers",
    "Secret council": "Secret_council",
    "Pack tactics": "Pack_tactics",
    "Double team": "Double_team",
    "Job select": "Job_select",
    "Max speed": "Max_speed",
    "Spell mastery": "Spell_mastery",
    "Fateful hour": "Fateful_hour"
  };

  const urlSafeName = specialMappings[mechanicName] || mechanicName.replace(/\s+/g, '_');
  return `https://mtg.fandom.com/wiki/${urlSafeName}`;
}

// Enhanced wiki scraping function with URL capture
async function scrapeMechanicFromWiki(mechanicName) {
  // Special URL mappings for known multi-word mechanics
  const specialMappings = {
    "First strike": "First_strike",
    "Double strike": "Double_strike",
    "Battle cry": "Battle_cry",
    "Living weapon": "Living_weapon",
    "More than meets the eye": "More_than_meets_the_eye",
    "Friends forever": "Friends_forever",
    "Partner with": "Partner_with",
    "Choose a background": "Choose_a_Background",
    "Commander ninjutsu": "Commander_ninjutsu",
    "Doctor's companion": "Doctor%27s_companion",
    "For Mirrodin!": "For_Mirrodin!",
    "Split second": "Split_second",
    "Double agenda": "Double_agenda",
    "Hidden agenda": "Hidden_agenda",
    "Legendary landwalk": "Legendary_landwalk",
    "Nonbasic landwalk": "Nonbasic_landwalk",
    "Aura swap": "Aura_swap",
    "Level up": "Level_up",
    "Jump-start": "Jump-start",
    "Read ahead": "Read_ahead",
    "Start your engines!": "Start_your_engines!",
    "Will of the council": "Will_of_the_council",
    "Council's dilemma": "Council%27s_dilemma",
    "Hero's reward": "Hero%27s_reward",
    "Join forces": "Join_forces",
    "Tempting offer": "Tempting_offer",
    "Will of the planeswalkers": "Will_of_the_planeswalkers",
    "Secret council": "Secret_council",
    "Pack tactics": "Pack_tactics",
    "Double team": "Double_team",
    "Job select": "Job_select",
    "Max speed": "Max_speed",
    "Spell mastery": "Spell_mastery",
    "Fateful hour": "Fateful_hour"
  };

  // Start with special mapping if available
  const urlVariants = [];
  if (specialMappings[mechanicName]) {
    urlVariants.push(specialMappings[mechanicName]);
  }

  // Add standard variants
  urlVariants.push(
    mechanicName.replace(/\s+/g, '_'),     // First_strike
    mechanicName.replace(/\s+/g, '-'),     // First-strike
    mechanicName.replace(/\s+/g, ''),      // Firststrike
    mechanicName,                          // First strike
    encodeURIComponent(mechanicName)       // URL encoded version
  );

  for (const urlVariant of urlVariants) {
    try {
      const wikiUrl = `https://mtg.fandom.com/wiki/${urlVariant}`;

      const response = await axios.get(wikiUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MTG-Mechanics-Scraper/1.0)'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract description from various possible locations
      let description = null;

      // Try main content paragraph
      const firstPara = $('.mw-parser-output > p').first().text().trim();
      if (firstPara && firstPara.length > 50) {
        description = cleanWikiText(firstPara);
      }

      // Try infobox if no good paragraph found
      if (!description) {
        const infoboxText = $('.infobox').find('td, th').text();
        if (infoboxText && infoboxText.length > 50) {
          description = cleanWikiText(infoboxText);
        }
      }

      if (description && description.length > 20) {
        console.log(`✅ Found description for ${mechanicName} using URL: ${urlVariant}`);
        return {
          name: mechanicName,
          description: description,
          wikiUrl: wikiUrl
        };
      }

    } catch (error) {
      // Continue to next URL variant
      continue;
    }
  }

  console.warn(`⚠️  No valid wiki page found for ${mechanicName}`);
  return null;
}

// Helper function to clean wiki text
function cleanWikiText(text) {
  if (!text) return "";

  return text
    .replace(/\[\d+\]/g, '') // Remove citation markers
    .replace(/\s+/g, ' ') // Normalise whitespace
    .replace(/\n/g, ' ') // Remove line breaks
    .trim()
    .substring(0, 500); // Limit length
}

// Fallback descriptions for when scraping fails
function getFallbackDescription(mechanicName) {
  const fallbacks = {
    "Flying": "Creatures with flying can only be blocked by other creatures with flying or reach.",
    "Trample": "When a creature with trample attacks and is blocked, excess damage is dealt to the defending player.",
    "First strike": "Creatures with first strike deal combat damage before creatures without first strike.",
    "Deathtouch": "Any amount of damage dealt by a creature with deathtouch is lethal damage.",
    "Lifelink": "Damage dealt by a creature with lifelink causes its controller to gain that much life.",
    "Vigilance": "Creatures with vigilance don't tap when they attack.",
    "Haste": "Creatures with haste can attack and use activated abilities immediately.",
    "Hexproof": "Creatures with hexproof can't be targeted by spells or abilities opponents control.",
    "Reach": "Creatures with reach can block creatures with flying.",
    "Menace": "Creatures with menace can't be blocked except by two or more creatures.",
    "Defender": "Creatures with defender can't attack.",
    "Double strike": "Creatures with double strike deal first strike and regular combat damage.",
    "Indestructible": "Creatures with indestructible can't be destroyed by damage or effects.",
    "Flash": "Cards with flash can be cast at instant speed.",
    "Protection": "Protection grants immunity from being damaged, enchanted, blocked, or targeted.",
    "Ward": "Spells and abilities that target this creature cost additional mana to cast."
  };

  return fallbacks[mechanicName] || `${mechanicName} is a Magic: The Gathering mechanic.`;
}

// Categorise mechanics (using UK English)
function getMechanicCategory(mechanicName) {
  const categories = {
    // Combat mechanics
    "Flying": "evasion",
    "Trample": "combat",
    "First strike": "combat",
    "Double strike": "combat",
    "Deathtouch": "combat",
    "Vigilance": "combat",
    "Reach": "combat",
    "Menace": "evasion",
    "Defender": "restriction",

    // Protection mechanics
    "Hexproof": "protection",
    "Protection": "protection",
    "Ward": "protection",
    "Indestructible": "protection",

    // Utility mechanics
    "Haste": "utility",
    "Flash": "timing",
    "Lifelink": "lifegain",

    // Cost mechanics
    "Cycling": "cost_reduction",
    "Kicker": "cost_modification",
    "Convoke": "cost_reduction",
    "Delve": "cost_reduction",

    // Triggered abilities
    "Landfall": "triggered",
    "Prowess": "triggered",
    "Cascade": "triggered",
    "Storm": "triggered"
  };

  return categories[mechanicName] || "other";
}

module.exports = { scrapeMechanics };

// Run if called directly
if (require.main === module) {
  scrapeMechanics()
    .then(() => process.exit(0))
    .catch(error => {
      console.error("Scraping failed:", error);
      process.exit(1);
    });
}

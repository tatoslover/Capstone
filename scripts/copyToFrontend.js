const fs = require("fs-extra");
const path = require("path");

// Copy scraped data to frontend data directory
const copyToFrontend = async () => {
  try {
    console.log("📋 Copying scraped data to frontend...\n");

    const scriptsDataDir = path.join(__dirname, "data");
    const frontendDataDir = path.join(__dirname, "../frontend/data");

    // Ensure frontend data directory exists
    await fs.ensureDir(frontendDataDir);

    // Define all data files to copy
    const dataFiles = [
      { name: "gameOverview", icon: "🎮", description: "game overview" },
      { name: "colors", icon: "🎨", description: "colors" },
      { name: "cardTypes", icon: "🃏", description: "card types" },
      { name: "turnPhases", icon: "🕒", description: "turn phases" },
      { name: "cardAnatomy", icon: "📋", description: "card anatomy" },
      { name: "winConditions", icon: "🏆", description: "win conditions" },
      { name: "deckBuilding", icon: "🏗️", description: "deck building" },
      { name: "combatBasics", icon: "⚔️", description: "combat basics" },
      { name: "mechanics", icon: "⚡", description: "mechanics" },
      { name: "gameModes", icon: "🎮", description: "game modes" },
    ];

    // Copy all data files
    for (const file of dataFiles) {
      console.log(`${file.icon} Copying ${file.description} data...`);
      const sourceFile = path.join(scriptsDataDir, `${file.name}.json`);
      const targetFile = path.join(frontendDataDir, `${file.name}.json`);

      if (await fs.pathExists(sourceFile)) {
        await fs.copy(sourceFile, targetFile);
        console.log(`   ✅ ${targetFile}`);
      } else {
        console.log(`   ⚠️  ${file.name}.json not found - run scraper first`);
      }
    }

    // Generate updated mechanics.js with new data
    console.log("📝 Updating mechanics.js with fresh data...");
    const mechanicsJsonPath = path.join(frontendDataDir, "mechanics.json");
    const mechanicsJsPath = path.join(frontendDataDir, "mechanics.js");

    if (await fs.pathExists(mechanicsJsonPath)) {
      const mechanicsData = await fs.readJson(mechanicsJsonPath);

      // Create all mechanics list from categories
      const allMechanicsList = mechanicsData.categories.keywordAbilities.concat(
        mechanicsData.categories.abilityWords,
      );

      const mechanicsJsContent = `// MTG Mechanics Data - Updated from Scryfall API + MTG Wiki
// Last updated: ${mechanicsData.lastUpdated}
// Total: ${mechanicsData.stats.totalCount} unique mechanics and abilities
// Source: ${mechanicsData.source}

export const allMechanics = ${JSON.stringify(allMechanicsList, null, 2)};

// Categorized lists for easier filtering
export const evergreenKeywords = ${JSON.stringify(mechanicsData.categories.evergreen, null, 2)};

export const beginnerFriendly = ${JSON.stringify(mechanicsData.categories.beginnerFriendly, null, 2)};

// Detailed mechanics data with descriptions
export const mechanicsDetails = ${JSON.stringify(mechanicsData.mechanics, null, 2)};

export const searchMechanics = (query) => {
  if (!query || query.trim() === "") return allMechanics;

  const searchTerm = query.toLowerCase().trim();
  return allMechanics.filter((mechanic) =>
    mechanic.toLowerCase().includes(searchTerm),
  );
};

export const getMechanicsByCategory = (category) => {
  switch (category) {
    case "evergreen":
      return evergreenKeywords;
    case "beginner":
      return beginnerFriendly;
    default:
      return allMechanics;
  }
};

export const getMechanicDetails = (mechanicName) => {
  const key = mechanicName.toLowerCase().replace(/\\s+/g, "_");
  return mechanicsDetails[key] || null;
};

// Total count: ${mechanicsData.stats.totalCount} unique mechanics
export const totalMechanics = allMechanics.length;
`;

      await fs.writeFile(mechanicsJsPath, mechanicsJsContent);
      console.log(
        `   ✅ ${mechanicsJsPath} (updated with ${mechanicsData.stats.totalCount} mechanics)`,
      );
    }

    console.log("\n🎉 Data copy complete!");
    console.log("\n💡 Next steps:");
    console.log("   1. Import the new JSON data in your React components");
    console.log('   2. Replace "TBC" placeholders with real data');
    console.log("   3. Update your components to use the new data structure");
    console.log("\n📖 Example usage:");
    console.log('   import gameOverview from "../data/gameOverview.json";');
    console.log('   import colors from "../data/colors.json";');
    console.log('   import cardTypes from "../data/cardTypes.json";');
    console.log('   import turnPhases from "../data/turnPhases.json";');
    console.log('   import cardAnatomy from "../data/cardAnatomy.json";');
    console.log('   import winConditions from "../data/winConditions.json";');
    console.log('   import deckBuilding from "../data/deckBuilding.json";');
    console.log('   import combatBasics from "../data/combatBasics.json";');
    console.log('   import gameModes from "../data/gameModes.json";');
    console.log('   import { mechanicsDetails } from "../data/mechanics.js";');
  } catch (error) {
    console.error("❌ Error copying data:", error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  copyToFrontend().catch(console.error);
}

module.exports = { copyToFrontend };

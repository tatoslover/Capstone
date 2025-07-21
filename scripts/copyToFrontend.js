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
      { name: "colours", icon: "🎨", description: "colours" },
      { name: "cardTypes", icon: "🃏", description: "card types" },
      { name: "turnPhases", icon: "🕒", description: "turn phases" },
      { name: "cardAnatomy", icon: "📋", description: "card anatomy" },
      { name: "winConditions", icon: "🏆", description: "win conditions" },
      { name: "deckBuilding", icon: "🏗️", description: "deck building" },
      { name: "combatBasics", icon: "⚔️", description: "combat basics" },
      {
        name: "mechanics-official-first",
        icon: "⚡",
        description: "mechanics",
        targetName: "mechanics",
      },
      { name: "gameModes", icon: "🎮", description: "game modes" },
    ];

    // Copy all data files
    for (const file of dataFiles) {
      console.log(`${file.icon} Copying ${file.description} data...`);
      const sourceFile = path.join(scriptsDataDir, `${file.name}.json`);
      const targetName = file.targetName || file.name;
      const targetFile = path.join(frontendDataDir, `${targetName}.json`);

      if (await fs.pathExists(sourceFile)) {
        await fs.copy(sourceFile, targetFile);
        console.log(`   ✅ ${targetFile}`);
      } else {
        console.log(
          `   ⚠️  ${file.name}.json not found - run create:official-first first`,
        );
      }
    }

    // Generate updated mechanics.js with fresh data
    console.log("📝 Updating mechanics.js with fresh data...");
    const mechanicsJsonPath = path.join(frontendDataDir, "mechanics.json");
    const mechanicsJsPath = path.join(frontendDataDir, "mechanics.js");

    if (await fs.pathExists(mechanicsJsonPath)) {
      const mechanicsData = await fs.readJson(mechanicsJsonPath);

      // Create all mechanics list from the mechanics object
      const allMechanicsList = Object.values(mechanicsData.mechanics).map(
        (mechanic) => mechanic.name,
      );

      const mechanicsJsContent = `// MTG Mechanics Data - Updated from Scryfall API + MTG Wiki
// Last updated: ${mechanicsData.lastUpdated}
// Total: ${mechanicsData.stats.totalCount} unique mechanics and abilities
// Source: ${mechanicsData.source}

export const allMechanics = ${JSON.stringify(allMechanicsList, null, 2)};

// Categorised lists for easier filtering
export const evergreenKeywords = ${JSON.stringify(mechanicsData.categories.evergreen, null, 2)};

// Detailed mechanics data with descriptions and wiki links
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
    default:
      return allMechanics;
  }
};

export const getMechanicDetails = (mechanicName) => {
  const key = mechanicName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return mechanicsDetails[key] || null;
};

export const getMechanicDescription = (mechanicName, preferFallback = false) => {
  const details = getMechanicDetails(mechanicName);
  if (!details) return null;

  return preferFallback && details.fallbackDescription ?
    details.fallbackDescription :
    details.description;
};

export const isOfficialDescription = (mechanicName) => {
  const details = getMechanicDetails(mechanicName);
  return details ? details.source === "official" : false;
};

export const getMechanicWikiUrl = (mechanicName) => {
  const details = getMechanicDetails(mechanicName);
  return details ? details.wikiUrl : null;
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
    console.log('   import colours from "../data/colours.json";');
    console.log('   import cardTypes from "../data/cardTypes.json";');
    console.log('   import turnPhases from "../data/turnPhases.json";');
    console.log('   import cardAnatomy from "../data/cardAnatomy.json";');
    console.log('   import winConditions from "../data/winConditions.json";');
    console.log('   import deckBuilding from "../data/deckBuilding.json";');
    console.log('   import combatBasics from "../data/combatBasics.json";');
    console.log('   import gameModes from "../data/gameModes.json";');
    console.log(
      '   import { mechanicsDetails, getMechanicWikiUrl } from "../data/mechanics.js";',
    );
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

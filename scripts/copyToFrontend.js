const fs = require('fs-extra');
const path = require('path');

// Copy scraped data to frontend data directory
const copyToFrontend = async () => {
  try {
    console.log('📋 Copying scraped data to frontend...\n');

    const scriptsDataDir = path.join(__dirname, 'data');
    const frontendDataDir = path.join(__dirname, '../frontend/data');

    // Ensure frontend data directory exists
    await fs.ensureDir(frontendDataDir);

    // Copy colors data
    console.log('🎨 Copying colors data...');
    const colorsSource = path.join(scriptsDataDir, 'colors.json');
    const colorsTarget = path.join(frontendDataDir, 'colors.json');

    if (await fs.pathExists(colorsSource)) {
      await fs.copy(colorsSource, colorsTarget);
      console.log(`   ✅ ${colorsTarget}`);
    } else {
      console.log('   ⚠️  colors.json not found - run scraper first');
    }

    // Copy card types data
    console.log('🃏 Copying card types data...');
    const cardTypesSource = path.join(scriptsDataDir, 'cardTypes.json');
    const cardTypesTarget = path.join(frontendDataDir, 'cardTypes.json');

    if (await fs.pathExists(cardTypesSource)) {
      await fs.copy(cardTypesSource, cardTypesTarget);
      console.log(`   ✅ ${cardTypesTarget}`);
    } else {
      console.log('   ⚠️  cardTypes.json not found - run scraper first');
    }

    // Copy mechanics data
    console.log('⚡ Copying mechanics data...');
    const mechanicsSource = path.join(scriptsDataDir, 'mechanics.json');
    const mechanicsTarget = path.join(frontendDataDir, 'mechanics.json');

    if (await fs.pathExists(mechanicsSource)) {
      await fs.copy(mechanicsSource, mechanicsTarget);
      console.log(`   ✅ ${mechanicsTarget}`);
    } else {
      console.log('   ⚠️  mechanics.json not found - run scraper first');
    }

    // Generate updated mechanics.js with new data
    console.log('📝 Updating mechanics.js with fresh data...');
    const mechanicsJsonPath = path.join(frontendDataDir, 'mechanics.json');
    const mechanicsJsPath = path.join(frontendDataDir, 'mechanics.js');

    if (await fs.pathExists(mechanicsJsonPath)) {
      const mechanicsData = await fs.readJson(mechanicsJsonPath);

      const mechanicsJsContent = `// MTG Mechanics Data - Updated from Scryfall API + MTG Wiki
// Last updated: ${mechanicsData.lastUpdated}
// Total: ${mechanicsData.totalMechanics} unique mechanics and abilities
// Source: ${mechanicsData.source}

export const allMechanics = ${JSON.stringify(mechanicsData.allMechanicsList, null, 2)};

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
  const key = mechanicName.toLowerCase();
  return mechanicsDetails[key] || null;
};

// Total count: ${mechanicsData.totalMechanics} unique mechanics
export const totalMechanics = allMechanics.length;
`;

      await fs.writeFile(mechanicsJsPath, mechanicsJsContent);
      console.log(`   ✅ ${mechanicsJsPath} (updated with ${mechanicsData.totalMechanics} mechanics)`);
    }

    console.log('\n🎉 Data copy complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Import the new JSON data in your React components');
    console.log('   2. Replace "TBC" placeholders with real data');
    console.log('   3. Update your components to use the new data structure');
    console.log('\n📖 Example usage:');
    console.log('   import colors from "../data/colors.json";');
    console.log('   import cardTypes from "../data/cardTypes.json";');
    console.log('   import { mechanicsDetails } from "../data/mechanics.js";');

  } catch (error) {
    console.error('❌ Error copying data:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  copyToFrontend().catch(console.error);
}

module.exports = { copyToFrontend };

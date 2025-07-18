const { scrapeColors } = require('./colors');
const { scrapeCardTypes } = require('./cardTypes');
const { scrapeMechanics } = require('./mechanics');
const { scrapeGameOverview } = require('./gameOverview');
const { scrapeWinConditions } = require('./winConditions');
const { scrapeDeckBuilding } = require('./deckBuilding');
const { scrapeCombatBasics } = require('./combatBasics');
const { scrapeCardAnatomy } = require('./cardAnatomy');
const path = require('path');

// Main scraper function to run all scrapers
const runAllScrapers = async () => {
  console.log('🚀 Starting MTG data scraping...\n');

  const startTime = Date.now();
  const results = {};

  try {
    // Run scrapers sequentially to be respectful to the wiki
    console.log('1️⃣  Starting Game Overview scraper...');
    results.gameOverview = await scrapeGameOverview();
    console.log('✅ Game Overview complete\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('2️⃣  Starting Colors scraper...');
    results.colors = await scrapeColors();
    console.log('✅ Colors complete\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('3️⃣  Starting Card Types scraper...');
    results.cardTypes = await scrapeCardTypes();
    console.log('✅ Card Types complete\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('4️⃣  Starting Card Anatomy scraper...');
    results.cardAnatomy = await scrapeCardAnatomy();
    console.log('✅ Card Anatomy complete\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('5️⃣  Starting Win Conditions scraper...');
    results.winConditions = await scrapeWinConditions();
    console.log('✅ Win Conditions complete\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('6️⃣  Starting Deck Building scraper...');
    results.deckBuilding = await scrapeDeckBuilding();
    console.log('✅ Deck Building complete\n');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('7️⃣  Starting Combat Basics scraper...');
    results.combatBasics = await scrapeCombatBasics();
    console.log('✅ Combat Basics complete\n');

    // Small delay before mechanics (which makes many requests)
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('8️⃣  Starting Mechanics scraper...');
    results.mechanics = await scrapeMechanics();
    console.log('✅ Mechanics complete\n');

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('🎉 All scraping complete!');
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log('\n📊 Results summary:');
    console.log(`   🎮 Game Overview: Complete introduction guide`);
    console.log(`   🎨 Colors: ${Object.keys(results.colors).length}`);
    console.log(`   🃏 Card Types: ${Object.keys(results.cardTypes).length}`);
    console.log(`   📋 Card Anatomy: ${Object.keys(results.cardAnatomy.cardParts).length} parts explained`);
    console.log(`   🏆 Win Conditions: ${Object.keys(results.winConditions.primaryWinConditions).length} primary + ${Object.keys(results.winConditions.alternativeWinConditions).length} alternative`);
    console.log(`   🏗️ Deck Building: Complete construction guide`);
    console.log(`   ⚔️ Combat Basics: ${Object.keys(results.combatBasics.combatSteps).length} combat steps`);
    console.log(`   ⚡ Mechanics: ${results.mechanics.totalMechanics}`);

    console.log('\n📁 Data files saved to:');
    console.log(`   ${path.join(__dirname, '../data/gameOverview.json')}`);
    console.log(`   ${path.join(__dirname, '../data/colors.json')}`);
    console.log(`   ${path.join(__dirname, '../data/cardTypes.json')}`);
    console.log(`   ${path.join(__dirname, '../data/cardAnatomy.json')}`);
    console.log(`   ${path.join(__dirname, '../data/winConditions.json')}`);
    console.log(`   ${path.join(__dirname, '../data/deckBuilding.json')}`);
    console.log(`   ${path.join(__dirname, '../data/combatBasics.json')}`);
    console.log(`   ${path.join(__dirname, '../data/mechanics.json')}`);

    console.log('\n💡 Next steps:');
    console.log('   - Review the generated JSON files');
    console.log('   - Import the data into your frontend components');
    console.log('   - Replace the "TBC" placeholders in your app');

    return results;

  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Individual scraper functions for selective running
const runGameOverviewScraper = async () => {
  console.log('🎮 Running Game Overview scraper only...');
  try {
    const results = await scrapeGameOverview();
    console.log('✅ Game Overview scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Game Overview scraping failed:', error.message);
    throw error;
  }
};

const runColorsScraper = async () => {
  console.log('🎨 Running Colors scraper only...');
  try {
    const results = await scrapeColors();
    console.log('✅ Colors scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Colors scraping failed:', error.message);
    throw error;
  }
};

const runCardTypesScraper = async () => {
  console.log('🃏 Running Card Types scraper only...');
  try {
    const results = await scrapeCardTypes();
    console.log('✅ Card Types scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Card Types scraping failed:', error.message);
    throw error;
  }
};

const runCardAnatomyScraper = async () => {
  console.log('📋 Running Card Anatomy scraper only...');
  try {
    const results = await scrapeCardAnatomy();
    console.log('✅ Card Anatomy scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Card Anatomy scraping failed:', error.message);
    throw error;
  }
};

const runWinConditionsScraper = async () => {
  console.log('🏆 Running Win Conditions scraper only...');
  try {
    const results = await scrapeWinConditions();
    console.log('✅ Win Conditions scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Win Conditions scraping failed:', error.message);
    throw error;
  }
};

const runDeckBuildingScraper = async () => {
  console.log('🏗️ Running Deck Building scraper only...');
  try {
    const results = await scrapeDeckBuilding();
    console.log('✅ Deck Building scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Deck Building scraping failed:', error.message);
    throw error;
  }
};

const runCombatBasicsScraper = async () => {
  console.log('⚔️ Running Combat Basics scraper only...');
  try {
    const results = await scrapeCombatBasics();
    console.log('✅ Combat Basics scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Combat Basics scraping failed:', error.message);
    throw error;
  }
};

const runMechanicsScraper = async () => {
  console.log('⚡ Running Mechanics scraper only...');
  try {
    const results = await scrapeMechanics();
    console.log('✅ Mechanics scraping complete');
    return results;
  } catch (error) {
    console.error('❌ Mechanics scraping failed:', error.message);
    throw error;
  }
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'overview':
    case 'game-overview':
      runGameOverviewScraper().catch(console.error);
      break;
    case 'colors':
      runColorsScraper().catch(console.error);
      break;
    case 'card-types':
      runCardTypesScraper().catch(console.error);
      break;
    case 'anatomy':
    case 'card-anatomy':
      runCardAnatomyScraper().catch(console.error);
      break;
    case 'win':
    case 'win-conditions':
      runWinConditionsScraper().catch(console.error);
      break;
    case 'deck':
    case 'deck-building':
      runDeckBuildingScraper().catch(console.error);
      break;
    case 'combat':
    case 'combat-basics':
      runCombatBasicsScraper().catch(console.error);
      break;
    case 'mechanics':
      runMechanicsScraper().catch(console.error);
      break;
    case 'all':
    default:
      runAllScrapers().catch(console.error);
      break;
  }
}

module.exports = {
  runAllScrapers,
  runGameOverviewScraper,
  runColorsScraper,
  runCardTypesScraper,
  runCardAnatomyScraper,
  runWinConditionsScraper,
  runDeckBuildingScraper,
  runCombatBasicsScraper,
  runMechanicsScraper
};

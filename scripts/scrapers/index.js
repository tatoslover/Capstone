const { scrapeColors } = require('./colors');
const { scrapeCardTypes } = require('./cardTypes');
const { scrapeMechanics } = require('./mechanics');
const path = require('path');

// Main scraper function to run all scrapers
const runAllScrapers = async () => {
  console.log('🚀 Starting MTG data scraping...\n');

  const startTime = Date.now();
  const results = {};

  try {
    // Run scrapers sequentially to be respectful to the wiki
    console.log('1️⃣  Starting Colors scraper...');
    results.colors = await scrapeColors();
    console.log('✅ Colors complete\n');

    // Small delay between scrapers
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('2️⃣  Starting Card Types scraper...');
    results.cardTypes = await scrapeCardTypes();
    console.log('✅ Card Types complete\n');

    // Small delay before mechanics (which makes many requests)
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('3️⃣  Starting Mechanics scraper...');
    results.mechanics = await scrapeMechanics();
    console.log('✅ Mechanics complete\n');

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('🎉 All scraping complete!');
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log('\n📊 Results summary:');
    console.log(`   🎨 Colors: ${Object.keys(results.colors).length}`);
    console.log(`   🃏 Card Types: ${Object.keys(results.cardTypes).length}`);
    console.log(`   ⚡ Mechanics: ${results.mechanics.totalMechanics}`);

    console.log('\n📁 Data files saved to:');
    console.log(`   ${path.join(__dirname, '../data/colors.json')}`);
    console.log(`   ${path.join(__dirname, '../data/cardTypes.json')}`);
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
    case 'colors':
      runColorsScraper().catch(console.error);
      break;
    case 'card-types':
      runCardTypesScraper().catch(console.error);
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
  runColorsScraper,
  runCardTypesScraper,
  runMechanicsScraper
};

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Game Modes/Formats information
const scrapeGameModes = async () => {
  try {
    console.log('🎮 Scraping MTG Game Modes & Formats...');

    const gameModesData = {
      lastUpdated: new Date().toISOString(),
      source: 'MTG Wiki + Manual curation',
      categories: {},
      allFormats: []
    };

    // Define format categories and their formats
    const formatCategories = {
      rotating: {
        title: '🔁 Rotating',
        description: 'These formats have card pools that change over time',
        formats: ['Standard', 'Pioneer', 'Alchemy', 'Historic']
      },
      eternal: {
        title: '♾️ Eternal',
        description: 'These don\'t rotate and include all legal cards back to a certain point',
        formats: ['Modern', 'Legacy', 'Vintage', 'Pauper']
      },
      limited: {
        title: '🧪 Limited',
        description: 'Where you build a deck from unopened boosters',
        formats: ['Sealed', 'Draft', 'Cube Draft', 'Rochester Draft']
      },
      multiplayer: {
        title: '🎮 Casual & Multiplayer',
        description: 'Formats designed for multiple players or casual play',
        formats: ['Commander', 'Brawl', 'Oathbreaker', 'Planechase', 'Archenemy', 'Two-Headed Giant', 'Conspiracy']
      },
      custom: {
        title: '🛠️ Custom & House',
        description: 'Often made by communities or friends',
        formats: ['Kitchen Table', 'Preconstructed Battles', 'Highlander', 'Canadian Highlander']
      }
    };

    // Scrape detailed information for each format
    console.log('🔍 Scraping format details...');

    for (const [categoryKey, categoryData] of Object.entries(formatCategories)) {
      console.log(`  📂 Processing ${categoryData.title} category...`);

      const categoryFormats = [];

      for (const formatName of categoryData.formats) {
        try {
          await new Promise(resolve => setTimeout(resolve, 800)); // Rate limiting

          console.log(`    📖 Scraping ${formatName}...`);

          const formatData = await scrapeFormatDetails(formatName);
          categoryFormats.push(formatData);
          gameModesData.allFormats.push(formatData);

        } catch (error) {
          console.warn(`    ⚠️  Could not scrape ${formatName}, using fallback`);
          const fallbackData = getFallbackFormatData(formatName, categoryKey);
          categoryFormats.push(fallbackData);
          gameModesData.allFormats.push(fallbackData);
        }
      }

      gameModesData.categories[categoryKey] = {
        title: categoryData.title,
        description: categoryData.description,
        formats: categoryFormats
      };
    }

    // Save the data
    const outputPath = path.join(__dirname, '../data/gameModes.json');
    await fs.writeJson(outputPath, gameModesData, { spaces: 2 });

    console.log(`✅ Game Modes data saved to ${outputPath}`);
    console.log(`📊 Total formats: ${gameModesData.allFormats.length}`);
    console.log(`📁 Categories: ${Object.keys(gameModesData.categories).length}`);

    return gameModesData;

  } catch (error) {
    console.error('❌ Error scraping game modes:', error.message);
    throw error;
  }
};

async function scrapeFormatDetails(formatName) {
  try {
    // Format the name for wiki URL
    const wikiFormatName = formatName.replace(/\s+/g, '_');
    const wikiUrl = `https://mtg.fandom.com/wiki/${wikiFormatName}`;

    const { data } = await axios.get(wikiUrl);
    const $ = cheerio.load(data);

    let description = '';
    let rules = '';
    let cardPool = '';
    let isDigitalOnly = false;
    let isCompetitive = true;

    // Try to find the first meaningful paragraph description
    $('p').each((i, element) => {
      const text = $(element).text().trim();
      if (text.length > 100 && !description &&
          !text.startsWith('For other uses') &&
          !text.startsWith('This article') &&
          !text.includes('disambiguation')) {
        description = text;
        return false; // Break
      }
    });

    // Look for rules section
    $('h2, h3').each((i, element) => {
      const headingText = $(element).text().toLowerCase();
      if (headingText.includes('rules') || headingText.includes('deck construction')) {
        const nextElements = $(element).nextUntil('h2, h3');
        nextElements.each((j, nextEl) => {
          if ($(nextEl).is('p, ul')) {
            const text = $(nextEl).text().trim();
            if (text.length > 50 && !rules) {
              rules = text;
              return false;
            }
          }
        });
      }
    });

    // Check for digital-only indicators
    const pageText = $.text().toLowerCase();
    if (pageText.includes('mtg arena') || pageText.includes('digital') ||
        pageText.includes('arena only') || formatName === 'Alchemy' || formatName === 'Historic') {
      isDigitalOnly = true;
    }

    // Check if it's primarily casual
    if (pageText.includes('casual') || pageText.includes('multiplayer') ||
        formatName === 'Commander' || formatName === 'Kitchen Table' ||
        formatName === 'Planechase' || formatName === 'Archenemy') {
      isCompetitive = false;
    }

    return {
      name: formatName,
      description: description || getFallbackDescription(formatName),
      rules: rules || '',
      cardPool: cardPool,
      isDigitalOnly: isDigitalOnly,
      isCompetitive: isCompetitive,
      isRotating: isRotatingFormat(formatName),
      category: getCategoryForFormat(formatName),
      wikiUrl: wikiUrl,
      popularity: getFormatPopularity(formatName)
    };

  } catch (error) {
    console.warn(`Could not scrape ${formatName} from wiki:`, error.message);
    return getFallbackFormatData(formatName);
  }
}

function getFallbackFormatData(formatName, category = null) {
  const fallbackDescriptions = {
    'Standard': 'The most popular competitive format using cards from the most recent sets. Rotates regularly to keep the format fresh.',
    'Pioneer': 'Cards from Return to Ravnica (2012) onward. Less powerful than Modern but more accessible.',
    'Modern': 'Cards from 2003 onwards. Higher power level with diverse strategies and archetypes.',
    'Legacy': 'Includes almost all cards, but with a ban list. More powerful and expensive.',
    'Vintage': 'Includes every card ever printed, with a restricted list instead of bans.',
    'Pauper': 'Only commons allowed. Can be surprisingly powerful and budget-friendly.',
    'Commander': '100-card singleton format with a legendary creature as your commander. Perfect for casual multiplayer games.',
    'Brawl': 'Like Commander but 60 cards and Standard-legal (for 1v1 or multiplayer).',
    'Draft': 'Open card packs, pick cards, and build your deck on the spot. Great for learning new cards and testing your skills.',
    'Sealed': 'Build a deck from 6 booster packs. Everyone starts on equal footing, making it ideal for tournaments and events.',
    'Alchemy': 'A Standard-based digital-only format on MTG Arena with rebalanced cards and exclusive digital mechanics.',
    'Historic': 'Another Arena-only format with a growing, curated card pool (eternal).',
    'Oathbreaker': 'Like Commander but with a Planeswalker and a Signature Spell (60-card decks).',
    'Planechase': 'Adds oversized plane cards with global effects, used with Commander or multiplayer.',
    'Archenemy': 'One player is the villain with scheme cards vs. a team of players.',
    'Two-Headed Giant': '2v2 team format, often used in Limited events.',
    'Conspiracy': 'Draft format with special cards that affect the draft itself.',
    'Kitchen Table': 'Casual play with friends using any cards you own. No restrictions, just fun! Perfect for learning and experimenting.',
    'Preconstructed Battles': 'Use pre-built decks against each other.',
    'Highlander': 'One-of-a-kind deck format like Commander but without a commander.',
    'Canadian Highlander': 'A competitive singleton format with a points system.',
    'Cube Draft': 'Drafting a curated set of cards (a "cube") instead of regular boosters.',
    'Rochester Draft': 'A more niche draft format where packs are opened face up.'
  };

  return {
    name: formatName,
    description: fallbackDescriptions[formatName] || `${formatName} is a Magic: The Gathering format.`,
    rules: '',
    cardPool: '',
    isDigitalOnly: ['Alchemy', 'Historic'].includes(formatName),
    isCompetitive: !['Commander', 'Kitchen Table', 'Planechase', 'Archenemy', 'Preconstructed Battles'].includes(formatName),
    isRotating: isRotatingFormat(formatName),
    category: category || getCategoryForFormat(formatName),
    wikiUrl: `https://mtg.fandom.com/wiki/${formatName.replace(/\s+/g, '_')}`,
    popularity: getFormatPopularity(formatName)
  };
}

function getFallbackDescription(formatName) {
  const descriptions = {
    'Standard': 'The most popular competitive format using cards from the most recent sets.',
    'Pioneer': 'Cards from Return to Ravnica (2012) onward with regular banlist updates.',
    'Modern': 'Cards from 2003 onwards with a diverse metagame and high power level.',
    'Legacy': 'Nearly every card in Magic\'s history with a comprehensive ban list.',
    'Vintage': 'Every card ever printed with restrictions instead of bans.',
    'Pauper': 'A budget-friendly format using only common cards.',
    'Commander': 'A 100-card singleton multiplayer format with a legendary commander.',
    'Brawl': 'A 60-card Standard-based singleton format.',
    'Draft': 'Build decks by drafting cards from booster packs.',
    'Sealed': 'Construct decks from a fixed number of booster packs.',
    'Alchemy': 'Digital-only format with rebalanced cards and digital mechanics.',
    'Historic': 'Arena\'s non-rotating format with an ever-growing card pool.'
  };
  return descriptions[formatName] || `${formatName} is a Magic: The Gathering format.`;
}

function isRotatingFormat(formatName) {
  const rotatingFormats = ['Standard', 'Alchemy'];
  return rotatingFormats.includes(formatName);
}

function getCategoryForFormat(formatName) {
  const categoryMap = {
    'Standard': 'rotating',
    'Pioneer': 'rotating',
    'Alchemy': 'rotating',
    'Historic': 'rotating',
    'Modern': 'eternal',
    'Legacy': 'eternal',
    'Vintage': 'eternal',
    'Pauper': 'eternal',
    'Sealed': 'limited',
    'Draft': 'limited',
    'Cube Draft': 'limited',
    'Rochester Draft': 'limited',
    'Commander': 'multiplayer',
    'Brawl': 'multiplayer',
    'Oathbreaker': 'multiplayer',
    'Planechase': 'multiplayer',
    'Archenemy': 'multiplayer',
    'Two-Headed Giant': 'multiplayer',
    'Conspiracy': 'multiplayer',
    'Kitchen Table': 'custom',
    'Preconstructed Battles': 'custom',
    'Highlander': 'custom',
    'Canadian Highlander': 'custom'
  };
  return categoryMap[formatName] || 'other';
}

function getFormatPopularity(formatName) {
  // Popularity rankings based on general community consensus
  const popularityMap = {
    'Standard': 'very-high',
    'Commander': 'very-high',
    'Draft': 'very-high',
    'Modern': 'high',
    'Pioneer': 'high',
    'Sealed': 'high',
    'Legacy': 'medium',
    'Pauper': 'medium',
    'Brawl': 'medium',
    'Historic': 'medium',
    'Alchemy': 'medium',
    'Vintage': 'low',
    'Oathbreaker': 'low',
    'Cube Draft': 'medium',
    'Kitchen Table': 'very-high',
    'Two-Headed Giant': 'low',
    'Planechase': 'low',
    'Archenemy': 'low',
    'Conspiracy': 'low',
    'Preconstructed Battles': 'medium',
    'Highlander': 'low',
    'Canadian Highlander': 'low',
    'Rochester Draft': 'very-low'
  };
  return popularityMap[formatName] || 'unknown';
}

// Run if called directly
if (require.main === module) {
  scrapeGameModes()
    .then(data => {
      console.log('\n🎮 MTG Game Modes Summary:');
      console.log(`📊 Total formats: ${data.allFormats.length}`);
      console.log(`📁 Categories: ${Object.keys(data.categories).length}`);
      Object.entries(data.categories).forEach(([key, category]) => {
        console.log(`   ${category.title}: ${category.formats.length} formats`);
      });
    })
    .catch(console.error);
}

module.exports = { scrapeGameModes };

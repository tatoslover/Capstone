const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Import the existing mechanics list
const mechanicsPath = path.join(__dirname, '../../frontend/data/mechanics.js');
let existingMechanics = [];

try {
  // Read the existing mechanics file
  const mechanicsContent = fs.readFileSync(mechanicsPath, 'utf8');
  // Extract the allMechanics array using regex
  const match = mechanicsContent.match(/export const allMechanics = \[([\s\S]*?)\];/);
  if (match) {
    // Parse the array content
    const arrayContent = match[1];
    existingMechanics = arrayContent
      .split(',')
      .map(item => item.trim().replace(/['"]/g, ''))
      .filter(item => item && !item.startsWith('//'));
  }
} catch (error) {
  console.warn('Could not read existing mechanics file, will fetch from Scryfall');
}

// Scrape MTG Mechanics information
const scrapeMechanics = async () => {
  try {
    console.log('⚡ Scraping MTG Mechanics...');

    // First, get fresh mechanics list from Scryfall
    console.log('📡 Fetching mechanics list from Scryfall API...');
    const scryfallResponse = await axios.get('https://api.scryfall.com/catalog/keyword-abilities');
    const scryfallMechanics = scryfallResponse.data.data;

    // Get ability words too
    const abilityWordsResponse = await axios.get('https://api.scryfall.com/catalog/ability-words');
    const abilityWords = abilityWordsResponse.data.data;

    // Combine all mechanics
    const allMechanics = [...scryfallMechanics, ...abilityWords];
    console.log(`📊 Found ${allMechanics.length} total mechanics from Scryfall`);

    // Define evergreen and beginner-friendly mechanics that need detailed descriptions
    const priorityMechanics = [
      'Flying', 'Trample', 'First strike', 'Deathtouch', 'Lifelink', 'Vigilance',
      'Haste', 'Hexproof', 'Reach', 'Menace', 'Defender', 'Double strike',
      'Indestructible', 'Flash', 'Protection', 'Ward', 'Cycling', 'Landfall',
      'Prowess', 'Scry', 'Flying', 'Fear', 'Intimidate'
    ];

    const mechanicsData = {};

    // Scrape detailed descriptions for priority mechanics from MTG Wiki
    console.log('🔍 Scraping detailed descriptions for priority mechanics...');

    for (const mechanic of priorityMechanics) {
      if (allMechanics.includes(mechanic)) {
        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting

          const wikiUrl = `https://mtg.fandom.com/wiki/${mechanic.replace(/\s+/g, '_')}`;
          console.log(`  📖 Scraping ${mechanic}...`);

          const { data } = await axios.get(wikiUrl);
          const $ = cheerio.load(data);

          let description = '';
          let rules = '';
          let examples = [];

          // Try to find the first meaningful paragraph
          $('p').each((i, element) => {
            const text = $(element).text().trim();
            if (text.length > 50 && !description && !text.startsWith('For other uses')) {
              description = text;
              return false; // Break
            }
          });

          // Look for rules or examples
          $('p, li').each((i, element) => {
            const text = $(element).text().trim();
            if (text.includes('reminder text') || text.includes('rules')) {
              rules = text;
            }
          });

          mechanicsData[mechanic.toLowerCase()] = {
            name: mechanic,
            description: description || getDefaultDescription(mechanic),
            rules: rules || '',
            category: getPriorityCategory(mechanic),
            isEvergreen: isEvergreenMechanic(mechanic),
            isBeginnerFriendly: true,
            wikiUrl: wikiUrl
          };

        } catch (error) {
          console.warn(`  ⚠️  Could not scrape ${mechanic}, using fallback`);
          mechanicsData[mechanic.toLowerCase()] = {
            name: mechanic,
            description: getDefaultDescription(mechanic),
            rules: '',
            category: getPriorityCategory(mechanic),
            isEvergreen: isEvergreenMechanic(mechanic),
            isBeginnerFriendly: true,
            wikiUrl: `https://mtg.fandom.com/wiki/${mechanic.replace(/\s+/g, '_')}`
          };
        }
      }
    }

    // Add basic entries for all other mechanics
    console.log('📝 Adding entries for remaining mechanics...');
    allMechanics.forEach(mechanic => {
      const key = mechanic.toLowerCase();
      if (!mechanicsData[key]) {
        mechanicsData[key] = {
          name: mechanic,
          description: `${mechanic} is a Magic: The Gathering mechanic. Click the link to learn more.`,
          rules: '',
          category: 'other',
          isEvergreen: isEvergreenMechanic(mechanic),
          isBeginnerFriendly: priorityMechanics.includes(mechanic),
          wikiUrl: `https://mtg.fandom.com/wiki/${mechanic.replace(/\s+/g, '_')}`
        };
      }
    });

    // Create the final data structure
    const finalData = {
      totalMechanics: allMechanics.length,
      lastUpdated: new Date().toISOString(),
      source: 'Scryfall API + MTG Wiki',
      mechanics: mechanicsData,
      categories: {
        evergreen: Object.values(mechanicsData).filter(m => m.isEvergreen).map(m => m.name),
        beginnerFriendly: Object.values(mechanicsData).filter(m => m.isBeginnerFriendly).map(m => m.name),
        priority: priorityMechanics.filter(m => allMechanics.includes(m))
      },
      allMechanicsList: allMechanics
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/mechanics.json');
    await fs.writeJson(outputPath, finalData, { spaces: 2 });

    console.log(`✅ Mechanics data saved to ${outputPath}`);
    console.log(`📊 Total mechanics: ${allMechanics.length}`);
    console.log(`🎯 Priority mechanics with descriptions: ${Object.keys(mechanicsData).filter(k => mechanicsData[k].isBeginnerFriendly).length}`);

    return finalData;

  } catch (error) {
    console.error('❌ Error scraping mechanics:', error.message);
    throw error;
  }
};

function getDefaultDescription(mechanic) {
  const descriptions = {
    'Flying': 'A creature with flying can only be blocked by other creatures with flying or reach.',
    'Trample': 'If a creature with trample would deal excess combat damage, that damage is dealt to the defending player instead.',
    'First strike': 'A creature with first strike deals combat damage before creatures without first strike.',
    'Deathtouch': 'Any amount of damage dealt by a creature with deathtouch is enough to destroy another creature.',
    'Lifelink': 'Damage dealt by a creature with lifelink causes you to gain that much life.',
    'Vigilance': 'A creature with vigilance doesn\'t tap when it attacks.',
    'Haste': 'A creature with haste can attack and use tap abilities the turn it enters the battlefield.',
    'Hexproof': 'A permanent with hexproof can\'t be the target of spells or abilities your opponents control.',
    'Reach': 'A creature with reach can block creatures with flying.',
    'Menace': 'A creature with menace can only be blocked by two or more creatures.',
    'Defender': 'A creature with defender can\'t attack.',
    'Double strike': 'A creature with double strike deals both first strike and regular combat damage.',
    'Indestructible': 'A permanent with indestructible can\'t be destroyed by damage or effects that say "destroy".',
    'Flash': 'You can cast a spell with flash at instant speed.',
    'Protection': 'A creature with protection from X can\'t be damaged, enchanted, equipped, blocked, or targeted by X.',
    'Ward': 'When a permanent with ward becomes the target of a spell or ability an opponent controls, counter it unless they pay the ward cost.',
    'Cycling': 'You can pay a cycling cost and discard a card with cycling to draw a card.',
    'Landfall': 'Landfall abilities trigger whenever a land enters the battlefield under your control.',
    'Prowess': 'Whenever you cast a noncreature spell, a creature with prowess gets +1/+1 until end of turn.',
    'Scry': 'Look at the top cards of your library, put any number on the bottom and the rest on top in any order.'
  };
  return descriptions[mechanic] || `${mechanic} is a Magic: The Gathering mechanic.`;
}

function getPriorityCategory(mechanic) {
  const evergreen = ['Flying', 'Trample', 'First strike', 'Deathtouch', 'Lifelink', 'Vigilance', 'Haste', 'Hexproof', 'Reach', 'Menace', 'Defender', 'Double strike', 'Indestructible', 'Flash', 'Protection', 'Ward'];
  const combat = ['Flying', 'Trample', 'First strike', 'Deathtouch', 'Double strike', 'Reach', 'Menace', 'Defender'];
  const protection = ['Hexproof', 'Protection', 'Ward', 'Indestructible'];

  if (evergreen.includes(mechanic)) return 'evergreen';
  if (combat.includes(mechanic)) return 'combat';
  if (protection.includes(mechanic)) return 'protection';
  return 'utility';
}

function isEvergreenMechanic(mechanic) {
  const evergreen = [
    'Deathtouch', 'Defender', 'Double strike', 'First strike', 'Flash',
    'Flying', 'Haste', 'Hexproof', 'Indestructible', 'Lifelink',
    'Menace', 'Protection', 'Reach', 'Trample', 'Vigilance', 'Ward'
  ];
  return evergreen.includes(mechanic);
}

// Run if called directly
if (require.main === module) {
  scrapeMechanics()
    .then(data => {
      console.log('\n⚡ MTG Mechanics Summary:');
      console.log(`📊 Total mechanics: ${data.totalMechanics}`);
      console.log(`🌟 Evergreen mechanics: ${data.categories.evergreen.length}`);
      console.log(`👶 Beginner-friendly: ${data.categories.beginnerFriendly.length}`);
      console.log(`🎯 Priority mechanics: ${data.categories.priority.length}`);
    })
    .catch(console.error);
}

module.exports = { scrapeMechanics };

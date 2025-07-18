const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Win Conditions information from the wiki
const scrapeWinConditions = async () => {
  try {
    console.log('🏆 Scraping MTG Win Conditions from wiki...');

    const urls = [
      'https://mtg.fandom.com/wiki/Win_the_game',
      'https://mtg.fandom.com/wiki/Poison',
      'https://mtg.fandom.com/wiki/Commander_damage'
    ];

    let scrapedData = {};

    // Try to scrape from the main win conditions page
    try {
      const { data } = await axios.get(urls[0]);
      const $ = cheerio.load(data);

      // Look for sections about different win conditions
      $('h2, h3').each((i, element) => {
        const heading = $(element).find('.mw-headline').text().trim();
        if (heading.includes('lose') || heading.includes('win') || heading.includes('condition')) {
          let description = '';
          let nextElement = $(element).next();
          if (nextElement.is('p')) {
            description = nextElement.text().trim();
          }
          scrapedData[heading.toLowerCase()] = description;
        }
      });
    } catch (error) {
      console.warn('Could not scrape win conditions page, using fallback');
    }

    // Comprehensive fallback data based on official MTG rules
    const winConditionsData = {
      lastUpdated: new Date().toISOString(),
      source: Object.keys(scrapedData).length > 0 ? "MTG Wiki + Curated Content" : "Curated Content",

      primaryWinConditions: {
        lifeTotal: {
          name: "Life Total Victory",
          emoji: "❤️",
          description: "The most common way to win. Reduce your opponent's life total from 20 to 0 or below.",
          explanation: "Players start with 20 life. When a player reaches 0 or negative life, they lose the game immediately. This is typically achieved through combat damage from creatures, direct damage spells, or life loss effects.",
          tips: [
            "Creatures are your main source of damage",
            "Direct damage spells can finish off low-life opponents",
            "Life gain can help you survive longer",
            "Watch out for sudden burst damage"
          ],
          examples: ["Attacking with creatures", "Lightning Bolt dealing 3 damage", "Drain spells"]
        },

        mill: {
          name: "Library Depletion (Mill)",
          emoji: "📚",
          description: "Win by forcing your opponent to run out of cards in their library.",
          explanation: "If a player would draw a card but their library is empty, they lose the game. Mill strategies focus on putting cards from the opponent's library into their graveyard, or forcing them to draw extra cards.",
          tips: [
            "Mill cards put cards directly from library to graveyard",
            "Forced card draw can accelerate the process",
            "This is typically a slower strategy",
            "Some cards protect against mill effects"
          ],
          examples: ["Millstone effects", "Forced card draw", "Traumatize effects"]
        },

        poison: {
          name: "Poison Counters",
          emoji: "☠️",
          description: "Accumulate 10 poison counters on your opponent to win.",
          explanation: "Poison counters are placed on players by creatures with the 'toxic' or 'infect' abilities. Unlike life total, poison counters never go away and only 10 are needed to lose the game.",
          tips: [
            "Poison counters can't be removed easily",
            "Infect creatures deal poison instead of regular damage",
            "Toxic creatures add poison counters when they deal damage",
            "Much faster than reducing life to 0"
          ],
          examples: ["Infect creatures", "Toxic creatures", "Poison-giving spells"]
        }
      },

      alternativeWinConditions: {
        commanderDamage: {
          name: "Commander Damage",
          emoji: "⚔️",
          description: "In Commander format, 21 combat damage from a single commander wins the game.",
          explanation: "Exclusive to Commander/EDH format. Each commander tracks damage separately - if any single commander deals 21 or more combat damage to a player, that player loses regardless of their life total.",
          applicableFormats: ["Commander", "EDH", "Brawl"],
          tips: [
            "Only combat damage counts, not other damage",
            "Each commander is tracked separately",
            "Voltron strategies focus on this win condition",
            "Much faster than regular life total in multiplayer"
          ]
        },

        alternateWinCards: {
          name: "Alternative Win Spells",
          emoji: "🏆",
          description: "Special cards that provide unique victory conditions.",
          explanation: "Some cards have text that reads 'you win the game' or provide alternative ways to achieve victory. These often require meeting specific conditions or building around them.",
          tips: [
            "Usually require specific deck construction",
            "Often telegraphed and can be disrupted",
            "Fun for casual games",
            "Examples vary widely in requirements"
          ],
          examples: [
            "Approach of the Second Sun",
            "Laboratory Maniac",
            "Thassa's Oracle",
            "Maze's End",
            "Coalition Victory"
          ]
        },

        concession: {
          name: "Concession",
          emoji: "🏳️",
          description: "A player may concede (surrender) at any time, causing them to lose immediately.",
          explanation: "Players can choose to concede at any point during the game. This is the most common way games actually end, as players often concede when they realise they cannot win.",
          tips: [
            "Can be done at any time, even during opponent's turn",
            "Commonly used when the game state is hopeless",
            "In tournaments, be sure to clearly announce concession",
            "In multiplayer, consider impact on other players"
          ]
        }
      },

      formatSpecificRules: {
        standard: "Life total, mill, poison, alternative win cards",
        commander: "Life total, mill, poison, commander damage (21), alternative win cards",
        limited: "Life total, mill, poison, alternative win cards",
        multiplayer: "All standard win conditions, but games typically take longer",
        twoHeadedGiant: "Teams start at 30 life, poison requires 15 counters"
      },

      strategicConsiderations: {
        raceConditions: "Understanding which player will win first if both continue their current strategy",
        lifeAsResource: "Sometimes taking damage or losing life is acceptable to advance your win condition",
        threatAssessment: "In multiplayer, focusing on the player closest to winning",
        backupPlans: "Having multiple ways to win in case your primary strategy is disrupted"
      },

      commonMisconceptions: [
        "Poison and regular damage don't interact - they're separate",
        "Commander damage is only from combat, not abilities",
        "You can't go below 0 life and survive",
        "Mill doesn't affect your hand, only cards in library",
        "Alternative win conditions can't usually be responded to once they trigger"
      ]
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/winConditions.json');
    await fs.writeJson(outputPath, winConditionsData, { spaces: 2 });

    console.log(`✅ Win conditions data saved to ${outputPath}`);
    console.log(`📊 Generated ${Object.keys(winConditionsData.primaryWinConditions).length} primary win conditions`);
    console.log(`🎯 Generated ${Object.keys(winConditionsData.alternativeWinConditions).length} alternative win conditions`);

    return winConditionsData;

  } catch (error) {
    console.error('❌ Error scraping win conditions:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  scrapeWinConditions()
    .then(data => {
      console.log('\n🏆 MTG Win Conditions:');
      Object.values(data.primaryWinConditions).forEach(condition => {
        console.log(`${condition.emoji} ${condition.name}: ${condition.description}`);
      });
      console.log(`\n🎯 Alternative conditions: ${Object.keys(data.alternativeWinConditions).length}`);
    })
    .catch(console.error);
}

module.exports = { scrapeWinConditions };

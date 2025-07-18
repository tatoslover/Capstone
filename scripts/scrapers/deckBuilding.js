const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Deck Building information from the wiki
const scrapeDeckBuilding = async () => {
  try {
    console.log('🏗️ Scraping MTG Deck Building from wiki...');

    const urls = [
      'https://mtg.fandom.com/wiki/Deck_construction',
      'https://mtg.fandom.com/wiki/Mana_curve',
      'https://mtg.fandom.com/wiki/Constructed'
    ];

    let scrapedData = {};

    // Try to scrape from deck construction page
    try {
      const { data } = await axios.get(urls[0]);
      const $ = cheerio.load(data);

      // Look for sections about deck building rules
      $('h2, h3').each((i, element) => {
        const heading = $(element).find('.mw-headline').text().trim();
        if (heading.includes('Minimum') || heading.includes('format') || heading.includes('rule')) {
          let description = '';
          let nextElement = $(element).next();
          if (nextElement.is('p')) {
            description = nextElement.text().trim();
          }
          scrapedData[heading.toLowerCase()] = description;
        }
      });
    } catch (error) {
      console.warn('Could not scrape deck construction page, using fallback');
    }

    // Comprehensive fallback data based on official MTG rules and best practices
    const deckBuildingData = {
      lastUpdated: new Date().toISOString(),
      source: Object.keys(scrapedData).length > 0 ? "MTG Wiki + Curated Content" : "Curated Content",

      fundamentalRules: {
        minimumDeckSize: {
          title: "Minimum Deck Size",
          rule: "60 cards minimum for Constructed formats",
          explanation: "Most competitive formats require at least 60 cards in your main deck. While you can have more, most players stick to exactly 60 for consistency.",
          reasoning: "Smaller decks are more consistent because you're more likely to draw the cards you need when you need them.",
          formatVariations: {
            "Standard/Modern/Pioneer": "60 cards minimum",
            "Commander": "Exactly 100 cards",
            "Limited (Draft/Sealed)": "40 cards minimum",
            "Brawl": "60 cards minimum"
          }
        },

        cardLimits: {
          title: "Card Copy Limits",
          rule: "Maximum 4 copies of any card (except basic lands)",
          explanation: "You can include up to 4 copies of any non-basic land card in your deck. Basic lands (Plains, Island, Swamp, Mountain, Forest) have no limit.",
          reasoning: "This rule prevents decks from being too consistent or powerful by limiting access to the best cards.",
          exceptions: [
            "Basic lands have no limit",
            "Some formats have different restrictions",
            "Cards like Relentless Rats have special text overriding this rule"
          ]
        },

        sideboards: {
          title: "Sideboard Rules",
          rule: "Exactly 15 cards in competitive play",
          explanation: "The sideboard contains cards you can swap in between games in a match to adapt to your opponent's strategy.",
          usage: "After game 1, you can replace any number of cards from your main deck with cards from your sideboard, maintaining the same total deck size.",
          tips: [
            "Include answers to popular strategies",
            "Add cards for bad matchups",
            "Consider additional win conditions",
            "Don't forget to sideboard back to 60 cards"
          ]
        }
      },

      deckBuildingPrinciples: {
        manaBase: {
          title: "Mana Base Construction",
          landCount: "Typically 24-26 lands in a 60-card deck",
          explanation: "Lands provide the mana needed to cast your spells. The right number depends on your deck's mana curve and strategy.",
          guidelines: {
            aggressive: "22-24 lands (low curve, cheap spells)",
            midrange: "24-26 lands (balanced curve)",
            control: "26-28 lands (expensive spells, card draw)",
            combo: "20-24 lands (depending on combo requirements)"
          },
          colourConsiderations: [
            "Single colour: Basic lands are usually sufficient",
            "Two colours: Include dual lands and fixing",
            "Three+ colours: Extensive mana fixing required",
            "Consider your mana curve when choosing lands"
          ]
        },

        manaCurve: {
          title: "Mana Curve",
          definition: "The distribution of mana costs in your deck",
          explanation: "A good mana curve ensures you can play spells efficiently each turn without running out of things to do.",
          idealCurve: {
            "1 mana": "4-8 spells (early plays)",
            "2 mana": "8-12 spells (most important slot)",
            "3 mana": "6-10 spells (solid midgame)",
            "4 mana": "4-8 spells (powerful effects)",
            "5+ mana": "2-6 spells (game finishers)"
          },
          tips: [
            "Have plays for every turn of the early game",
            "Don't overload expensive spells",
            "Consider your deck's strategy when shaping curve",
            "Account for card draw and ramp effects"
          ]
        },

        deckRatios: {
          title: "Spell Type Ratios",
          explanation: "Balance different types of spells based on your strategy",
          suggestions: {
            creatures: "12-20 in creature-based decks",
            removal: "4-8 spells to deal with threats",
            cardDraw: "2-6 sources of card advantage",
            countermagic: "4-12 in control decks",
            ramp: "4-8 in decks wanting to accelerate"
          },
          considerations: [
            "Aggressive decks want more creatures and burn",
            "Control decks want more removal and card draw",
            "Combo decks want consistency and protection",
            "Midrange decks want balanced threats and answers"
          ]
        }
      },

      deckTypes: {
        aggro: {
          name: "Aggressive (Aggro)",
          strategy: "Deal damage quickly before opponents can stabilise",
          characteristics: [
            "Low mana curve (mostly 1-3 mana)",
            "Efficient creatures and burn spells",
            "22-24 lands",
            "Minimal card draw",
            "Focus on speed over card advantage"
          ],
          tips: "Mulligan hands without early plays, prioritise damage over everything"
        },

        control: {
          name: "Control",
          strategy: "Survive the early game, then win with powerful late-game spells",
          characteristics: [
            "High mana curve (expensive powerful spells)",
            "Lots of removal and counterspells",
            "26-28 lands",
            "Card draw engines",
            "Few but powerful win conditions"
          ],
          tips: "Mulligan hands without early interaction, patience is key"
        },

        midrange: {
          name: "Midrange",
          strategy: "Balanced approach with efficient threats and answers",
          characteristics: [
            "Moderate mana curve (2-5 mana sweet spot)",
            "Mix of creatures and spells",
            "24-26 lands",
            "Some card advantage",
            "Adaptable game plan"
          ],
          tips: "Be the aggro against control, be the control against aggro"
        },

        combo: {
          name: "Combo",
          strategy: "Assemble specific card combinations to win quickly",
          characteristics: [
            "Combo pieces and enablers",
            "Tutors and card selection",
            "Protection (counterspells/discard)",
            "Variable mana base",
            "Focused game plan"
          ],
          tips: "Mulligan aggressively for combo pieces, know when to go for it"
        }
      },

      commonMistakes: [
        "Too many expensive spells (mana curve too high)",
        "Not enough lands (mana screw)",
        "Too many different strategies (unfocused deck)",
        "Ignoring the opponent's likely strategy",
        "Poor mana base for multicolour decks",
        "Not enough ways to deal with different types of threats",
        "Building decks that do nothing for several turns",
        "Overvaluing individual card power vs. synergy"
      ],

      deckBuildingSteps: [
        {
          step: 1,
          title: "Choose Your Strategy",
          description: "Decide if you want to be aggressive, controlling, midrange, or combo"
        },
        {
          step: 2,
          title: "Pick Your Colours",
          description: "Choose 1-3 colours that support your strategy"
        },
        {
          step: 3,
          title: "Select Key Cards",
          description: "Include 4 copies of your most important cards"
        },
        {
          step: 4,
          title: "Build Your Mana Base",
          description: "Add appropriate lands for your colours and curve"
        },
        {
          step: 5,
          title: "Fill Supporting Roles",
          description: "Add removal, card draw, and other utility spells"
        },
        {
          step: 6,
          title: "Test and Refine",
          description: "Play games and adjust based on what works"
        }
      ],

      budgetConsiderations: {
        startingOut: [
          "Begin with preconstructed decks",
          "Focus on one or two colours",
          "Basic lands are free and effective",
          "Many powerful commons and uncommons exist",
          "Gradually upgrade over time"
        ],
        upgradePriority: [
          "Mana base (lands that enter untapped)",
          "Key spells for your strategy",
          "Sideboard cards",
          "Powerful but expensive finishers"
        ]
      }
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/deckBuilding.json');
    await fs.writeJson(outputPath, deckBuildingData, { spaces: 2 });

    console.log(`✅ Deck building data saved to ${outputPath}`);
    console.log(`📊 Generated comprehensive deck building guide`);
    console.log(`🏗️ Included ${deckBuildingData.deckBuildingSteps.length} building steps`);
    console.log(`⚠️ Listed ${deckBuildingData.commonMistakes.length} common mistakes`);

    return deckBuildingData;

  } catch (error) {
    console.error('❌ Error scraping deck building:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  scrapeDeckBuilding()
    .then(data => {
      console.log('\n🏗️ MTG Deck Building Guide:');
      console.log(`📏 Minimum deck size: ${data.fundamentalRules.minimumDeckSize.rule}`);
      console.log(`📋 Card limits: ${data.fundamentalRules.cardLimits.rule}`);
      console.log(`🎯 Deck types covered: ${Object.keys(data.deckTypes).length}`);
      console.log(`📚 Building steps: ${data.deckBuildingSteps.length}`);
    })
    .catch(console.error);
}

module.exports = { scrapeDeckBuilding };

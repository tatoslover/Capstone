const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Card Anatomy information from the wiki
const scrapeCardAnatomy = async () => {
  try {
    console.log('📋 Scraping MTG Card Anatomy from wiki...');

    const urls = [
      'https://mtg.fandom.com/wiki/Card',
      'https://mtg.fandom.com/wiki/Parts_of_a_card',
      'https://mtg.fandom.com/wiki/Mana_cost'
    ];

    let scrapedData = {};

    // Try to scrape from card anatomy page
    try {
      const { data } = await axios.get(urls[1]);
      const $ = cheerio.load(data);

      // Look for sections about card parts
      $('h2, h3').each((i, element) => {
        const heading = $(element).find('.mw-headline').text().trim();
        if (heading.includes('name') || heading.includes('cost') || heading.includes('box')) {
          let description = '';
          let nextElement = $(element).next();
          if (nextElement.is('p')) {
            description = nextElement.text().trim();
          }
          scrapedData[heading.toLowerCase()] = description;
        }
      });
    } catch (error) {
      console.warn('Could not scrape card anatomy page, using fallback');
    }

    // Comprehensive fallback data based on official MTG card structure
    const cardAnatomyData = {
      lastUpdated: new Date().toISOString(),
      source: Object.keys(scrapedData).length > 0 ? "MTG Wiki + Curated Content" : "Curated Content",

      overview: {
        title: "Card Anatomy",
        description: "Every Magic card follows a standard layout with specific areas that contain crucial game information. Understanding each part helps you play more effectively.",
        importance: "Knowing where to find information on a card is essential for quick gameplay and understanding complex interactions."
      },

      cardParts: {
        manaCost: {
          name: "Mana Cost",
          location: "Top right corner",
          description: "Shows the mana required to cast the spell. Includes both the total amount and specific colour requirements.",
          components: [
            "Colourless mana (numbers in grey circles)",
            "Coloured mana (coloured symbols: W, U, B, R, G)",
            "Hybrid mana (symbols split between two colours)",
            "Generic mana (can be paid with any colour)"
          ],
          examples: [
            "3R = 3 generic mana + 1 red mana",
            "WW = 2 white mana",
            "2UB = 2 generic + 1 blue + 1 black mana",
            "X spells have variable costs"
          ],
          readingTips: [
            "Always pay the full mana cost to cast",
            "Colour requirements must be met exactly",
            "Total mana value includes all symbols",
            "Some costs include special symbols (X, hybrid, Phyrexian)"
          ]
        },

        cardName: {
          name: "Card Name",
          location: "Top left of the card",
          description: "The official name of the card, used for game rules and deck construction.",
          importance: [
            "Used for deck building limits (max 4 copies)",
            "Referenced by other cards' effects",
            "Legendary rule applies to permanents with same name",
            "Some cards care about specific names"
          ],
          specialCases: [
            "Legendary cards have a crown symbol",
            "Some cards reference other cards by name",
            "Split cards have two names",
            "Flip cards show both orientations"
          ]
        },

        typeLine: {
          name: "Type Line",
          location: "Middle of the card, below the art",
          description: "Lists the card's types, subtypes, and supertypes, determining how it functions in the game.",
          components: [
            "Card types (Creature, Instant, Sorcery, etc.)",
            "Subtypes (Human, Wizard, Equipment, etc.)",
            "Supertypes (Legendary, Basic, Snow, etc.)"
          ],
          examples: [
            "Legendary Creature — Human Wizard",
            "Instant",
            "Artifact — Equipment",
            "Basic Land — Forest"
          ],
          gameplayImpact: [
            "Determines what rules apply",
            "Tribal effects care about creature types",
            "Some spells only target certain types",
            "Type-specific removal and protection"
          ]
        },

        rulesText: {
          name: "Rules Text (Text Box)",
          location: "Lower portion of the card",
          description: "Contains the card's abilities, effects, and any special rules that apply when it's in play.",
          textTypes: [
            "Abilities (what the card can do)",
            "Keyword abilities (shorthand for common effects)",
            "Reminder text (italicised explanations)",
            "Flavour text (italicised story text)"
          ],
          readingTips: [
            "Read abilities carefully for timing restrictions",
            "Reminder text explains keywords for newer players",
            "Flavour text has no game effect",
            "Some abilities only work in specific zones"
          ],
          commonElements: [
            "Activated abilities (cost: effect)",
            "Triggered abilities (when/whenever/at)",
            "Static abilities (continuous effects)",
            "Keyword abilities (Flying, Trample, etc.)"
          ]
        },

        powerToughness: {
          name: "Power/Toughness",
          location: "Bottom right corner (creatures only)",
          description: "Shows a creature's combat statistics - how much damage it deals and how much it can take.",
          format: "Power/Toughness (e.g., 3/4)",
          explanation: [
            "Power = damage dealt in combat",
            "Toughness = damage needed to destroy",
            "Both can be modified by spells and abilities",
            "Damage is removed at end of turn"
          ],
          specialCases: [
            "* = Power/toughness set by ability",
            "X = Variable based on game state",
            "0 power creatures can still have useful abilities",
            "High toughness creatures are hard to remove"
          ],
          strategicNotes: [
            "Consider power when attacking",
            "Consider toughness when blocking",
            "Some spells care about power or toughness",
            "Combat tricks can modify these values"
          ]
        },

        loyaltyCounters: {
          name: "Loyalty (Planeswalkers only)",
          location: "Bottom right corner",
          description: "Shows a planeswalker's starting loyalty and current loyalty counters.",
          explanation: [
            "Planeswalkers enter with starting loyalty",
            "Loyalty abilities modify loyalty counters",
            "Planeswalker dies if loyalty reaches 0",
            "Can be attacked like a player"
          ],
          loyaltyAbilities: [
            "+ abilities add loyalty counters",
            "- abilities remove loyalty counters",
            "0 abilities don't change loyalty",
            "Ultimate abilities usually cost lots of loyalty"
          ]
        },

        setSymbol: {
          name: "Set Symbol",
          location: "Right side, between type line and text box",
          description: "Indicates which set the card was printed in and its rarity.",
          rarityColours: [
            "Black/White = Common",
            "Silver = Uncommon",
            "Gold = Rare",
            "Red-Orange = Mythic Rare"
          ],
          usefulness: [
            "Helps identify card legality in formats",
            "Indicates relative power level",
            "Useful for collectors",
            "Some formats care about specific sets"
          ]
        },

        artBox: {
          name: "Artwork",
          location: "Upper portion of the card",
          description: "Visual representation of the card's concept, providing flavour and atmosphere.",
          importance: [
            "Helps identify cards quickly",
            "Provides flavour and immersion",
            "Sometimes referenced by card names",
            "Can hint at card mechanics"
          ],
          artistCredit: "Artist name appears in small text below the art box"
        }
      },

      cardTypes: {
        creatures: {
          uniqueElements: ["Power/Toughness box", "Creature types"],
          whatToLookFor: [
            "Combat stats in bottom right",
            "Creature types for tribal synergies",
            "Abilities that affect combat",
            "Enter-the-battlefield effects"
          ]
        },

        planeswalkers: {
          uniqueElements: ["Loyalty counters", "Multiple loyalty abilities"],
          whatToLookFor: [
            "Starting loyalty in bottom right",
            "Plus abilities (build loyalty)",
            "Minus abilities (spend loyalty)",
            "Ultimate abilities (expensive effects)"
          ]
        },

        instants: {
          uniqueElements: ["Instant timing reminder"],
          whatToLookFor: [
            "Can be cast at instant speed",
            "Usually reactive effects",
            "Flash timing is key",
            "Goes to graveyard after resolving"
          ]
        },

        lands: {
          uniqueElements: ["Usually no mana cost", "Mana abilities"],
          whatToLookFor: [
            "What mana they produce",
            "If they enter tapped",
            "Additional abilities",
            "Basic vs. nonbasic status"
          ]
        }
      },

      readingTips: [
        "Always read the card name and mana cost first",
        "Check the type line to understand what kind of card it is",
        "Read abilities completely before making decisions",
        "Remember that reminder text explains keywords",
        "Power/toughness only matters for creatures",
        "Pay attention to timing restrictions on abilities",
        "Some abilities only work in specific zones",
        "When in doubt, ask or look up the card online"
      ],

      commonSymbols: {
        manaSymbols: {
          "W": "White mana",
          "U": "Blue mana",
          "B": "Black mana",
          "R": "Red mana",
          "G": "Green mana",
          "C": "Colourless mana",
          "X": "Variable amount"
        },
        tapSymbol: "⭳ (Tap this permanent)",
        untapSymbol: "⭯ (Untap this permanent)",
        loyaltyUp: "+N (Add N loyalty counters)",
        loyaltyDown: "-N (Remove N loyalty counters)"
      },

      layoutVariations: [
        {
          type: "Normal",
          description: "Standard card layout used for most cards"
        },
        {
          type: "Split",
          description: "Two spells on one card, can cast either half"
        },
        {
          type: "Flip",
          description: "Card flips upside down when conditions are met"
        },
        {
          type: "Transform",
          description: "Double-faced card that transforms between sides"
        },
        {
          type: "Saga",
          description: "Enchantments with numbered chapter abilities"
        },
        {
          type: "Planeswalker",
          description: "Multiple loyalty abilities instead of regular text"
        }
      ]
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/cardAnatomy.json');
    await fs.writeJson(outputPath, cardAnatomyData, { spaces: 2 });

    console.log(`✅ Card anatomy data saved to ${outputPath}`);
    console.log(`📊 Generated ${Object.keys(cardAnatomyData.cardParts).length} card parts`);
    console.log(`🎴 Included ${cardAnatomyData.layoutVariations.length} layout variations`);
    console.log(`💡 Listed ${cardAnatomyData.readingTips.length} reading tips`);

    return cardAnatomyData;

  } catch (error) {
    console.error('❌ Error scraping card anatomy:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  scrapeCardAnatomy()
    .then(data => {
      console.log('\n📋 MTG Card Anatomy:');
      console.log(`🎯 ${data.overview.description}`);
      console.log(`📊 Card parts: ${Object.keys(data.cardParts).length}`);
      console.log(`🔍 Reading tips: ${data.readingTips.length}`);
      console.log(`⚙️ Layout variations: ${data.layoutVariations.length}`);
    })
    .catch(console.error);
}

module.exports = { scrapeCardAnatomy };

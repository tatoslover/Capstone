const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Card Type information from the wiki
const scrapeCardTypes = async () => {
  try {
    console.log('🃏 Scraping MTG Card Types from wiki...');

    const { data } = await axios.get('https://mtg.fandom.com/wiki/Card_type');
    const $ = cheerio.load(data);

    const cardTypes = {};

    // Look for sections with card type headings
    $('h2, h3').each((i, element) => {
      const heading = $(element).find('.mw-headline').text().trim();

      // Match card type names
      const typeMatch = heading.match(/^(Land|Creature|Instant|Sorcery|Artifact|Enchantment|Planeswalker|Battle|Tribal)$/i);
      if (typeMatch) {
        const typeName = typeMatch[1].toLowerCase();
        let description = '';
        let rules = '';
        let usage = '';

        // Get the next few paragraphs after this heading
        let nextElement = $(element).next();
        let paragraphCount = 0;

        while (nextElement.length && paragraphCount < 3) {
          if (nextElement.is('p')) {
            const text = nextElement.text().trim();
            if (text && text.length > 20) {
              if (paragraphCount === 0) {
                description = text;
              } else if (text.includes('rule') || text.includes('cast') || text.includes('play')) {
                rules = text;
              }
            }
            paragraphCount++;
          } else if (nextElement.is('h2, h3')) {
            break; // Stop at next heading
          }
          nextElement = nextElement.next();
        }

        // Fallback descriptions based on comprehensive MTG knowledge
        const fallbackData = {
          land: {
            description: "Lands are the foundation of your deck, providing the mana needed to cast other spells. They represent locations and sources of magical energy.",
            rules: "Lands don't use the stack and can't be responded to. You can play one land per turn during your main phase. Most lands tap for mana.",
            usage: "Essential for every deck. Provides mana to cast spells. Usually makes up about 40% of your deck.",
            timing: "Main phase only (once per turn)",
            examples: ["Basic lands (Plains, Island, Swamp, Mountain, Forest)", "Dual lands", "Utility lands"]
          },
          creature: {
            description: "Creatures are permanent spells that represent beings who fight for you. They can attack opponents and block incoming attacks.",
            rules: "Creatures enter with summoning sickness (can't attack or use tap abilities until your next turn). They have power and toughness values.",
            usage: "Your primary way to deal damage and defend yourself. Can attack opponents or block their creatures.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Creatures with abilities", "Vanilla creatures", "Legendary creatures"]
          },
          instant: {
            description: "Instants are spells that resolve immediately and then go to your graveyard. They can be cast at almost any time.",
            rules: "Can be cast at instant speed - during any player's turn, in response to other spells, or when you have priority.",
            usage: "Perfect for reactive plays, combat tricks, and responding to opponent's actions. Very flexible timing.",
            timing: "Instant speed (almost anytime)",
            examples: ["Counterspells", "Combat tricks", "Removal spells", "Card draw"]
          },
          sorcery: {
            description: "Sorceries are spells that resolve immediately but can only be cast during your main phase when nothing else is happening.",
            rules: "Can only be cast during your main phase when the stack is empty and you have priority.",
            usage: "Often more powerful than instants due to timing restrictions. Good for proactive strategies.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Board wipes", "Large effects", "Tutors", "Mass pump spells"]
          },
          artifact: {
            description: "Artifacts represent magical items, tools, or constructs. Most are colourless and can fit into any deck.",
            rules: "Most artifacts are colourless permanents. They can have activated abilities, triggered abilities, or be equipment/vehicles.",
            usage: "Versatile permanents that provide ongoing effects, mana, or utility. Can be used in any colour deck.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Equipment", "Mana rocks", "Utility artifacts", "Artifact creatures"]
          },
          enchantment: {
            description: "Enchantments represent ongoing magical effects that persist on the battlefield until removed.",
            rules: "Permanent spells that provide continuous effects. Can enchant other permanents (Auras) or exist independently.",
            usage: "Provide ongoing benefits or alter game rules. Harder to remove than creatures in most colours.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Auras (enchant other permanents)", "Global enchantments", "Enchantment creatures"]
          },
          planeswalker: {
            description: "Planeswalkers represent powerful allies who fight alongside you. They have loyalty counters and multiple abilities.",
            rules: "Enter with starting loyalty. Use loyalty abilities at sorcery speed. Can be attacked like players. Only one of each planeswalker name at a time.",
            usage: "Powerful allies that provide repeatable effects. Often become priority targets for opponents.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Loyalty abilities", "Ultimate abilities", "Passive abilities"]
          },
          battle: {
            description: "Battles represent conflicts or sieges. They enter with defense counters and can be attacked by any player.",
            rules: "Enter with defense counters. Can be attacked to remove counters. When all counters are removed, they're defeated and trigger effects.",
            usage: "Newer card type that creates interactive gameplay elements. Rewards players for attacking them.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Siege battles", "Defensive structures"]
          },
          tribal: {
            description: "Tribal spells have creature types despite not being creatures themselves. They work with tribal synergies.",
            rules: "Non-creature spells that have creature types. Count as the specified creature type for all purposes except being creatures.",
            usage: "Allows non-creature spells to benefit from tribal effects and synergies.",
            timing: "Depends on spell type (instant or sorcery)",
            examples: ["Tribal instants", "Tribal sorceries"]
          }
        };

        // Use scraped data if available, otherwise use fallback
        const typeData = fallbackData[typeName];
        if (typeData) {
          cardTypes[typeName] = {
            name: typeName.charAt(0).toUpperCase() + typeName.slice(1),
            description: description || typeData.description,
            rules: rules || typeData.rules,
            usage: usage || typeData.usage,
            timing: typeData.timing,
            examples: typeData.examples,
            icon: getTypeIcon(typeName)
          };
        }
      }
    });

    // Ensure we have all main card types
    const mainTypes = ['land', 'creature', 'instant', 'sorcery', 'artifact', 'enchantment', 'planeswalker'];
    mainTypes.forEach(type => {
      if (!cardTypes[type]) {
        const fallbackData = {
          land: {
            description: "Lands provide the mana needed to cast other spells. They represent locations and sources of magical energy.",
            rules: "Lands don't use the stack and can't be responded to. You can play one land per turn during your main phase.",
            usage: "Essential for every deck. Provides mana to cast spells.",
            timing: "Main phase only (once per turn)",
            examples: ["Basic lands", "Dual lands", "Utility lands"]
          },
          creature: {
            description: "Creatures represent beings who fight for you. They can attack opponents and block incoming attacks.",
            rules: "Creatures enter with summoning sickness. They have power and toughness values.",
            usage: "Your primary way to deal damage and defend yourself.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Combat creatures", "Utility creatures", "Legendary creatures"]
          },
          instant: {
            description: "Instants resolve immediately and can be cast at almost any time for maximum flexibility.",
            rules: "Can be cast at instant speed - during any player's turn or in response to other spells.",
            usage: "Perfect for reactive plays and combat tricks.",
            timing: "Instant speed (almost anytime)",
            examples: ["Counterspells", "Combat tricks", "Removal spells"]
          },
          sorcery: {
            description: "Sorceries resolve immediately but can only be cast during your main phase when nothing else is happening.",
            rules: "Can only be cast during your main phase when the stack is empty.",
            usage: "Often more powerful than instants due to timing restrictions.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Board wipes", "Large effects", "Tutors"]
          },
          artifact: {
            description: "Artifacts represent magical items and constructs. Most are colourless and fit into any deck.",
            rules: "Most artifacts are colourless permanents with various abilities.",
            usage: "Versatile permanents that provide ongoing effects or utility.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Equipment", "Mana rocks", "Utility artifacts"]
          },
          enchantment: {
            description: "Enchantments represent ongoing magical effects that persist until removed.",
            rules: "Permanent spells that provide continuous effects.",
            usage: "Provide ongoing benefits or alter game rules.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Auras", "Global enchantments", "Ongoing effects"]
          },
          planeswalker: {
            description: "Planeswalkers represent powerful allies with loyalty counters and multiple abilities.",
            rules: "Enter with starting loyalty. Use loyalty abilities at sorcery speed. Can be attacked.",
            usage: "Powerful allies that provide repeatable effects.",
            timing: "Main phase only (sorcery speed)",
            examples: ["Loyalty abilities", "Ultimate abilities"]
          }
        };

        const typeData = fallbackData[type];
        cardTypes[type] = {
          name: type.charAt(0).toUpperCase() + type.slice(1),
          description: typeData.description,
          rules: typeData.rules,
          usage: typeData.usage,
          timing: typeData.timing,
          examples: typeData.examples,
          icon: getTypeIcon(type)
        };
      }
    });

    // Save the data
    const outputPath = path.join(__dirname, '../data/cardTypes.json');
    await fs.writeJson(outputPath, cardTypes, { spaces: 2 });

    console.log(`✅ Card types data saved to ${outputPath}`);
    console.log(`📊 Scraped ${Object.keys(cardTypes).length} card types`);

    return cardTypes;

  } catch (error) {
    console.error('❌ Error scraping card types:', error.message);
    throw error;
  }
};

function getTypeIcon(type) {
  const icons = {
    land: '🏔️',
    creature: '👹',
    instant: '⚡',
    sorcery: '🔮',
    artifact: '⚙️',
    enchantment: '✨',
    planeswalker: '👑',
    battle: '⚔️',
    tribal: '🏛️'
  };
  return icons[type] || '🃏';
}

// Run if called directly
if (require.main === module) {
  scrapeCardTypes()
    .then(types => {
      console.log('\n🃏 MTG Card Types:');
      Object.values(types).forEach(type => {
        console.log(`${type.icon} ${type.name}: ${type.description.substring(0, 80)}...`);
      });
    })
    .catch(console.error);
}

module.exports = { scrapeCardTypes };

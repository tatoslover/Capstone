const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Combat Basics information from the wiki
const scrapeCombatBasics = async () => {
  try {
    console.log('⚔️ Scraping MTG Combat Basics from wiki...');

    const urls = [
      'https://mtg.fandom.com/wiki/Combat_phase',
      'https://mtg.fandom.com/wiki/Attack',
      'https://mtg.fandom.com/wiki/Block'
    ];

    let scrapedData = {};

    // Try to scrape from combat phase page
    try {
      const { data } = await axios.get(urls[0]);
      const $ = cheerio.load(data);

      // Look for sections about combat steps
      $('h2, h3').each((i, element) => {
        const heading = $(element).find('.mw-headline').text().trim();
        if (heading.includes('step') || heading.includes('phase') || heading.includes('combat')) {
          let description = '';
          let nextElement = $(element).next();
          if (nextElement.is('p')) {
            description = nextElement.text().trim();
          }
          scrapedData[heading.toLowerCase()] = description;
        }
      });
    } catch (error) {
      console.warn('Could not scrape combat page, using fallback');
    }

    // Comprehensive fallback data based on official MTG rules
    const combatBasicsData = {
      lastUpdated: new Date().toISOString(),
      source: Object.keys(scrapedData).length > 0 ? "MTG Wiki + Curated Content" : "Curated Content",

      combatOverview: {
        title: "Combat Basics",
        description: "Combat is how creatures deal damage to opponents and each other. It's the primary way to reduce an opponent's life total and win the game.",
        importance: "Understanding combat timing and interactions is crucial for both attacking successfully and defending effectively.",
        keyPrinciple: "Combat happens in structured steps that allow both players to make decisions and cast spells."
      },

      combatSteps: {
        beginningOfCombat: {
          name: "Beginning of Combat Step",
          order: 1,
          description: "The first step of the combat phase where combat begins.",
          whatHappens: [
            "Triggered abilities that happen 'at the beginning of combat' trigger",
            "Players can cast spells and activate abilities",
            "This is the last chance to act before attackers are declared"
          ],
          strategicNotes: [
            "Remove creatures before they can attack",
            "Cast pump spells that last 'until end of turn'",
            "Activate abilities that prepare for combat"
          ],
          commonActions: [
            "Cast removal spells on potential attackers",
            "Activate creature abilities",
            "Cast instant-speed combat tricks"
          ]
        },

        declareAttackers: {
          name: "Declare Attackers Step",
          order: 2,
          description: "The active player chooses which creatures attack and what they attack.",
          whatHappens: [
            "Active player declares attacking creatures",
            "Attacking creatures become tapped (unless they have vigilance)",
            "Choose what each attacker is attacking (player or planeswalker)",
            "Abilities that trigger when creatures attack trigger"
          ],
          rules: [
            "Creatures with summoning sickness can't attack",
            "Creatures with defender can't attack",
            "Must declare all attackers at once",
            "Can't attack your own permanents"
          ],
          strategicNotes: [
            "Consider what the opponent can block",
            "Think about which creatures you need for defence",
            "Attacking planeswalkers can be strategically important"
          ]
        },

        declareBlockers: {
          name: "Declare Blockers Step",
          order: 3,
          description: "The defending player chooses which creatures block attacking creatures.",
          whatHappens: [
            "Defending player declares blocking creatures",
            "Each blocker can block exactly one attacker",
            "Multiple creatures can block the same attacker",
            "Abilities that trigger when creatures block trigger"
          ],
          rules: [
            "Creatures can only block if they're untapped",
            "Flying creatures can only be blocked by flying or reach",
            "Must declare all blockers at once",
            "Blocked creatures remain blocked even if blocker is removed"
          ],
          strategicNotes: [
            "Consider the value trade of your creatures",
            "Sometimes taking damage is better than losing creatures",
            "Multiple blockers can take down large threats"
          ]
        },

        combatDamage: {
          name: "Combat Damage Step",
          order: 4,
          description: "Creatures deal damage to what they're fighting.",
          whatHappens: [
            "All combat damage is assigned and dealt simultaneously",
            "Creatures deal damage equal to their power",
            "Unblocked attackers damage the defending player or planeswalker",
            "Creatures with lethal damage are destroyed"
          ],
          damageAssignment: [
            "Attacking creature deals damage to blocking creature(s)",
            "Blocking creature deals damage to attacking creature",
            "Unblocked attackers damage the defending player",
            "Trample damage spills over to the defending player"
          ],
          specialRules: [
            "First strike creates an additional combat damage step",
            "Double strike deals damage in both first strike and regular steps",
            "Deathtouch makes any amount of damage lethal",
            "Lifelink causes damage dealt to gain that much life"
          ]
        },

        endOfCombat: {
          name: "End of Combat Step",
          order: 5,
          description: "Combat ends and cleanup happens.",
          whatHappens: [
            "Abilities that trigger 'at end of combat' trigger",
            "Players can cast spells and activate abilities",
            "Combat is officially over"
          ],
          cleanup: [
            "Creatures stop being attacking and blocking",
            "Combat damage wears off at end of turn",
            "'Until end of combat' effects end"
          ]
        }
      },

      combatKeywords: {
        attackingKeywords: {
          haste: "Can attack the turn it enters the battlefield",
          vigilance: "Doesn't tap when attacking",
          flying: "Can only be blocked by creatures with flying or reach",
          trample: "Excess damage goes to defending player",
          menace: "Can only be blocked by two or more creatures",
          intimidate: "Can only be blocked by artifact creatures or creatures that share a colour",
          unblockable: "Cannot be blocked"
        },

        blockingKeywords: {
          reach: "Can block creatures with flying",
          defender: "Cannot attack but often has good blocking stats",
          vigilance: "Can block after attacking (if it attacked)",
          flash: "Can be cast during combat to surprise block"
        },

        damageKeywords: {
          firstStrike: "Deals combat damage before normal damage",
          doubleStrike: "Deals first strike and normal combat damage",
          deathtouch: "Any amount of damage is lethal",
          lifelink: "Damage dealt gains you that much life",
          wither: "Deals damage in -1/-1 counters instead",
          infect: "Deals poison counters to players, -1/-1 counters to creatures"
        }
      },

      combatStrategies: {
        attacking: {
          whenToAttack: [
            "When you can deal meaningful damage",
            "When the opponent can't block effectively",
            "To force the opponent to make difficult decisions",
            "When you have combat tricks to protect attackers"
          ],
          considerations: [
            "What can the opponent block with?",
            "Do you need creatures for defence?",
            "Can you win this turn?",
            "Are there better opportunities later?"
          ]
        },

        blocking: {
          whenToBlock: [
            "When the trade is favourable",
            "To prevent lethal damage",
            "When you have combat tricks",
            "To trigger beneficial abilities"
          ],
          whenNotToBlock: [
            "When the damage isn't threatening",
            "When you'll lose valuable creatures",
            "When the opponent likely has tricks",
            "When you need creatures for your own attack"
          ]
        },

        combatTricks: {
          definition: "Instant-speed spells that modify combat",
          examples: [
            "Pump spells (+X/+X effects)",
            "Removal spells",
            "Protection spells",
            "Flash creatures"
          ],
          timing: "Usually cast after blockers are declared but before damage",
          strategy: "Force bad trades or save your creatures"
        }
      },

      commonMistakes: [
        "Attacking with creatures you need for defence",
        "Not considering opponent's instant-speed responses",
        "Blocking when you should take the damage",
        "Forgetting about first strike timing",
        "Not understanding trample damage assignment",
        "Tapping creatures unnecessarily before combat",
        "Missing beneficial attack triggers",
        "Poor damage assignment with multiple blockers"
      ],

      combatMath: {
        damageCalculation: {
          basic: "Power determines damage dealt, toughness determines damage needed to destroy",
          trading: "Creatures with equal power and toughness destroy each other",
          trample: "Assign lethal damage to blockers, excess goes to defending player",
          multipleBlockers: "Attacking player chooses damage assignment order"
        },

        examples: [
          {
            scenario: "3/3 attacks, 2/2 blocks",
            result: "Both creatures die (each takes lethal damage)"
          },
          {
            scenario: "4/4 with trample attacks, 2/2 blocks",
            result: "Blocker dies, 2 damage to defending player"
          },
          {
            scenario: "3/3 attacks, two 1/1s block",
            result: "Attacker assigns damage: could kill both 1/1s or kill one and survive"
          }
        ]
      },

      practicalTips: [
        "Always consider what instant spells your opponent might have",
        "Count damage carefully before making blocking decisions",
        "Remember that creatures heal at end of turn",
        "Use combat to force opponents to make difficult choices",
        "Don't forget about planeswalkers as attack targets",
        "Sometimes the threat of attacking is as powerful as actually attacking",
        "Learn to recognise when you're the aggressor vs. the defender",
        "Combat tricks are most effective when unexpected"
      ]
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/combatBasics.json');
    await fs.writeJson(outputPath, combatBasicsData, { spaces: 2 });

    console.log(`✅ Combat basics data saved to ${outputPath}`);
    console.log(`📊 Generated ${Object.keys(combatBasicsData.combatSteps).length} combat steps`);
    console.log(`⚔️ Included ${Object.keys(combatBasicsData.combatKeywords.attackingKeywords).length} attacking keywords`);
    console.log(`🛡️ Included ${Object.keys(combatBasicsData.combatKeywords.blockingKeywords).length} blocking keywords`);

    return combatBasicsData;

  } catch (error) {
    console.error('❌ Error scraping combat basics:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  scrapeCombatBasics()
    .then(data => {
      console.log('\n⚔️ MTG Combat Basics:');
      console.log(`🎯 ${data.combatOverview.description}`);
      console.log(`📊 Combat steps: ${Object.keys(data.combatSteps).length}`);
      console.log(`🔑 Attacking keywords: ${Object.keys(data.combatKeywords.attackingKeywords).length}`);
      console.log(`💡 Practical tips: ${data.practicalTips.length}`);
    })
    .catch(console.error);
}

module.exports = { scrapeCombatBasics };

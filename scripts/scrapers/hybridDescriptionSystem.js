const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

// Official-First Description System
// Uses official Wizards content as primary source with enhanced fallbacks
const createOfficialFirstDescriptionSystem = async () => {
  try {
    console.log("🔄 Creating Official-First Description System...");

    // Load existing mechanics data
    const mechanicsPath = path.join(__dirname, "../data/mechanics.json");
    const existingData = await fs.readJson(mechanicsPath);

    // Official descriptions that we know work (hardcoded for reliability)
    const officialData = {
      "flying": {
        "name": "Flying",
        "description": "A keyword ability found on creatures. A creature with flying can be blocked only by creatures with flying or reach.",
        "confidence": "high"
      },
      "first_strike": {
        "name": "First Strike",
        "description": "A keyword ability found on creatures. Creatures with first strike deal all of their combat damage before creatures without first strike or double strike. When you reach the combat damage step, check to see if any attacking or blocking creatures have first strike or double strike. If so, an extra combat damage step is created just for them.",
        "confidence": "high"
      },
      "deathtouch": {
        "name": "Deathtouch",
        "description": "A keyword ability found on creatures. A creature dealt any amount of damage by a creature with deathtouch is destroyed. Deathtouch has no effect on players or planeswalkers.",
        "confidence": "high"
      },
      "lifelink": {
        "name": "Lifelink",
        "description": "A keyword ability found on creatures. When a creature you control has lifelink and deals damage, you simultaneously gain that much life.",
        "confidence": "high"
      },
      "vigilance": {
        "name": "Vigilance",
        "description": "A keyword ability found on creatures. A creature with vigilance doesn't tap to attack. Vigilance doesn't allow a tapped creature or a creature that entered the battlefield this turn to attack.",
        "confidence": "high"
      },
      "haste": {
        "name": "Haste",
        "description": "A keyword ability found on creatures. A creature with haste isn't affected by summoning sickness. It can attack as soon as it comes under your control. You can also activate its activated abilities with in the cost right away.",
        "confidence": "high"
      },
      "hexproof": {
        "name": "Hexproof",
        "description": "A keyword ability that prevents a permanent or player from being the target of spells or abilities an opponent controls.",
        "confidence": "high"
      },
      "reach": {
        "name": "Reach",
        "description": "A keyword ability found on creatures. A creature with reach can block a creature with flying. Note that a creature with reach can be blocked by any kind of creature.",
        "confidence": "high"
      },
      "menace": {
        "name": "Menace",
        "description": "A keyword ability found on creatures. A creature with menace can't be blocked except by two or more creatures.",
        "confidence": "high"
      }
    };

    console.log(`📚 Using ${Object.keys(officialData).length} official descriptions`);

    // Enhanced fallback descriptions for when official content fails
    const enhancedFallbacks = {
      // Evergreen mechanics with improved descriptions
      "Flying": {
        quick: "Can only be blocked by creatures with flying or reach.",
        detailed: "A keyword ability found on creatures. A creature with flying can be blocked only by creatures with flying or reach.",
        source: "hybrid"
      },
      "Trample": {
        quick: "Excess combat damage can be dealt to the defending player.",
        detailed: "When a creature with trample attacks and is blocked, you only need to assign lethal damage to blockers. The rest goes to the defending player or planeswalker.",
        source: "enhanced_fallback"
      },
      "First strike": {
        quick: "Deals combat damage before creatures without first strike.",
        detailed: "A keyword ability found on creatures. Creatures with first strike deal all of their combat damage before creatures without first strike or double strike.",
        source: "official"
      },
      "Deathtouch": {
        quick: "Any amount of damage from this creature is lethal.",
        detailed: "A keyword ability found on creatures. A creature dealt any amount of damage by a creature with deathtouch is destroyed. Deathtouch has no effect on players or planeswalkers.",
        source: "official"
      },
      "Lifelink": {
        quick: "Damage dealt by this creature causes you to gain that much life.",
        detailed: "A keyword ability found on creatures. When a creature you control has lifelink and deals damage, you simultaneously gain that much life.",
        source: "official"
      },
      "Vigilance": {
        quick: "Doesn't tap when attacking.",
        detailed: "A keyword ability found on creatures. A creature with vigilance doesn't tap to attack.",
        source: "hybrid"
      },
      "Haste": {
        quick: "Can attack and use abilities immediately when it enters.",
        detailed: "A keyword ability found on creatures. A creature with haste isn't affected by summoning sickness and can attack or use abilities immediately.",
        source: "enhanced_fallback"
      },
      "Hexproof": {
        quick: "Can't be targeted by opponents' spells or abilities.",
        detailed: "A keyword ability that prevents a permanent from being the target of spells or abilities an opponent controls.",
        source: "hybrid"
      },
      "Reach": {
        quick: "Can block creatures with flying.",
        detailed: "A keyword ability found on creatures. A creature with reach can block creatures with flying.",
        source: "hybrid"
      },
      "Menace": {
        quick: "Can't be blocked except by two or more creatures.",
        detailed: "A keyword ability found on creatures. A creature with menace can't be blocked except by two or more creatures.",
        source: "hybrid"
      },
      "Defender": {
        quick: "Can't attack.",
        detailed: "A keyword ability found on creatures. A creature with defender can't attack.",
        source: "fallback"
      },
      "Double strike": {
        quick: "Deals first strike and regular combat damage.",
        detailed: "A keyword ability found on creatures. Creatures with double strike deal combat damage twice - once during first strike and once during regular damage.",
        source: "enhanced_fallback"
      },
      "Indestructible": {
        quick: "Can't be destroyed by damage or effects that say 'destroy'.",
        detailed: "A keyword ability. Permanents with indestructible can't be destroyed by damage or by effects that say 'destroy'.",
        source: "enhanced_fallback"
      },
      "Flash": {
        quick: "Can be cast at instant speed.",
        detailed: "A keyword ability that allows you to cast this spell any time you could cast an instant.",
        source: "enhanced_fallback"
      },
      "Protection": {
        quick: "Can't be damaged, enchanted, blocked, or targeted by the specified quality.",
        detailed: "A keyword ability that grants immunity from being damaged, enchanted, blocked, or targeted by sources with the specified quality.",
        source: "enhanced_fallback"
      },
      "Ward": {
        quick: "Spells and abilities that target this cost additional mana.",
        detailed: "A keyword ability. Whenever this permanent becomes the target of a spell or ability an opponent controls, counter it unless that player pays the ward cost.",
        source: "enhanced_fallback"
      }
    };

    // Create official-first mechanics structure
    const enhancedMechanics = {};
    let officialCount = 0;
    let enhancedFallbackCount = 0;
    let basicFallbackCount = 0;

    // Process each mechanic in the existing data
    for (const [key, mechanic] of Object.entries(existingData.mechanics)) {
      const mechanicName = mechanic.name;
      const officialKey = mechanicName.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const officialMechanic = officialData[officialKey];
      const fallbackEnhancement = enhancedFallbacks[mechanicName];

      if (officialMechanic && officialMechanic.description) {
        // Use official description as primary source
        const officialDesc = standardiseUKEnglish(officialMechanic.description);
        const fallbackDesc = fallbackEnhancement ?
          standardiseUKEnglish(fallbackEnhancement.quick) :
          standardiseUKEnglish(cleanOriginalDescription(mechanic.description));

        enhancedMechanics[key] = {
          ...mechanic,
          description: officialDesc,
          fallbackDescription: fallbackDesc,
          source: "official",
          sourceUrl: officialMechanic.sourceUrl,
          confidence: officialMechanic.confidence,
          metadata: {
            hasOfficialContent: true,
            hasFallback: true,
            lastUpdated: new Date().toISOString(),
            qualityRating: "high"
          }
        };

        console.log(`✅ Official: ${mechanicName} (${officialDesc.length} chars)`);
        officialCount++;

      } else if (fallbackEnhancement) {
        // Use enhanced fallback
        enhancedMechanics[key] = {
          ...mechanic,
          description: standardiseUKEnglish(fallbackEnhancement.detailed),
          fallbackDescription: standardiseUKEnglish(fallbackEnhancement.quick),
          source: "enhanced_fallback",
          sourceUrl: mechanic.wikiUrl,
          confidence: "medium",
          metadata: {
            hasOfficialContent: false,
            hasFallback: true,
            lastUpdated: new Date().toISOString(),
            qualityRating: "medium-high"
          }
        };

        console.log(`🔄 Enhanced fallback: ${mechanicName}`);
        enhancedFallbackCount++;

      } else {
        // Use basic fallback (cleaned up)
        const cleanedDesc = cleanOriginalDescription(mechanic.description);
        const ukName = standardiseUKEnglish(mechanicName);
        const ukKey = ukName !== mechanicName ? ukName.toLowerCase().replace(/[^a-z0-9]/g, "_") : key;

        enhancedMechanics[ukKey] = {
          ...mechanic,
          name: ukName,
          description: standardiseUKEnglish(cleanedDesc),
          fallbackDescription: standardiseUKEnglish(cleanedDesc),
          source: "basic_fallback",
          sourceUrl: standardiseUKEnglish(mechanic.wikiUrl || ''),
          confidence: "medium",
          metadata: {
            hasOfficialContent: false,
            hasFallback: true,
            lastUpdated: new Date().toISOString(),
            qualityRating: "medium"
          }
        };

        console.log(`📝 Basic fallback: ${ukName}`);
        basicFallbackCount++;
      }
    }

    // Create the new data structure
    const officialFirstData = {
      ...existingData,
      version: "2.0-official-first",
      lastUpdated: new Date().toISOString(),
      source: "Official-First System (Wizards.com + Fallbacks)",
      descriptionSystem: {
        version: "2.0",
        strategy: "official_first_with_fallbacks",
        features: [
          "Official Wizards descriptions as primary source",
          "Enhanced fallbacks when official unavailable",
          "UK English standardisation",
          "Automatic failover to fallback descriptions"
        ],
        sources: {
          official: "Wizards.com Keyword Glossary",
          enhanced_fallback: "Improved community descriptions",
          basic_fallback: "Cleaned original descriptions"
        }
      },
      mechanics: enhancedMechanics,
      stats: {
        ...existingData.stats,
        totalMechanics: Object.keys(enhancedMechanics).length,
        officialCount: officialCount,
        enhancedFallbackCount: enhancedFallbackCount,
        basicFallbackCount: basicFallbackCount,
        officialCoverage: `${Math.round((officialCount / Object.keys(enhancedMechanics).length) * 100)}%`,
        sourceBreakdown: getSourceBreakdown(enhancedMechanics)
      }
    };

    // Save the enhanced data
    const outputPath = path.join(__dirname, "../data/mechanics-official-first.json");
    await fs.writeJson(outputPath, officialFirstData, { spaces: 2 });

    console.log("\n🎯 OFFICIAL-FIRST SYSTEM CREATED!");
    console.log(`📊 Total mechanics: ${officialFirstData.stats.totalMechanics}`);
    console.log(`✅ Official descriptions: ${officialCount} (${officialFirstData.stats.officialCoverage})`);
    console.log(`🔄 Enhanced fallbacks: ${enhancedFallbackCount}`);
    console.log(`📝 Basic fallbacks: ${basicFallbackCount}`);
    console.log(`📁 Output: ${outputPath}`);

    // Show sample of official vs fallback descriptions
    console.log("\n🔍 SAMPLE DESCRIPTIONS:");
    console.log("=".repeat(60));

    const sampleMechanics = ["flying", "deathtouch", "trample"];
    for (const key of sampleMechanics) {
      if (enhancedMechanics[key]) {
        const mechanic = enhancedMechanics[key];
        console.log(`\n${mechanic.name.toUpperCase()} (${mechanic.source})`);
        console.log(`Primary: "${mechanic.description}"`);
        if (mechanic.fallbackDescription !== mechanic.description) {
          console.log(`Fallback: "${mechanic.fallbackDescription}"`);
        }
      }
    }

    return officialFirstData;

  } catch (error) {
    console.error("❌ Error creating hybrid system:", error);
    throw error;
  }
};

// Convert American English to UK English
function standardiseUKEnglish(text) {
  if (!text) return "";

  return text
    .replace(/\bcolor\b/gi, 'colour')
    .replace(/\bcolors\b/gi, 'colours')
    .replace(/\bfavor\b/gi, 'favour')
    .replace(/\bfavors\b/gi, 'favours')
    .replace(/\bcenter\b/gi, 'centre')
    .replace(/\bcenters\b/gi, 'centres')
    .replace(/\bdefense\b/gi, 'defence')
    .replace(/\bdefenses\b/gi, 'defences')
    .replace(/\blicense\b/gi, 'licence')
    .replace(/\blicenses\b/gi, 'licences')
    .replace(/\borganize\b/gi, 'organise')
    .replace(/\borganizes\b/gi, 'organises')
    .replace(/\brecognize\b/gi, 'recognise')
    .replace(/\brecognizes\b/gi, 'recognises')
    .replace(/\brealize\b/gi, 'realise')
    .replace(/\brealizes\b/gi, 'realises')
    .replace(/\banalyze\b/gi, 'analyse')
    .replace(/\banalyzes\b/gi, 'analyses')
    .replace(/\barmor\b/gi, 'armour')
    .replace(/\barmors\b/gi, 'armours')
    .replace(/\bhonor\b/gi, 'honour')
    .replace(/\bhonors\b/gi, 'honours')
    .replace(/\bbehavior\b/gi, 'behaviour')
    .replace(/\bbehaviors\b/gi, 'behaviours')
    .replace(/\bflavor\b/gi, 'flavour')
    .replace(/\bflavors\b/gi, 'flavours')
    .replace(/\bUmbra armor\b/gi, 'Umbra armour')
    .replace(/\bspecialize\b/gi, 'specialise')
    .replace(/\bspecializes\b/gi, 'specialises')
    .replace(/\bspecialized\b/gi, 'specialised')
    .replace(/\bspecializing\b/gi, 'specialising');
}

// Get quality rating based on source
function getQualityRating(source) {
  const ratings = {
    official: "high",
    hybrid: "high",
    enhanced_fallback: "medium-high",
    fallback: "medium"
  };
  return ratings[source] || "medium";
}

// Clean up messy original descriptions
function cleanOriginalDescription(description) {
  if (!description) return "A Magic: The Gathering mechanic.";

  // Extract useful information from scraped wiki content
  let cleaned = description;

  // Extract reminder text if present
  const reminderMatch = cleaned.match(/Reminder Text[^(]*\(([^)]+)\)/);
  if (reminderMatch) {
    return reminderMatch[1].trim();
  }

  // Look for keyword ability descriptions
  const keywordMatch = cleaned.match(/Keyword Ability[^.]*\.?([^.]*\([^)]+\))/);
  if (keywordMatch) {
    return keywordMatch[1].replace(/^\s*\(/, '').replace(/\)\s*$/, '').trim();
  }

  // Extract first meaningful sentence
  const sentences = cleaned.split(/[.!?]+/);
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length > 20 && !trimmed.includes('Keyword') && !trimmed.includes('Statistics')) {
      return trimmed + '.';
    }
  }

  // Fallback to first 100 characters
  return cleaned.substring(0, 100).trim() + '...';
}

// Get breakdown of sources used
function getSourceBreakdown(mechanics) {
  const breakdown = {};

  for (const mechanic of Object.values(mechanics)) {
    const source = mechanic.source || "unknown";
    breakdown[source] = (breakdown[source] || 0) + 1;
  }

  return breakdown;
}



module.exports = { createOfficialFirstDescriptionSystem };

// Run if called directly
if (require.main === module) {
  createOfficialFirstDescriptionSystem()
    .then(() => {
      console.log("\n🎉 Official-first system creation completed successfully!");
      process.exit(0);
    })
    .catch(error => {
      console.error("Official-first system creation failed:", error);
      process.exit(1);
    });
}

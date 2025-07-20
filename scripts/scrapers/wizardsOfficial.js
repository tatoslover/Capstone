const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

// Wizards.com Official Content Scraper for Mechanics Descriptions
const scrapeWizardsOfficial = async (testLimit = 5) => {
  try {
    console.log("🧙 Scraping Official Wizards Content...");
    console.log(`🔬 Testing with ${testLimit} mechanics to see data quality`);

    // Test mechanics - focus on well-known ones for reliable data
    const testMechanics = [
      "Flying",
      "Trample",
      "First Strike",
      "Deathtouch",
      "Lifelink",
      "Vigilance",
      "Haste",
      "Hexproof",
      "Reach",
      "Menace"
    ].slice(0, testLimit);

    const mechanicsData = {};
    let successCount = 0;
    let errorCount = 0;

    console.log("📚 Attempting to scrape from official Wizards resources...");

    for (const mechanic of testMechanics) {
      try {
        console.log(`🔍 Testing: ${mechanic}`);

        const mechanicData = await scrapeFromOfficialSources(mechanic);

        if (mechanicData && mechanicData.description) {
          mechanicsData[mechanic.toLowerCase().replace(/[^a-z0-9]/g, "_")] = {
            name: mechanic,
            description: mechanicData.description,
            source: mechanicData.source,
            sourceUrl: mechanicData.sourceUrl,
            confidence: mechanicData.confidence || 'medium',
            timestamp: new Date().toISOString()
          };

          console.log(`✅ Found official description for ${mechanic}`);
          console.log(`📝 Description: ${mechanicData.description.substring(0, 100)}...`);
          console.log(`🔗 Source: ${mechanicData.source}`);
          console.log(`📊 Confidence: ${mechanicData.confidence}`);
          console.log("---");

          successCount++;
        } else {
          console.log(`❌ No official description found for ${mechanic}`);
          errorCount++;
        }

        // Rate limiting - be respectful to Wizards' servers
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.warn(`⚠️  Error scraping ${mechanic}:`, error.message);
        errorCount++;
      }
    }

    // Create test results structure
    const testResults = {
      testInfo: {
        timestamp: new Date().toISOString(),
        testMechanics: testMechanics,
        totalTested: testMechanics.length,
        successCount: successCount,
        errorCount: errorCount,
        successRate: `${Math.round((successCount / testMechanics.length) * 100)}%`
      },
      scrapedData: mechanicsData,
      dataQuality: analyseDataQuality(mechanicsData),
      recommendations: generateRecommendations(mechanicsData, successCount, errorCount)
    };

    // Save test results
    const outputPath = path.join(__dirname, "../data/wizards-test-results.json");
    await fs.writeJson(outputPath, testResults, { spaces: 2 });

    console.log("\n🎯 TEST RESULTS SUMMARY:");
    console.log(`📊 Success Rate: ${testResults.testInfo.successRate}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`💾 Results saved to: ${outputPath}`);

    return testResults;

  } catch (error) {
    console.error("❌ Error in Wizards official scraper:", error);
    throw error;
  }
};

// Try multiple official Wizards sources for mechanic descriptions
async function scrapeFromOfficialSources(mechanicName) {
  const sources = [
    {
      name: "Wizards Keyword Glossary",
      baseUrl: "https://magic.wizards.com/en/keyword-glossary",
      scraper: scrapeFromKeywordGlossary
    },
    {
      name: "Wizards How to Play",
      baseUrl: "https://magic.wizards.com/en/how-to-play",
      scraper: scrapeFromHowToPlay
    },
    {
      name: "Wizards Rules Reference",
      baseUrl: "https://magic.wizards.com/en/rules",
      scraper: scrapeFromRulesReference
    }
  ];

  for (const source of sources) {
    try {
      console.log(`  🌐 Trying ${source.name}...`);
      const result = await source.scraper(mechanicName, source.baseUrl);

      if (result && result.description && result.description.length > 20) {
        return {
          ...result,
          source: source.name,
          sourceUrl: result.sourceUrl || source.baseUrl
        };
      }
    } catch (error) {
      console.log(`    ❌ ${source.name} failed: ${error.message}`);
      continue;
    }
  }

  return null;
}

// Scrape from Wizards Keyword Glossary (primary source)
async function scrapeFromKeywordGlossary(mechanicName, baseUrl) {
  try {
    const response = await axios.get(baseUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MTG-Educational-Tool/1.0)'
      }
    });

    const $ = cheerio.load(response.data);

    // Look for the specific mechanic in the glossary
    let description = null;
    let confidence = 'low';
    const mechanicLower = mechanicName.toLowerCase();

    // The glossary uses headings and text blocks for each term
    $('h3, h4, h2').each((i, element) => {
      const headingText = $(element).text().toLowerCase().trim();

      if (headingText === mechanicLower || headingText.includes(mechanicLower)) {
        // Found a matching heading, now get the description
        let nextElement = $(element).next();

        // Look through following elements for description
        while (nextElement.length > 0) {
          const text = nextElement.text().trim();

          // If we hit another heading, stop
          if (nextElement.is('h1, h2, h3, h4, h5, h6')) {
            break;
          }

          // If we find a good description paragraph
          if (text.length > 30 && text.length < 500) {
            description = text;
            confidence = 'high';
            break;
          }

          nextElement = nextElement.next();
        }

        if (description) {
          return false; // Break the each loop
        }
      }
    });

    // Also try searching in paragraph text directly
    if (!description) {
      $('p').each((i, element) => {
        const text = $(element).text();

        if (text.toLowerCase().includes(mechanicLower) &&
            text.length > 50 && text.length < 400) {

          // Check if this looks like a definition
          const sentences = text.split(/[.!?]+/);
          for (const sentence of sentences) {
            if (sentence.toLowerCase().includes(mechanicLower) &&
                sentence.length > 30) {
              description = sentence.trim() + '.';
              confidence = 'medium';
              break;
            }
          }

          if (description) {
            return false; // Break the each loop
          }
        }
      });
    }

    if (description) {
      return {
        description: cleanDescription(description),
        confidence: confidence,
        sourceUrl: baseUrl
      };
    }

    return null;

  } catch (error) {
    throw new Error(`Keyword Glossary scraping failed: ${error.message}`);
  }
}

// Scrape from Wizards How to Play section
async function scrapeFromHowToPlay(mechanicName, baseUrl) {
  try {
    const response = await axios.get(baseUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MTG-Educational-Tool/1.0)'
      }
    });

    const $ = cheerio.load(response.data);

    // Look for keyword ability explanations
    let description = null;
    let confidence = 'low';

    // Try to find the mechanic in various sections
    $('p, div, section').each((i, element) => {
      const text = $(element).text().toLowerCase();
      const mechanicLower = mechanicName.toLowerCase();

      if (text.includes(mechanicLower)) {
        const fullText = $(element).text().trim();

        // Look for explanatory sentences
        const sentences = fullText.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (sentence.toLowerCase().includes(mechanicLower) &&
              sentence.length > 30 &&
              sentence.length < 200) {
            description = sentence.trim() + '.';
            confidence = 'high';
            break;
          }
        }
      }
    });

    if (description) {
      return {
        description: cleanDescription(description),
        confidence: confidence,
        sourceUrl: baseUrl
      };
    }

    return null;

  } catch (error) {
    throw new Error(`How to Play scraping failed: ${error.message}`);
  }
}

// Scrape from Wizards Rules Reference
async function scrapeFromRulesReference(mechanicName, baseUrl) {
  try {
    // Try to access comprehensive rules or rules summaries
    const rulesUrl = `${baseUrl}/comprehensive-rules`;

    const response = await axios.get(rulesUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MTG-Educational-Tool/1.0)'
      }
    });

    const $ = cheerio.load(response.data);

    // Look for official rules text for the mechanic
    let description = null;
    let confidence = 'medium';

    // Search in rules sections
    $('.rule-text, .rules-content, p').each((i, element) => {
      const text = $(element).text();
      const mechanicLower = mechanicName.toLowerCase();

      if (text.toLowerCase().includes(mechanicLower)) {
        const cleanText = text.trim();
        if (cleanText.length > 20 && cleanText.length < 300) {
          description = cleanText;
          confidence = 'high';
          return false; // Break the loop
        }
      }
    });

    if (description) {
      return {
        description: cleanDescription(description),
        confidence: confidence,
        sourceUrl: rulesUrl
      };
    }

    return null;

  } catch (error) {
    throw new Error(`Rules Reference scraping failed: ${error.message}`);
  }
}



// Clean and standardise descriptions using UK English
function cleanDescription(text) {
  if (!text) return "";

  return text
    .replace(/\s+/g, ' ') // Normalise whitespace
    .replace(/\n/g, ' ') // Remove line breaks
    .replace(/\[\d+\]/g, '') // Remove citation markers
    .replace(/\u00a0/g, ' ') // Replace non-breaking spaces
    .trim()
    // UK English standardisation
    .replace(/\bcolor\b/g, 'colour')
    .replace(/\bfavor\b/g, 'favour')
    .replace(/\bcenter\b/g, 'centre')
    .replace(/\bdefense\b/g, 'defence')
    .replace(/\blicense\b/g, 'licence')
    .replace(/\borganize\b/g, 'organise')
    .replace(/\brecognize\b/g, 'recognise')
    .substring(0, 400); // Reasonable length limit
}

// Analyse the quality of scraped data
function analyseDataQuality(mechanicsData) {
  const analysis = {
    totalDescriptions: Object.keys(mechanicsData).length,
    averageLength: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0,
    sourceBreakdown: {}
  };

  if (analysis.totalDescriptions === 0) {
    return analysis;
  }

  let totalLength = 0;

  Object.values(mechanicsData).forEach(mechanic => {
    totalLength += mechanic.description.length;

    // Count confidence levels
    switch (mechanic.confidence) {
      case 'high':
        analysis.highConfidence++;
        break;
      case 'medium':
        analysis.mediumConfidence++;
        break;
      default:
        analysis.lowConfidence++;
    }

    // Count sources
    const source = mechanic.source || 'unknown';
    analysis.sourceBreakdown[source] = (analysis.sourceBreakdown[source] || 0) + 1;
  });

  analysis.averageLength = Math.round(totalLength / analysis.totalDescriptions);

  return analysis;
}

// Generate recommendations based on test results
function generateRecommendations(mechanicsData, successCount, errorCount) {
  const recommendations = [];
  const totalTests = successCount + errorCount;
  const successRate = successCount / totalTests;

  if (successRate > 0.8) {
    recommendations.push("✅ Excellent success rate! This approach is viable for production.");
  } else if (successRate > 0.5) {
    recommendations.push("⚠️  Moderate success rate. Consider hybrid approach with fallbacks.");
  } else {
    recommendations.push("❌ Low success rate. Recommend enhancing current fallback system instead.");
  }

  if (Object.keys(mechanicsData).length > 0) {
    const avgLength = Math.round(
      Object.values(mechanicsData).reduce((sum, m) => sum + m.description.length, 0) /
      Object.keys(mechanicsData).length
    );

    if (avgLength < 50) {
      recommendations.push("📝 Descriptions are quite short. May need supplementary content.");
    } else if (avgLength > 200) {
      recommendations.push("📝 Descriptions are quite long. May need summarisation for beginners.");
    } else {
      recommendations.push("📝 Description length is appropriate for beginners.");
    }
  }

  const highConfidence = Object.values(mechanicsData).filter(m => m.confidence === 'high').length;
  if (highConfidence < successCount * 0.5) {
    recommendations.push("🔍 Many results have low confidence. Consider additional sources.");
  }

  recommendations.push("💡 Next steps: Expand test to more mechanics and compare with current fallbacks.");

  return recommendations;
}

module.exports = { scrapeWizardsOfficial };

// Run if called directly
if (require.main === module) {
  const testLimit = process.argv[2] ? parseInt(process.argv[2]) : 5;

  scrapeWizardsOfficial(testLimit)
    .then(() => {
      console.log("\n🎉 Test completed successfully!");
      process.exit(0);
    })
    .catch(error => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

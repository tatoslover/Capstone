const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Colour information from the wiki (including colourless)
const scrapeColours = async () => {
  try {
    console.log('🎨 Scraping MTG Colours from wiki...');

    const { data } = await axios.get('https://mtg.fandom.com/wiki/Color');
    const $ = cheerio.load(data);

    const colours = {};

    // Look for sections with colour headings
    $('h2, h3').each((i, element) => {
      const heading = $(element).find('.mw-headline').text().trim();

      // Match colour names
      const colourMatch = heading.match(/^(White|Blue|Black|Red|Green)$/i);
      if (colourMatch) {
        const colourName = colourMatch[1].toLowerCase();
        let description = '';
        let philosophy = '';
        let strengths = [];
        let mechanics = [];

        // Get the next few paragraphs after this heading
        let nextElement = $(element).next();
        let paragraphCount = 0;

        while (nextElement.length && paragraphCount < 5) {
          if (nextElement.is('p')) {
            const text = nextElement.text().trim();
            if (text && text.length > 20) {
              if (paragraphCount === 0) {
                description = text;
              } else if (text.includes('philosophy') || text.includes('represents')) {
                philosophy = text;
              }
            }
            paragraphCount++;
          } else if (nextElement.is('h2, h3')) {
            break; // Stop at next heading
          }
          nextElement = nextElement.next();
        }

        // Fallback descriptions if scraping doesn't work well
        const fallbackData = {
          white: {
            description: "White represents order, peace, and structure. It values law, honour, and the greater good over individual desires.",
            philosophy: "White believes in creating a perfect world through order and organisation. It seeks to eliminate conflict through laws and moral codes.",
            strengths: ["Life gain", "Protection", "Removal", "Board wipes", "Small efficient creatures"],
            mechanics: ["First strike", "Vigilance", "Protection", "Lifelink", "Flying"]
          },
          blue: {
            description: "Blue represents knowledge, logic, and manipulation. It values intellect, technology, and the pursuit of perfection through understanding.",
            philosophy: "Blue believes that anything can be improved through knowledge and careful study. It seeks to control through information and preparation.",
            strengths: ["Card draw", "Counterspells", "Bounce effects", "Flying creatures", "Instant-speed interaction"],
            mechanics: ["Flying", "Flash", "Hexproof", "Scry", "Counter"]
          },
          black: {
            description: "Black represents power, ambition, and self-interest. It values individual achievement and is willing to pay any price for power.",
            philosophy: "Black believes that power is the only thing that matters and that everyone should look out for themselves first.",
            strengths: ["Removal", "Discard", "Life drain", "Recursion", "Tutoring"],
            mechanics: ["Deathtouch", "Menace", "Lifelink", "Fear", "Regenerate"]
          },
          red: {
            description: "Red represents emotion, freedom, and impulse. It values passion, chaos, and acting on instinct rather than careful planning.",
            philosophy: "Red believes in following your heart and living life to the fullest, even if it means taking risks.",
            strengths: ["Direct damage", "Aggressive creatures", "Artifact destruction", "Haste", "Temporary effects"],
            mechanics: ["Haste", "First strike", "Trample", "Flying", "Double strike"]
          },
          green: {
            description: "Green represents nature, growth, and instinct. It values the natural order and believes in accepting what you are rather than trying to change.",
            philosophy: "Green believes that nature knows best and that trying to improve on natural systems only leads to problems.",
            strengths: ["Large creatures", "Mana acceleration", "Artifact/enchantment destruction", "Life gain", "Creature buffs"],
            mechanics: ["Trample", "Reach", "Vigilance", "Hexproof", "Regenerate"]
          }
        };

        // Use scraped data if available, otherwise use fallback
        colours[colourName] = {
          name: colourName.charAt(0).toUpperCase() + colourName.slice(1),
          description: description || fallbackData[colourName]?.description || "Description to be completed",
          philosophy: philosophy || fallbackData[colourName]?.philosophy || "Philosophy to be completed",
          strengths: fallbackData[colourName]?.strengths || [],
          mechanics: fallbackData[colourName]?.mechanics || [],
          emoji: getColourEmoji(colourName),
          symbol: getColourSymbol(colourName)
        };
      }
    });

    // Ensure we have all five traditional colours
    const colourNames = ['white', 'blue', 'black', 'red', 'green'];
    colourNames.forEach(colour => {
      if (!colours[colour]) {
        const fallbackData = {
          white: {
            description: "White represents order, peace, and structure. It values law, honour, and the greater good over individual desires.",
            philosophy: "White believes in creating a perfect world through order and organisation.",
            strengths: ["Life gain", "Protection", "Removal", "Board wipes"],
            mechanics: ["First strike", "Vigilance", "Protection", "Lifelink"]
          },
          blue: {
            description: "Blue represents knowledge, logic, and manipulation. It values intellect and the pursuit of perfection through understanding.",
            philosophy: "Blue believes that anything can be improved through knowledge and careful study.",
            strengths: ["Card draw", "Counterspells", "Flying creatures", "Instant-speed interaction"],
            mechanics: ["Flying", "Flash", "Hexproof", "Scry"]
          },
          black: {
            description: "Black represents power, ambition, and self-interest. It values individual achievement and power at any cost.",
            philosophy: "Black believes that power is the only thing that matters.",
            strengths: ["Removal", "Discard", "Life drain", "Recursion"],
            mechanics: ["Deathtouch", "Menace", "Lifelink", "Fear"]
          },
          red: {
            description: "Red represents emotion, freedom, and impulse. It values passion and acting on instinct.",
            philosophy: "Red believes in following your heart and living life to the fullest.",
            strengths: ["Direct damage", "Aggressive creatures", "Haste", "Temporary effects"],
            mechanics: ["Haste", "First strike", "Trample", "Double strike"]
          },
          green: {
            description: "Green represents nature, growth, and instinct. It values the natural order and harmony.",
            philosophy: "Green believes that nature knows best and accepting what you are is key.",
            strengths: ["Large creatures", "Mana acceleration", "Creature buffs", "Life gain"],
            mechanics: ["Trample", "Reach", "Vigilance", "Hexproof"]
          }
        };

        colours[colour] = {
          name: colour.charAt(0).toUpperCase() + colour.slice(1),
          description: fallbackData[colour].description,
          philosophy: fallbackData[colour].philosophy,
          strengths: fallbackData[colour].strengths,
          mechanics: fallbackData[colour].mechanics,
          emoji: getColourEmoji(colour),
          symbol: getColourSymbol(colour)
        };
      }
    });

    // Now attempt to scrape colourless information
    console.log('🔘 Attempting to scrape Colourless information...');
    const colourlessData = await scrapeColourlessData();

    // Add colourless as the sixth colour
    colours.colourless = {
      name: 'Colourless',
      description: colourlessData.description || "In Magic: The Gathering, colourless has two in-game meanings. It is either a type of object or a type of mana. Note that colourless is not a colour, and is not represented in the colour wheel.",
      philosophy: colourlessData.philosophy || "Colourless represents artifice, universal solutions, and mechanical efficiency. It transcends the limitations and philosophies of the five colours, offering neutral tools and effects that any deck can utilise.",
      strengths: colourlessData.strengths || ["Universal utility", "Artifact synergies", "Mana fixing", "Neutral effects", "Mechanical efficiency"],
      mechanics: colourlessData.mechanics || ["Colorless mana costs", "Artifact abilities", "Generic effects", "Devoid", "Eldrazi abilities"],
      emoji: '🔘',
      symbol: 'C'
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/colours.json');
    await fs.writeJson(outputPath, colours, { spaces: 2 });

    console.log(`✅ Colours data saved to ${outputPath}`);
    console.log(`📊 Scraped ${Object.keys(colours).length} colours (including colourless)`);

    return colours;

  } catch (error) {
    console.error('❌ Error scraping colours:', error.message);
    throw error;
  }
};

// Attempt to scrape colourless-specific information
const scrapeColourlessData = async () => {
  try {
    // Try multiple sources for colourless information
    const sources = [
      'https://mtg.fandom.com/wiki/Colorless',
      'https://mtg.fandom.com/wiki/Artifact',
      'https://mtg.fandom.com/wiki/Devoid'
    ];

    for (const url of sources) {
      try {
        console.log(`🔍 Checking ${url}...`);
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let description = '';
        let philosophy = '';

        // Look for descriptive paragraphs
        $('p').each((i, element) => {
          const text = $(element).text().trim();

          if (text.length > 50 &&
              (text.toLowerCase().includes('colorless') ||
               text.toLowerCase().includes('artifact') ||
               text.toLowerCase().includes('devoid')) &&
              !description) {
            description = text;
          }

          if (text.includes('represent') || text.includes('philosophy')) {
            philosophy = text;
          }
        });

        if (description) {
          console.log(`✅ Found colourless information from ${url}`);
          // Clean the description to remove technical details
          let cleanedDescription = cleanWikiText(description);
          let cleanedPhilosophy = cleanWikiText(philosophy);

          // Fix grammar: objects -> object
          cleanedDescription = cleanedDescription.replace(/type of objects/g, 'type of object');

          // Remove technical details from philosophy
          cleanedPhilosophy = cleanedPhilosophy
            .replace(/In our example.*?Add.*?\./g, '')
            .replace(/One of the consequences.*?Oracle.*?wordings\./g, '')
            .replace(/R&D concluded.*?colourless mana\./g, 'Colourless represents universal accessibility and mechanical efficiency.')
            .replace(/\s+/g, ' ')
            .trim();

          // If philosophy is too technical or empty, use fallback
          if (cleanedPhilosophy.length < 50 || cleanedPhilosophy.includes('mana circle') || cleanedPhilosophy.includes('Oracle') || cleanedPhilosophy.includes('representation') || cleanedPhilosophy.includes('symbol')) {
            cleanedPhilosophy = "Colourless represents artifice, universal solutions, and mechanical efficiency. It transcends the limitations and philosophies of the five colours, offering neutral tools and effects that any deck can utilise.";
          }

          return {
            description: cleanedDescription,
            philosophy: cleanedPhilosophy,
            strengths: ["Universal utility", "Artifact synergies", "Mana fixing", "Neutral effects"],
            mechanics: ["Colorless mana costs", "Artifact abilities", "Generic effects", "Devoid"]
          };
        }

      } catch (error) {
        console.log(`⚠️ Could not scrape ${url}: ${error.message}`);
        continue;
      }
    }

    console.log('ℹ️ Using fallback data for colourless');
    return null;

  } catch (error) {
    console.log('⚠️ Error scraping colourless data, using fallback');
    return null;
  }
};

// Helper function to clean wiki text
function cleanWikiText(text) {
  if (!text) return "";

  return text
    .replace(/\[\d+\]/g, '') // Remove citation markers
    .replace(/\s+/g, ' ') // Normalise whitespace
    .replace(/\n/g, ' ') // Remove line breaks
    .replace(/color/g, 'colour') // Convert to UK spelling
    .trim()
    .substring(0, 500); // Limit length
}

function getColourEmoji(colour) {
  const emojis = {
    white: '⚪',
    blue: '🔵',
    black: '⚫',
    red: '🔴',
    green: '🟢',
    colourless: '🔘'
  };
  return emojis[colour] || '⚪';
}

function getColourSymbol(colour) {
  const symbols = {
    white: 'W',
    blue: 'U',
    black: 'B',
    red: 'R',
    green: 'G',
    colourless: 'C'
  };
  return symbols[colour] || 'C';
}

// Run if called directly
if (require.main === module) {
  scrapeColours()
    .then(colours => {
      console.log('\n🎨 MTG Colours (including Colourless):');
      Object.values(colours).forEach(colour => {
        console.log(`${colour.emoji} ${colour.name}: ${colour.description.substring(0, 100)}...`);
      });
    })
    .catch(console.error);
}

module.exports = { scrapeColours };

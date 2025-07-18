const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Color information from the wiki
const scrapeColors = async () => {
  try {
    console.log('🎨 Scraping MTG Colors from wiki...');

    const { data } = await axios.get('https://mtg.fandom.com/wiki/Color');
    const $ = cheerio.load(data);

    const colors = {};

    // Look for sections with color headings
    $('h2, h3').each((i, element) => {
      const heading = $(element).find('.mw-headline').text().trim();

      // Match color names
      const colorMatch = heading.match(/^(White|Blue|Black|Red|Green)$/i);
      if (colorMatch) {
        const colorName = colorMatch[1].toLowerCase();
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
        colors[colorName] = {
          name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
          description: description || fallbackData[colorName]?.description || "Description to be completed",
          philosophy: philosophy || fallbackData[colorName]?.philosophy || "Philosophy to be completed",
          strengths: fallbackData[colorName]?.strengths || [],
          mechanics: fallbackData[colorName]?.mechanics || [],
          emoji: getColorEmoji(colorName),
          symbol: getColorSymbol(colorName)
        };
      }
    });

    // Ensure we have all five colors
    const colorNames = ['white', 'blue', 'black', 'red', 'green'];
    colorNames.forEach(color => {
      if (!colors[color]) {
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

        colors[color] = {
          name: color.charAt(0).toUpperCase() + color.slice(1),
          description: fallbackData[color].description,
          philosophy: fallbackData[color].philosophy,
          strengths: fallbackData[color].strengths,
          mechanics: fallbackData[color].mechanics,
          emoji: getColorEmoji(color),
          symbol: getColorSymbol(color)
        };
      }
    });

    // Save the data
    const outputPath = path.join(__dirname, '../data/colors.json');
    await fs.writeJson(outputPath, colors, { spaces: 2 });

    console.log(`✅ Colors data saved to ${outputPath}`);
    console.log(`📊 Scraped ${Object.keys(colors).length} colors`);

    return colors;

  } catch (error) {
    console.error('❌ Error scraping colors:', error.message);
    throw error;
  }
};

function getColorEmoji(color) {
  const emojis = {
    white: '⚪',
    blue: '🔵',
    black: '⚫',
    red: '🔴',
    green: '🟢'
  };
  return emojis[color] || '⚪';
}

function getColorSymbol(color) {
  const symbols = {
    white: 'W',
    blue: 'U',
    black: 'B',
    red: 'R',
    green: 'G'
  };
  return symbols[color] || 'C';
}

// Run if called directly
if (require.main === module) {
  scrapeColors()
    .then(colors => {
      console.log('\n🎨 MTG Colors:');
      Object.values(colors).forEach(color => {
        console.log(`${color.emoji} ${color.name}: ${color.description.substring(0, 100)}...`);
      });
    })
    .catch(console.error);
}

module.exports = { scrapeColors };

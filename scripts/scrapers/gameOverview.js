const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Scrape MTG Game Overview information from the wiki
const scrapeGameOverview = async () => {
  try {
    console.log('🎮 Scraping MTG Game Overview from wiki...');

    const urls = [
      'https://mtg.fandom.com/wiki/Magic:_The_Gathering',
      'https://mtg.fandom.com/wiki/Magic_basics'
    ];

    let gameDescription = '';
    let gameBasics = '';
    let objective = '';

    // Scrape main Magic page
    try {
      const { data } = await axios.get(urls[0]);
      const $ = cheerio.load(data);

      // Find first meaningful paragraph about the game
      $('p').each((i, element) => {
        const text = $(element).text().trim();
        if (text.length > 100 && !gameDescription &&
            (text.includes('Magic: The Gathering') || text.includes('trading card game'))) {
          gameDescription = text;
          return false; // Break
        }
      });
    } catch (error) {
      console.warn('Could not scrape main MTG page, using fallback');
    }

    // Comprehensive fallback data based on official MTG sources
    const fallbackData = {
      description: "Magic: The Gathering (MTG) is a collectible card game where players take on the role of powerful wizards called Planeswalkers. Each player starts with 20 life and uses a deck of spells, creatures, and other magical effects to reduce their opponent's life to zero.",

      basics: {
        players: "Typically played between 2 players, though multiplayer formats exist",
        gameLength: "Games usually last 10-30 minutes",
        ageRange: "Recommended for ages 13+, though simpler formats work for younger players",
        skillTypes: "Combines strategy, deck building, resource management, and tactical decision-making"
      },

      coreGameplay: {
        overview: "Players cast spells by paying mana - magical energy that comes from lands. Different colours of mana (White, Blue, Black, Red, Green) represent different types of magic, each with their own strengths and strategies.",

        gameFlow: "The game combines strategy, deck building, and a bit of luck as you draw cards from your library and adapt to your opponent's plays. Victory comes through reducing your opponent's life to zero, though alternative win conditions exist.",

        strategy: "Success requires understanding when to play cards, how to manage your resources, and predicting your opponent's moves. Each game presents unique decisions and interactions."
      },

      whyPlay: {
        diversity: "With over 20,000 unique cards printed, every game feels different",
        community: "Join millions of players worldwide in local game stores, online, or at home",
        formats: "Multiple ways to play suit different preferences and budgets",
        creativity: "Express yourself through deck building and unique strategies",
        competitive: "From casual kitchen table games to professional tournaments",
        collectible: "Beautiful artwork and the thrill of opening new cards"
      },

      gettingStarted: {
        step1: "Start with a preconstructed deck or Magic Arena (the digital version)",
        step2: "Learn the basic rules and phases of a turn",
        step3: "Practice with friends or at your local game store",
        step4: "Explore different colours and strategies",
        step5: "Build your own deck as you learn what you enjoy"
      },

      keyTerms: {
        planeswalker: "What players are called in the Magic multiverse - powerful spellcasters who can travel between worlds",
        mana: "The magical energy used to cast spells, produced by lands",
        library: "Your deck of cards that you draw from during the game",
        battlefield: "The area where permanents (creatures, artefacts, etc.) exist and can interact",
        graveyard: "Where cards go when they're destroyed or used up",
        stack: "The area where spells wait to resolve, allowing players to respond to each other"
      }
    };

    // Use scraped data if available, otherwise use comprehensive fallback
    const gameOverviewData = {
      lastUpdated: new Date().toISOString(),
      source: gameDescription ? "MTG Wiki + Curated Content" : "Curated Content",

      introduction: {
        title: "What is Magic: The Gathering?",
        description: gameDescription || fallbackData.description,
        tagline: "The world's first and most popular trading card game"
      },

      basics: fallbackData.basics,
      coreGameplay: fallbackData.coreGameplay,
      whyPlay: fallbackData.whyPlay,
      gettingStarted: fallbackData.gettingStarted,
      keyTerms: fallbackData.keyTerms,

      quickFacts: {
        releaseYear: "1993",
        creator: "Richard Garfield",
        publisher: "Wizards of the Coast",
        totalCards: "20,000+",
        activeFormats: "10+",
        worldwideEvents: "Thousands annually"
      },

      learningPath: [
        {
          step: 1,
          title: "Learn the Basics",
          description: "Understand the fundamental rules and turn structure"
        },
        {
          step: 2,
          title: "Choose Your Colours",
          description: "Explore the five colours of magic and their philosophies"
        },
        {
          step: 3,
          title: "Practice Playing",
          description: "Start with simple games using preconstructed decks"
        },
        {
          step: 4,
          title: "Build Your First Deck",
          description: "Create a custom deck around strategies you enjoy"
        },
        {
          step: 5,
          title: "Join the Community",
          description: "Find local players or join online communities"
        }
      ]
    };

    // Save the data
    const outputPath = path.join(__dirname, '../data/gameOverview.json');
    await fs.writeJson(outputPath, gameOverviewData, { spaces: 2 });

    console.log(`✅ Game overview data saved to ${outputPath}`);
    console.log(`📊 Generated comprehensive MTG introduction`);

    return gameOverviewData;

  } catch (error) {
    console.error('❌ Error scraping game overview:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  scrapeGameOverview()
    .then(data => {
      console.log('\n🎮 MTG Game Overview:');
      console.log(`📖 ${data.introduction.title}`);
      console.log(`🎯 ${data.introduction.description.substring(0, 100)}...`);
      console.log(`📚 Learning steps: ${data.learningPath.length}`);
      console.log(`🔑 Key terms defined: ${Object.keys(data.keyTerms).length}`);
    })
    .catch(console.error);
}

module.exports = { scrapeGameOverview };

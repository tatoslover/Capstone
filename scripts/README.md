# MTG Data Scraping Scripts

This directory contains scripts to scrape Magic: The Gathering data from reliable sources and generate JSON files for use in the frontend application.

## Overview

The scrapers collect data from:
- **MTG Wiki (mtg.fandom.com)** - For colors, card types, and detailed mechanic descriptions
- **Scryfall API** - For comprehensive mechanics lists and fresh data

## Scripts

### 🎨 Colors Scraper (`scrapers/colors.js`)
Scrapes the five MTG colors with their philosophies, strengths, and associated mechanics.

**Output:** `data/colors.json`

### 🃏 Card Types Scraper (`scrapers/cardTypes.js`)
Scrapes card type information including descriptions, rules, usage, and timing.

**Output:** `data/cardTypes.json`

### ⚡ Mechanics Scraper (`scrapers/mechanics.js`)
- Fetches all mechanics from Scryfall API
- Scrapes detailed descriptions for priority/beginner mechanics
- Provides links for advanced mechanics

**Output:** `data/mechanics.json`

## Usage

### Install Dependencies
```bash
npm install
```

### Run Individual Scrapers
```bash
# Scrape colors only
npm run scrape:colors

# Scrape card types only
npm run scrape:card-types

# Scrape mechanics only
npm run scrape:mechanics
```

### Run All Scrapers
```bash
# Run all scrapers sequentially
npm run scrape:all
```

### Copy Data to Frontend
```bash
# Copy JSON files to frontend/data directory
npm run copy
```

### Full Pipeline
```bash
# Scrape all data and copy to frontend
npm run build
```

## Rate Limiting

The scrapers include built-in rate limiting to be respectful to the MTG Wiki:
- 500ms delay between priority mechanic requests
- 1-2 second delays between major scraper runs
- Graceful fallbacks if scraping fails

## Data Structure

### Colors (`colors.json`)
```json
{
  "white": {
    "name": "White",
    "description": "White represents order, peace...",
    "philosophy": "White believes in creating...",
    "strengths": ["Life gain", "Protection", ...],
    "mechanics": ["First strike", "Vigilance", ...],
    "emoji": "⚪",
    "symbol": "W"
  }
}
```

### Card Types (`cardTypes.json`)
```json
{
  "creature": {
    "name": "Creature",
    "description": "Creatures represent beings...",
    "rules": "Creatures enter with summoning sickness...",
    "usage": "Your primary way to deal damage...",
    "timing": "Main phase only (sorcery speed)",
    "examples": ["Combat creatures", ...],
    "icon": "👹"
  }
}
```

### Mechanics (`mechanics.json`)
```json
{
  "totalMechanics": 273,
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "source": "Scryfall API + MTG Wiki",
  "mechanics": {
    "flying": {
      "name": "Flying",
      "description": "A creature with flying can only be blocked...",
      "rules": "...",
      "category": "evergreen",
      "isEvergreen": true,
      "isBeginnerFriendly": true,
      "wikiUrl": "https://mtg.fandom.com/wiki/Flying"
    }
  },
  "categories": {
    "evergreen": [...],
    "beginnerFriendly": [...],
    "priority": [...]
  },
  "allMechanicsList": [...]
}
```

## Integration with Frontend

After running the scrapers, the data is automatically copied to `frontend/data/` where it can be imported:

```javascript
// Import the data
import colors from "../data/colors.json";
import cardTypes from "../data/cardTypes.json";
import { mechanicsDetails, getMechanicDetails } from "../data/mechanics.js";

// Use in components
const whiteColor = colors.white;
const creatureType = cardTypes.creature;
const flyingMechanic = getMechanicDetails("Flying");
```

## Troubleshooting

### Common Issues

1. **Network errors**: The scrapers include retry logic, but if wiki pages are down, fallback data is used
2. **Rate limiting**: If you get 429 errors, increase delays in the scraper files
3. **Missing data**: Some mechanics may not have detailed descriptions - this is expected for advanced mechanics

### Debugging

Run individual scrapers to isolate issues:
```bash
# Test colors scraper
npm run scrape:colors

# Check output
cat data/colors.json | jq
```

## Contributing

When adding new scrapers:
1. Follow the existing pattern in `scrapers/`
2. Include fallback data for reliability
3. Add rate limiting for external requests
4. Update the main index file to include your scraper
5. Add appropriate npm scripts

## Data Sources

- **MTG Wiki**: https://mtg.fandom.com/ (Community-maintained, comprehensive)
- **Scryfall API**: https://api.scryfall.com/ (Official card database API)

Both sources are used under fair use for educational/community purposes.
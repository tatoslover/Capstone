// MTG Mechanics Data - Updated from Scryfall API + MTG Wiki
// Last updated: 2025-07-20T04:54:09.087Z
// Total: 273 unique mechanics and abilities
// Source: Official-First System (Wizards.com + Fallbacks)

export const allMechanics = [
  "Living weapon",
  "Jump-start",
  "Commander ninjutsu",
  "Legendary landwalk",
  "Nonbasic landwalk",
  "Megamorph",
  "Haunt",
  "Forecast",
  "Graft",
  "Fortify",
  "Frenzy",
  "Gravestorm",
  "Hideaway",
  "Level Up",
  "Infect",
  "Reach",
  "Rampage",
  "Phasing",
  "Multikicker",
  "Morph",
  "Provoke",
  "Modular",
  "Ninjutsu",
  "Replicate",
  "Recover",
  "Poisonous",
  "Prowl",
  "Reinforce",
  "Persist",
  "Retrace",
  "Rebound",
  "Miracle",
  "Overload",
  "Outlast",
  "Prowess",
  "Renown",
  "Myriad",
  "Shroud",
  "Trample",
  "Vigilance",
  "Storm",
  "Soulshift",
  "Splice",
  "Transmute",
  "Ripple",
  "Suspend",
  "Vanishing",
  "Transfigure",
  "Wither",
  "Undying",
  "Soulbond",
  "Unleash",
  "Ascend",
  "Assist",
  "Afterlife",
  "Companion",
  "Fabricate",
  "Embalm",
  "Escape",
  "Fuse",
  "Menace",
  "Ingest",
  "Melee",
  "Improvise",
  "Mentor",
  "Partner",
  "Mutate",
  "Tribute",
  "Surge",
  "Skulk",
  "Undaunted",
  "Riot",
  "Spectacle",
  "Forestwalk",
  "Islandwalk",
  "Mountainwalk",
  "Double strike",
  "Cumulative upkeep",
  "First strike",
  "Scavenge",
  "Encore",
  "Deathtouch",
  "Defender",
  "Amplify",
  "Affinity",
  "Bushido",
  "Convoke",
  "Bloodthirst",
  "Absorb",
  "Aura Swap",
  "Changeling",
  "Conspire",
  "Cascade",
  "Annihilator",
  "Battle Cry",
  "Cipher",
  "Bestow",
  "Dash",
  "Awaken",
  "Crew",
  "Aftermath",
  "Afflict",
  "Flanking",
  "Foretell",
  "Fading",
  "Eternalize",
  "Entwine",
  "Epic",
  "Dredge",
  "Delve",
  "Evoke",
  "Exalted",
  "Evolve",
  "Extort",
  "Dethrone",
  "Exploit",
  "Devoid",
  "Emerge",
  "Escalate",
  "Flying",
  "Haste",
  "Hexproof",
  "Indestructible",
  "Intimidate",
  "Lifelink",
  "Horsemanship",
  "Kicker",
  "Madness",
  "Swampwalk",
  "Desertwalk",
  "Craft",
  "Plainswalk",
  "Split second",
  "Augment",
  "Double agenda",
  "Reconfigure",
  "Ward",
  "Partner with",
  "Daybound",
  "Nightbound",
  "Decayed",
  "Disturb",
  "Squad",
  "Enlist",
  "Read Ahead",
  "Ravenous",
  "Blitz",
  "Offering",
  "Living metal",
  "Backup",
  "Banding",
  "Hidden agenda",
  "For Mirrodin!",
  "Friends forever",
  "Casualty",
  "Protection",
  "Compleated",
  "Enchant",
  "Flash",
  "Boast",
  "Demonstrate",
  "Sunburst",
  "Flashback",
  "Cycling",
  "Equip",
  "Buyback",
  "Hexproof from",
  "More Than Meets the Eye",
  "Cleave",
  "Champion",
  "specialise",
  "Training",
  "Prototype",
  "Toxic",
  "Unearth",
  "Intensity",
  "Plainscycling",
  "Swampcycling",
  "Typecycling",
  "Wizardcycling",
  "Mountaincycling",
  "Basic landcycling",
  "Islandcycling",
  "Forestcycling",
  "Slivercycling",
  "Landcycling",
  "Bargain",
  "Choose a background",
  "Echo",
  "Disguise",
  "Doctor's companion",
  "Landwalk",
  "Umbra armour",
  "Freerunning",
  "Spree",
  "Saddle",
  "Shadow",
  "Warp",
  "Station",
  "Devour",
  "Offspring",
  "Impending",
  "Gift",
  "Harmonize",
  "Exhaust",
  "Max speed",
  "Fear",
  "Mobilize",
  "Double team",
  "Job select",
  "Eerie",
  "Battalion",
  "Bloodrush",
  "Channel",
  "Chroma",
  "Cohort",
  "Constellation",
  "Converge",
  "Delirium",
  "Domain",
  "Fateful hour",
  "Ferocious",
  "Formidable",
  "Grandeur",
  "Hellbent",
  "Heroic",
  "Imprint",
  "Inspired",
  "Join forces",
  "Kinship",
  "Landfall",
  "Lieutenant",
  "Metalcraft",
  "Morbid",
  "Parley",
  "Radiance",
  "Raid",
  "Rally",
  "Spell mastery",
  "Strive",
  "Sweep",
  "Tempting offer",
  "Threshold",
  "Will of the council",
  "Adamant",
  "Addendum",
  "Council's dilemma",
  "Eminence",
  "Enrage",
  "Hero's Reward",
  "Kinfall",
  "Landship",
  "Legacy",
  "Revolt",
  "Underdog",
  "Undergrowth",
  "Void",
  "Descend",
  "Fathomless descent",
  "Magecraft",
  "Teamwork",
  "Pack tactics",
  "Coven",
  "Alliance",
  "Corrupted",
  "Secret council",
  "Celebration",
  "Paradox",
  "Will of the Planeswalkers",
  "Survival",
  "Flurry",
  "Valiant",
  "Start your engines!"
];

// Categorised lists for easier filtering
export const evergreenKeywords = [
  "Flying",
  "Trample",
  "First strike",
  "Deathtouch",
  "Lifelink",
  "Vigilance",
  "Haste",
  "Hexproof",
  "Reach",
  "Menace",
  "Defender",
  "Double strike",
  "Indestructible",
  "Flash",
  "Protection",
  "Ward"
];

// Detailed mechanics data with descriptions and wiki links
export const mechanicsDetails = {
  "living_weapon": {
    "name": "Living weapon",
    "description": "When this Equipment enters, create a 0/0 black Phyrexian Germ creature token, then attach this Equipment to it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Living_weapon",
    "fallbackDescription": "When this Equipment enters, create a 0/0 black Phyrexian Germ creature token, then attach this Equipment to it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Living_weapon",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.079Z",
      "qualityRating": "medium"
    }
  },
  "jump_start": {
    "name": "Jump-start",
    "description": "You may cast this card from your graveyard by discarding a card in addition to paying its other costs. Then exile this card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Jump-start",
    "fallbackDescription": "You may cast this card from your graveyard by discarding a card in addition to paying its other costs. Then exile this card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Jump-start",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.080Z",
      "qualityRating": "medium"
    }
  },
  "commander_ninjutsu": {
    "name": "Commander ninjutsu",
    "description": "Return an unblocked attacker you control to hand: Put this card onto the battlefield from your hand tapped and attacking.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Commander_ninjutsu",
    "fallbackDescription": "Return an unblocked attacker you control to hand: Put this card onto the battlefield from your hand tapped and attacking.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Commander_ninjutsu",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.080Z",
      "qualityRating": "medium"
    }
  },
  "legendary_landwalk": {
    "name": "Legendary landwalk",
    "description": "Legendary landwalk is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Legendary_landwalk",
    "fallbackDescription": "Legendary landwalk is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Legendary_landwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.080Z",
      "qualityRating": "medium"
    }
  },
  "nonbasic_landwalk": {
    "name": "Nonbasic landwalk",
    "description": "Nonbasic landwalk is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Nonbasic_landwalk",
    "fallbackDescription": "Nonbasic landwalk is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Nonbasic_landwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "megamorph": {
    "name": "Megamorph",
    "description": "You may cast this face down as a 2/2 creature for . Turn it face up any time for its morph cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Megamorph",
    "fallbackDescription": "You may cast this face down as a 2/2 creature for . Turn it face up any time for its morph cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Megamorph",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "haunt": {
    "name": "Haunt",
    "description": "When this creature dies, exile it haunting target creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Haunt",
    "fallbackDescription": "When this creature dies, exile it haunting target creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Haunt",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "forecast": {
    "name": "Forecast",
    "description": "Activate this ability only during your upkeep and only once each turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Forecast",
    "fallbackDescription": "Activate this ability only during your upkeep and only once each turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Forecast",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "graft": {
    "name": "Graft",
    "description": "This creature enters the battlefield with N +1/+1 counters on it. Whenever another creature enters the battlefield, you may move a +1/+1 counter from this creature onto it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Graft",
    "fallbackDescription": "This creature enters the battlefield with N +1/+1 counters on it. Whenever another creature enters the battlefield, you may move a +1/+1 counter from this creature onto it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Graft",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "fortify": {
    "name": "Fortify",
    "description": "[Cost]: Attach this Fortification to target land you control. Activate only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fortify",
    "fallbackDescription": "[Cost]: Attach this Fortification to target land you control. Activate only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fortify",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "frenzy": {
    "name": "Frenzy",
    "description": "Whenever this creature attacks and isn't blocked, it gets +N/+0 until end of turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Frenzy",
    "fallbackDescription": "Whenever this creature attacks and isn't blocked, it gets +N/+0 until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Frenzy",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "gravestorm": {
    "name": "Gravestorm",
    "description": "When you cast this spell, copy it for each permanent put into a graveyard this turn. You may choose new targets for the copies.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Gravestorm",
    "fallbackDescription": "When you cast this spell, copy it for each permanent put into a graveyard this turn. You may choose new targets for the copies.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Gravestorm",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "hideaway": {
    "name": "Hideaway",
    "description": "When this permanent enters, look at the top N cards of your library, exile one face down, then put the rest on the bottom of your library.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Hideaway",
    "fallbackDescription": "When this permanent enters, look at the top N cards of your library, exile one face down, then put the rest on the bottom of your library.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Hideaway",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "level_up": {
    "name": "Level Up",
    "description": "Level Up is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Level_Up",
    "fallbackDescription": "Level Up is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Level_Up",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "infect": {
    "name": "Infect",
    "description": "This creature deals damage to creatures in the form of -1/-1 counters and to players in the form of poison counters.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Infect",
    "fallbackDescription": "This creature deals damage to creatures in the form of -1/-1 counters and to players in the form of poison counters.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Infect",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "reach": {
    "name": "Reach",
    "description": "Can block creatures with flying. Note that creatures with reach can be blocked by any kind of creature.",
    "category": "combat",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Reach",
    "fallbackDescription": "Can block creatures with flying.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "high"
    }
  },
  "rampage": {
    "name": "Rampage",
    "description": "Whenever this creature becomes blocked, it gets +N/+N until end of turn for each creature blocking it beyond the first.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Rampage",
    "fallbackDescription": "Whenever this creature becomes blocked, it gets +N/+N until end of turn for each creature blocking it beyond the first.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Rampage",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.081Z",
      "qualityRating": "medium"
    }
  },
  "phasing": {
    "name": "Phasing",
    "description": "This phases in or out before you untap during each of your untap steps. While it's phased out, it's treated as though it doesn't exist.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Phasing",
    "fallbackDescription": "This phases in or out before you untap during each of your untap steps. While it's phased out, it's treated as though it doesn't exist.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Phasing",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "multikicker": {
    "name": "Multikicker",
    "description": "You may pay an additional [cost] as you cast this spell.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Multikicker",
    "fallbackDescription": "You may pay an additional [cost] as you cast this spell.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Multikicker",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "morph": {
    "name": "Morph",
    "description": "You may cast this face down as a 2/2 creature for . Turn it face up any time for its morph cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Morph",
    "fallbackDescription": "You may cast this face down as a 2/2 creature for . Turn it face up any time for its morph cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Morph",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "provoke": {
    "name": "Provoke",
    "description": "Whenever this creature attacks, you may have target creature defending player controls untap and block it if able.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Provoke",
    "fallbackDescription": "Whenever this creature attacks, you may have target creature defending player controls untap and block it if able.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Provoke",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "modular": {
    "name": "Modular",
    "description": "This enters with N +1/+1 counters on it. When it dies, you may put its +1/+1 counters on target artifact creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Modular",
    "fallbackDescription": "This enters with N +1/+1 counters on it. When it dies, you may put its +1/+1 counters on target artifact creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Modular",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "ninjutsu": {
    "name": "Ninjutsu",
    "description": "Return an unblocked attacker you control to hand: Put this card onto the battlefield from your hand tapped and attacking.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ninjutsu",
    "fallbackDescription": "Return an unblocked attacker you control to hand: Put this card onto the battlefield from your hand tapped and attacking.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ninjutsu",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "replicate": {
    "name": "Replicate",
    "description": "When you cast this spell, copy it for each time you paid its replicate cost. You may choose new targets for the copies.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Replicate",
    "fallbackDescription": "When you cast this spell, copy it for each time you paid its replicate cost. You may choose new targets for the copies.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Replicate",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "recover": {
    "name": "Recover",
    "description": "When a creature is put into your graveyard from the battlefield, you may pay [cost]. If you do, return this card from your graveyard to your hand. Otherwise, exile this card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Recover",
    "fallbackDescription": "When a creature is put into your graveyard from the battlefield, you may pay [cost]. If you do, return this card from your graveyard to your hand. Otherwise, exile this card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Recover",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "poisonous": {
    "name": "Poisonous",
    "description": "Whenever this creature deals combat damage to a player, that player gets N poison counters.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Poisonous",
    "fallbackDescription": "Whenever this creature deals combat damage to a player, that player gets N poison counters.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Poisonous",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "prowl": {
    "name": "Prowl",
    "description": "You may cast this for its prowl cost if you dealt combat damage to a player this turn with a [subtype].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Prowl",
    "fallbackDescription": "You may cast this for its prowl cost if you dealt combat damage to a player this turn with a [subtype].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Prowl",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "reinforce": {
    "name": "Reinforce",
    "description": "[Cost], Discard this card: Put N +1/+1 counters on target creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Reinforce",
    "fallbackDescription": "[Cost], Discard this card: Put N +1/+1 counters on target creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Reinforce",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "persist": {
    "name": "Persist",
    "description": "When this creature dies, if it had no -1/-1 counters on it, return it to the battlefield under its owner’s control with a -1/-1 counter on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Persist",
    "fallbackDescription": "When this creature dies, if it had no -1/-1 counters on it, return it to the battlefield under its owner’s control with a -1/-1 counter on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Persist",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "retrace": {
    "name": "Retrace",
    "description": "You may cast this card from your graveyard by discarding a land card as an additional cost to cast it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Retrace",
    "fallbackDescription": "You may cast this card from your graveyard by discarding a land card as an additional cost to cast it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Retrace",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "rebound": {
    "name": "Rebound",
    "description": "If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Rebound",
    "fallbackDescription": "If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Rebound",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "miracle": {
    "name": "Miracle",
    "description": "You may cast this card for its Miracle cost when you draw it if it's the first card you drew this turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Miracle",
    "fallbackDescription": "You may cast this card for its Miracle cost when you draw it if it's the first card you drew this turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Miracle",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "overload": {
    "name": "Overload",
    "description": "You may cast this spell for its overload cost. If you do, change its text by replacing all instances of 'target' with 'each'.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Overload",
    "fallbackDescription": "You may cast this spell for its overload cost. If you do, change its text by replacing all instances of 'target' with 'each'.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Overload",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "outlast": {
    "name": "Outlast",
    "description": "[Cost], : Put a +1/+1 counter on this creature. Activate only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Outlast",
    "fallbackDescription": "[Cost], : Put a +1/+1 counter on this creature. Activate only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Outlast",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "prowess": {
    "name": "Prowess",
    "description": "Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.",
    "category": "triggered",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Prowess",
    "fallbackDescription": "Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Prowess",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "renown": {
    "name": "Renown",
    "description": "Whenever this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counter on it and it becomes renowned.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Renown",
    "fallbackDescription": "Whenever this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counter on it and it becomes renowned.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Renown",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "myriad": {
    "name": "Myriad",
    "description": "Whenever this creature attacks, for each opponent other than defending player, you may create a token that's a copy of this creature that's tapped and attacking that player or a planeswalker they control. If one or more tokens are created this way, exile the tokens at end of combat.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Myriad",
    "fallbackDescription": "Whenever this creature attacks, for each opponent other than defending player, you may create a token that's a copy of this creature that's tapped and attacking that player or a planeswalker they control. If one or more tokens are created this way, exile the tokens at end of combat.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Myriad",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "shroud": {
    "name": "Shroud",
    "description": "This permanent or player can’t be the target of spells or abilities.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Shroud",
    "fallbackDescription": "This permanent or player can’t be the target of spells or abilities.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Shroud",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "trample": {
    "name": "Trample",
    "description": "When a creature with trample attacks and is blocked, you only need to assign lethal damage to blockers. The rest goes to the defending player or planeswalker.",
    "category": "combat",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Trample",
    "fallbackDescription": "Excess combat damage can be dealt to the defending player.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Trample",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium-high"
    }
  },
  "vigilance": {
    "name": "Vigilance",
    "description": "Doesn't tap to attack. Vigilance doesn't allow a tapped creature or a creature that entered the battlefield this turn to attack.",
    "category": "combat",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Vigilance",
    "fallbackDescription": "Doesn't tap when attacking.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "high"
    }
  },
  "storm": {
    "name": "Storm",
    "description": "When you cast this spell, copy it for each spell cast before it this turn. You may choose new targets for the copies.",
    "category": "triggered",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Storm",
    "fallbackDescription": "When you cast this spell, copy it for each spell cast before it this turn. You may choose new targets for the copies.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Storm",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "soulshift": {
    "name": "Soulshift",
    "description": "When this creature dies, you may return target Spirit card with mana value N or less from your graveyard to your hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Soulshift",
    "fallbackDescription": "When this creature dies, you may return target Spirit card with mana value N or less from your graveyard to your hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Soulshift",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "splice": {
    "name": "Splice",
    "description": "As you cast a(n",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Splice",
    "fallbackDescription": "As you cast a(n",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Splice",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "transmute": {
    "name": "Transmute",
    "description": "[cost], Discard this card: Search your library for a card with the same mana value as this card, reveal it, put it into your hand, then shuffle. Transmute only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Transmute",
    "fallbackDescription": "[cost], Discard this card: Search your library for a card with the same mana value as this card, reveal it, put it into your hand, then shuffle. Transmute only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Transmute",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "ripple": {
    "name": "Ripple",
    "description": "When you cast this spell, you may reveal the top N cards of your library. You may cast any revealed cards with the same name as this spell without paying their mana costs. Put the rest on the bottom of your library.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ripple",
    "fallbackDescription": "When you cast this spell, you may reveal the top N cards of your library. You may cast any revealed cards with the same name as this spell without paying their mana costs. Put the rest on the bottom of your library.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ripple",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "suspend": {
    "name": "Suspend",
    "description": "Rather than cast this card from your hand, you may pay [cost] and exile it with N time counters on it. At the beginning of your upkeep, remove a time counter. When the last is removed, you may cast it without paying its mana cost. If it's a creature, it has haste.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Suspend",
    "fallbackDescription": "Rather than cast this card from your hand, you may pay [cost] and exile it with N time counters on it. At the beginning of your upkeep, remove a time counter. When the last is removed, you may cast it without paying its mana cost. If it's a creature, it has haste.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Suspend",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "vanishing": {
    "name": "Vanishing",
    "description": "This permanent enters with N time counters on it. At the beginning of your upkeep, remove a time counter from it. When the last is removed, sacrifice it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Vanishing",
    "fallbackDescription": "This permanent enters with N time counters on it. At the beginning of your upkeep, remove a time counter from it. When the last is removed, sacrifice it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Vanishing",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.082Z",
      "qualityRating": "medium"
    }
  },
  "transfigure": {
    "name": "Transfigure",
    "description": "[Cost], Sacrifice this permanent: Search your library for a creature card with the same mana value as this permanent, put that card onto the battlefield, then shuffle. Transfigure only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Transfigure",
    "fallbackDescription": "[Cost], Sacrifice this permanent: Search your library for a creature card with the same mana value as this permanent, put that card onto the battlefield, then shuffle. Transfigure only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Transfigure",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "wither": {
    "name": "Wither",
    "description": "This deals damage to creatures in the form of -1/-1 counters.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Wither",
    "fallbackDescription": "This deals damage to creatures in the form of -1/-1 counters.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Wither",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "undying": {
    "name": "Undying",
    "description": "When this creature dies, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Undying",
    "fallbackDescription": "When this creature dies, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Undying",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "soulbond": {
    "name": "Soulbond",
    "description": "You may pair this creature with another unpaired creature when either enters. They remain paired for as long as you control both of them.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Soulbond",
    "fallbackDescription": "You may pair this creature with another unpaired creature when either enters. They remain paired for as long as you control both of them.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Soulbond",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "unleash": {
    "name": "Unleash",
    "description": "You may have this creature enter with a +1/+1 counter on it. It can't block as long as it has a +1/+1 counter on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Unleash",
    "fallbackDescription": "You may have this creature enter with a +1/+1 counter on it. It can't block as long as it has a +1/+1 counter on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Unleash",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "ascend": {
    "name": "Ascend",
    "description": "If you control ten or more permanents, you get the city’s blessing for the rest of the game.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ascend",
    "fallbackDescription": "If you control ten or more permanents, you get the city’s blessing for the rest of the game.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ascend",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "assist": {
    "name": "Assist",
    "description": "Another player can pay up to of this spell's cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Assist",
    "fallbackDescription": "Another player can pay up to of this spell's cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Assist",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "afterlife": {
    "name": "Afterlife",
    "description": "When this creature dies, create N 1/1 white and black Spirit creature token(s",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Afterlife",
    "fallbackDescription": "When this creature dies, create N 1/1 white and black Spirit creature token(s",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Afterlife",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "companion": {
    "name": "Companion",
    "description": "If this card is your chosen companion, you may put it into your hand from outside the game for any time you could cast a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Companion",
    "fallbackDescription": "If this card is your chosen companion, you may put it into your hand from outside the game for any time you could cast a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Companion",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "fabricate": {
    "name": "Fabricate",
    "description": "When this permanent enters the battlefield, you may put N +1/+1 counters on it. If you don't, create N 1/1 colorless Servo artifact creature tokens.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fabricate",
    "fallbackDescription": "When this permanent enters the battlefield, you may put N +1/+1 counters on it. If you don't, create N 1/1 colorless Servo artifact creature tokens.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fabricate",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "embalm": {
    "name": "Embalm",
    "description": "[Cost], Exile this card from your graveyard: Create a token that's a copy of it, except it's a white Zombie ... with no mana cost. Embalm only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Embalm",
    "fallbackDescription": "[Cost], Exile this card from your graveyard: Create a token that's a copy of it, except it's a white Zombie ... with no mana cost. Embalm only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Embalm",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "escape": {
    "name": "Escape",
    "description": "You may cast this card from your graveyard for its escape cost",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Escape",
    "fallbackDescription": "You may cast this card from your graveyard for its escape cost",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Escape",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "fuse": {
    "name": "Fuse",
    "description": "You may cast one or both halves of this card from your hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fuse",
    "fallbackDescription": "You may cast one or both halves of this card from your hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fuse",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "menace": {
    "name": "Menace",
    "description": "Can't be blocked except by two or more creatures.",
    "category": "evasion",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Menace",
    "fallbackDescription": "Can't be blocked except by two or more creatures.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "high"
    }
  },
  "ingest": {
    "name": "Ingest",
    "description": "Whenever this creature deals combat damage to a player, that player exiles the top card of their library",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ingest",
    "fallbackDescription": "Whenever this creature deals combat damage to a player, that player exiles the top card of their library",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ingest",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "melee": {
    "name": "Melee",
    "description": "Whenever this creature attacks, it gets +1/+1 until end of turn for each opponent you attacked with a creature this combat.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Melee",
    "fallbackDescription": "Whenever this creature attacks, it gets +1/+1 until end of turn for each opponent you attacked with a creature this combat.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Melee",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "improvise": {
    "name": "Improvise",
    "description": "Your artifacts can help cast this spell. Each artifact you tap after you're done activating mana abilities pays for .",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Improvise",
    "fallbackDescription": "Your artifacts can help cast this spell. Each artifact you tap after you're done activating mana abilities pays for .",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Improvise",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "mentor": {
    "name": "Mentor",
    "description": "Whenever this creature attacks, put a +1/+1 counter on target attacking creature with lesser power.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Mentor",
    "fallbackDescription": "Whenever this creature attacks, put a +1/+1 counter on target attacking creature with lesser power.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Mentor",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "partner": {
    "name": "Partner",
    "description": "You can have two commanders if both have partner.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Partner",
    "fallbackDescription": "You can have two commanders if both have partner.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Partner",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "mutate": {
    "name": "Mutate",
    "description": "If you cast this spell for its mutate cost, put it over or under target non-Human creature you own. They mutate into the creature on top plus all abilities from under it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Mutate",
    "fallbackDescription": "If you cast this spell for its mutate cost, put it over or under target non-Human creature you own. They mutate into the creature on top plus all abilities from under it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Mutate",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "tribute": {
    "name": "Tribute",
    "description": "As this creature enters, an opponent of your choice may place N +1/+1 counters on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Tribute",
    "fallbackDescription": "As this creature enters, an opponent of your choice may place N +1/+1 counters on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Tribute",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "surge": {
    "name": "Surge",
    "description": "You may cast a spell for its surge cost if you or a teammate have cast another spell in the same turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Surge",
    "fallbackDescription": "You may cast a spell for its surge cost if you or a teammate have cast another spell in the same turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Surge",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "skulk": {
    "name": "Skulk",
    "description": "This creature can't be blocked by creatures with greater power.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Skulk",
    "fallbackDescription": "This creature can't be blocked by creatures with greater power.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Skulk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "undaunted": {
    "name": "Undaunted",
    "description": "This spell costs less to cast for each opponent.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Undaunted",
    "fallbackDescription": "This spell costs less to cast for each opponent.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Undaunted",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "riot": {
    "name": "Riot",
    "description": "This creature enters with your choice of a +1/+1 counter or haste.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Riot",
    "fallbackDescription": "This creature enters with your choice of a +1/+1 counter or haste.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Riot",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "spectacle": {
    "name": "Spectacle",
    "description": "You may cast this spell for its spectacle cost rather than its mana cost if an opponent lost life this turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Spectacle",
    "fallbackDescription": "You may cast this spell for its spectacle cost rather than its mana cost if an opponent lost life this turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Spectacle",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "forestwalk": {
    "name": "Forestwalk",
    "description": "This creature can't be blocked as long as defending player controls a [type].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Forestwalk",
    "fallbackDescription": "This creature can't be blocked as long as defending player controls a [type].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Forestwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "islandwalk": {
    "name": "Islandwalk",
    "description": "This creature can't be blocked as long as defending player controls a [type].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Islandwalk",
    "fallbackDescription": "This creature can't be blocked as long as defending player controls a [type].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Islandwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "mountainwalk": {
    "name": "Mountainwalk",
    "description": "This creature can't be blocked as long as defending player controls a [type].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Mountainwalk",
    "fallbackDescription": "This creature can't be blocked as long as defending player controls a [type].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Mountainwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "double_strike": {
    "name": "Double strike",
    "description": "Deals combat damage twice - once during first strike and once during regular damage.",
    "category": "combat",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Double_strike",
    "fallbackDescription": "Deals first strike and regular combat damage.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Double_strike",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium-high"
    }
  },
  "cumulative_upkeep": {
    "name": "Cumulative upkeep",
    "description": "At the beginning of your upkeep, if this permanent is on the battlefield, put an age counter on this permanent. Then you may pay [cost] for each age counter on it. If you don’t, sacrifice it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Cumulative_upkeep",
    "fallbackDescription": "At the beginning of your upkeep, if this permanent is on the battlefield, put an age counter on this permanent. Then you may pay [cost] for each age counter on it. If you don’t, sacrifice it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Cumulative_upkeep",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "first_strike": {
    "name": "First strike",
    "description": "Deals all combat damage before creatures without first strike or double strike. When you reach the combat damage step, check to see if any attacking or blocking creatures have first strike or double strike. If so, an extra combat damage step is created just for them.",
    "category": "combat",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/First_strike",
    "fallbackDescription": "Deals combat damage before creatures without first strike.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "high"
    }
  },
  "scavenge": {
    "name": "Scavenge",
    "description": "Exile this card from your graveyard: Put a number of +1/+1 counters equal to this card's power on target creature. Scavenge only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Scavenge",
    "fallbackDescription": "Exile this card from your graveyard: Put a number of +1/+1 counters equal to this card's power on target creature. Scavenge only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Scavenge",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "encore": {
    "name": "Encore",
    "description": "[Cost], Exile this card from your graveyard: For each opponent, create a token copy that attacks that opponent this turn if able. They gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Encore",
    "fallbackDescription": "[Cost], Exile this card from your graveyard: For each opponent, create a token copy that attacks that opponent this turn if able. They gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Encore",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "deathtouch": {
    "name": "Deathtouch",
    "description": "Any amount of damage dealt by this creature destroys the damaged creature. Deathtouch has no effect on players or planeswalkers.",
    "category": "combat",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Deathtouch",
    "fallbackDescription": "Any amount of damage from this creature is lethal.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "high"
    }
  },
  "defender": {
    "name": "Defender",
    "description": "Can't attack.",
    "category": "restriction",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Defender",
    "fallbackDescription": "Can't attack.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Defender",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium-high"
    }
  },
  "amplify": {
    "name": "Amplify",
    "description": "As this creature enters the battlefield, put N +1/+1 counters on it for each [creature type] card you reveal in your hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Amplify",
    "fallbackDescription": "As this creature enters the battlefield, put N +1/+1 counters on it for each [creature type] card you reveal in your hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Amplify",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "affinity": {
    "name": "Affinity",
    "description": "This spell costs less to cast for each [text] you control.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Affinity",
    "fallbackDescription": "This spell costs less to cast for each [text] you control.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Affinity",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "bushido": {
    "name": "Bushido",
    "description": "Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Bushido",
    "fallbackDescription": "Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Bushido",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "convoke": {
    "name": "Convoke",
    "description": "Your creatures can help cast this spell. Each creature you tap while casting this spell pays for or one mana of that creature's colour.",
    "category": "cost_reduction",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Convoke",
    "fallbackDescription": "Your creatures can help cast this spell. Each creature you tap while casting this spell pays for or one mana of that creature's colour.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Convoke",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "bloodthirst": {
    "name": "Bloodthirst",
    "description": "If an opponent was dealt damage this turn, this permanent enters with N +1/+1 counters on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Bloodthirst",
    "fallbackDescription": "If an opponent was dealt damage this turn, this permanent enters with N +1/+1 counters on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Bloodthirst",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "absorb": {
    "name": "Absorb",
    "description": "If a source would deal damage to this creature, prevent N of that damage.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Absorb",
    "fallbackDescription": "If a source would deal damage to this creature, prevent N of that damage.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Absorb",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "aura_swap": {
    "name": "Aura Swap",
    "description": "[Cost]: Exchange this Aura with an Aura card in your hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Aura_Swap",
    "fallbackDescription": "[Cost]: Exchange this Aura with an Aura card in your hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Aura_Swap",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "changeling": {
    "name": "Changeling",
    "description": "This card is every creature type.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Changeling",
    "fallbackDescription": "This card is every creature type.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Changeling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "conspire": {
    "name": "Conspire",
    "description": "As you cast this spell, you may tap two untapped creatures you control that share a colour with it. When you do, copy it and you may choose a new target for the copy.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Conspire",
    "fallbackDescription": "As you cast this spell, you may tap two untapped creatures you control that share a colour with it. When you do, copy it and you may choose a new target for the copy.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Conspire",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "cascade": {
    "name": "Cascade",
    "description": "When you cast this spell, exile cards from the top of your library until you exile a nonland card that costs less. You may cast it without paying its mana cost. Put the exiled cards on the bottom in a random order.",
    "category": "triggered",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Cascade",
    "fallbackDescription": "When you cast this spell, exile cards from the top of your library until you exile a nonland card that costs less. You may cast it without paying its mana cost. Put the exiled cards on the bottom in a random order.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Cascade",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "annihilator": {
    "name": "Annihilator",
    "description": "Whenever this creature attacks, defending player sacrifices N permanents.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Annihilator",
    "fallbackDescription": "Whenever this creature attacks, defending player sacrifices N permanents.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Annihilator",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "battle_cry": {
    "name": "Battle Cry",
    "description": "Battle Cry is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Battle_Cry",
    "fallbackDescription": "Battle Cry is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Battle_Cry",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.083Z",
      "qualityRating": "medium"
    }
  },
  "cipher": {
    "name": "Cipher",
    "description": "Then you may exile this spell card encoded on a creature you control. Whenever that creature deals combat damage to a player, its controller may cast a copy of this card without paying its mana cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Cipher",
    "fallbackDescription": "Then you may exile this spell card encoded on a creature you control. Whenever that creature deals combat damage to a player, its controller may cast a copy of this card without paying its mana cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Cipher",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "bestow": {
    "name": "Bestow",
    "description": "If you cast this card for its bestow cost, it's an Aura spell with enchant creature. It becomes a creature again if it's not attached to a creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Bestow",
    "fallbackDescription": "If you cast this card for its bestow cost, it's an Aura spell with enchant creature. It becomes a creature again if it's not attached to a creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Bestow",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "dash": {
    "name": "Dash",
    "description": "You may cast this spell for its dash cost. If you do, it gains haste, and it's returned from the battlefield to its owner's hand at the beginning of the next end step.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Dash",
    "fallbackDescription": "You may cast this spell for its dash cost. If you do, it gains haste, and it's returned from the battlefield to its owner's hand at the beginning of the next end step.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Dash",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "awaken": {
    "name": "Awaken",
    "description": "If you cast this card for [cost], also put N +1/+1 counters on target land you control and it becomes a 0/0 Elemental creature with haste. It's still a land.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Awaken",
    "fallbackDescription": "If you cast this card for [cost], also put N +1/+1 counters on target land you control and it becomes a 0/0 Elemental creature with haste. It's still a land.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Awaken",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "crew": {
    "name": "Crew",
    "description": "Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Crew",
    "fallbackDescription": "Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Crew",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "aftermath": {
    "name": "Aftermath",
    "description": "Cast this spell only from your graveyard. Then exile it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Aftermath",
    "fallbackDescription": "Cast this spell only from your graveyard. Then exile it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Aftermath",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "afflict": {
    "name": "Afflict",
    "description": "Whenever this creature becomes blocked, defending player loses N life.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Afflict",
    "fallbackDescription": "Whenever this creature becomes blocked, defending player loses N life.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Afflict",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "flanking": {
    "name": "Flanking",
    "description": "Whenever a creature without flanking blocks this creature, the blocking creature gets -1/-1 until end of turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Flanking",
    "fallbackDescription": "Whenever a creature without flanking blocks this creature, the blocking creature gets -1/-1 until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Flanking",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "foretell": {
    "name": "Foretell",
    "description": "During your turn, you may pay and exile this card from your hand face down. Cast it on a later turn for its foretell cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Foretell",
    "fallbackDescription": "During your turn, you may pay and exile this card from your hand face down. Cast it on a later turn for its foretell cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Foretell",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "fading": {
    "name": "Fading",
    "description": "This [permanent type] enters with N fade counters on it. At the beginning of your upkeep, remove a fade counter from it. If you can't, sacrifice it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fading",
    "fallbackDescription": "This [permanent type] enters with N fade counters on it. At the beginning of your upkeep, remove a fade counter from it. If you can't, sacrifice it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fading",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "eternalize": {
    "name": "Eternalize",
    "description": "[Cost], Exile this card from your graveyard: Create a token that's a copy of it, except it's a 4/4 black Zombie ... with no mana cost. Eternalize only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Eternalize",
    "fallbackDescription": "[Cost], Exile this card from your graveyard: Create a token that's a copy of it, except it's a 4/4 black Zombie ... with no mana cost. Eternalize only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Eternalize",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "entwine": {
    "name": "Entwine",
    "description": "Choose all if you pay the entwine cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Entwine",
    "fallbackDescription": "Choose all if you pay the entwine cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Entwine",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "epic": {
    "name": "Epic",
    "description": "For the rest of the game, you can't cast spells. At the beginning of each of your upkeeps, copy this spell except for its epic ability. You may choose new targets for the copy.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Epic",
    "fallbackDescription": "For the rest of the game, you can't cast spells. At the beginning of each of your upkeeps, copy this spell except for its epic ability. You may choose new targets for the copy.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Epic",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "dredge": {
    "name": "Dredge",
    "description": "If you would draw a card, instead you may mill N cards. If you do, return this card from your graveyard to your hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Dredge",
    "fallbackDescription": "If you would draw a card, instead you may mill N cards. If you do, return this card from your graveyard to your hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Dredge",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "delve": {
    "name": "Delve",
    "description": "Each card you exile from your graveyard while casting this spell pays for .",
    "category": "cost_reduction",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Delve",
    "fallbackDescription": "Each card you exile from your graveyard while casting this spell pays for .",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Delve",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "evoke": {
    "name": "Evoke",
    "description": "You may cast this spell for its evoke cost. If you do, it's sacrificed when it enters.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Evoke",
    "fallbackDescription": "You may cast this spell for its evoke cost. If you do, it's sacrificed when it enters.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Evoke",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "exalted": {
    "name": "Exalted",
    "description": "Whenever a creature you control attacks alone, it gets +1/+1 until end of turn for each instance of exalted among permanents you control.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Exalted",
    "fallbackDescription": "Whenever a creature you control attacks alone, it gets +1/+1 until end of turn for each instance of exalted among permanents you control.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Exalted",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "evolve": {
    "name": "Evolve",
    "description": "Whenever a creature you control enters, if that creature has greater power or toughness than this creature, put a +1/+1 counter on this creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Evolve",
    "fallbackDescription": "Whenever a creature you control enters, if that creature has greater power or toughness than this creature, put a +1/+1 counter on this creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Evolve",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "extort": {
    "name": "Extort",
    "description": "Whenever you cast a spell, you may pay . If you do, each opponent loses 1 life and you gain that much life.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Extort",
    "fallbackDescription": "Whenever you cast a spell, you may pay . If you do, each opponent loses 1 life and you gain that much life.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Extort",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "dethrone": {
    "name": "Dethrone",
    "description": "Whenever this creature attacks the player with the most life or tied for most life, put a +1/+1 counter on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Dethrone",
    "fallbackDescription": "Whenever this creature attacks the player with the most life or tied for most life, put a +1/+1 counter on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Dethrone",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "exploit": {
    "name": "Exploit",
    "description": "When this creature enters, you may sacrifice a creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Exploit",
    "fallbackDescription": "When this creature enters, you may sacrifice a creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Exploit",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "devoid": {
    "name": "Devoid",
    "description": "This card has no colour.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Devoid",
    "fallbackDescription": "This card has no colour.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Devoid",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "emerge": {
    "name": "Emerge",
    "description": "You may cast this spell by sacrificing a creature and paying the emerge cost reduced by that creature's mana value.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Emerge",
    "fallbackDescription": "You may cast this spell by sacrificing a creature and paying the emerge cost reduced by that creature's mana value.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Emerge",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "escalate": {
    "name": "Escalate",
    "description": "Pay this cost for each mode chosen beyond the first.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Escalate",
    "fallbackDescription": "Pay this cost for each mode chosen beyond the first.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Escalate",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "flying": {
    "name": "Flying",
    "description": "Can only be blocked by creatures with flying or reach.",
    "category": "evasion",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Flying",
    "fallbackDescription": "Can only be blocked by creatures with flying or reach.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "high"
    }
  },
  "haste": {
    "name": "Haste",
    "description": "Isn't affected by summoning sickness. Can attack as soon as it comes under your control. You can also activate its activated abilities with in the cost right away.",
    "category": "utility",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Haste",
    "fallbackDescription": "Can attack and use abilities immediately when it enters.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "high"
    }
  },
  "hexproof": {
    "name": "Hexproof",
    "description": "A keyword ability that prevents a permanent or player from being the target of spells or abilities an opponent controls.",
    "category": "protection",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Hexproof",
    "fallbackDescription": "Can't be targeted by opponents' spells or abilities.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "high"
    }
  },
  "indestructible": {
    "name": "Indestructible",
    "description": "A keyword ability. Permanents with indestructible can't be destroyed by damage or by effects that say 'destroy'.",
    "category": "protection",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Indestructible",
    "fallbackDescription": "Can't be destroyed by damage or effects that say 'destroy'.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Indestructible",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium-high"
    }
  },
  "intimidate": {
    "name": "Intimidate",
    "description": "This creature can't be blocked except by artifact creatures and/or creatures that share a colour with it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Intimidate",
    "fallbackDescription": "This creature can't be blocked except by artifact creatures and/or creatures that share a colour with it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Intimidate",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "lifelink": {
    "name": "Lifelink",
    "description": "When this creature deals damage, you simultaneously gain that much life.",
    "category": "lifegain",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Lifelink",
    "fallbackDescription": "Damage dealt by this creature causes you to gain that much life.",
    "source": "official",
    "confidence": "high",
    "metadata": {
      "hasOfficialContent": true,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "high"
    }
  },
  "horsemanship": {
    "name": "Horsemanship",
    "description": "This creature can't be blocked except by creatures with horsemanship.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Horsemanship",
    "fallbackDescription": "This creature can't be blocked except by creatures with horsemanship.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Horsemanship",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "kicker": {
    "name": "Kicker",
    "description": "You may pay an additional [cost] as you cast this spell.",
    "category": "cost_modification",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Kicker",
    "fallbackDescription": "You may pay an additional [cost] as you cast this spell.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Kicker",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "madness": {
    "name": "Madness",
    "description": "If you discard this card, discard it into exile. When you do, cast it for its madness cost or put it into your graveyard.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Madness",
    "fallbackDescription": "If you discard this card, discard it into exile. When you do, cast it for its madness cost or put it into your graveyard.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Madness",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "swampwalk": {
    "name": "Swampwalk",
    "description": "This creature can't be blocked as long as defending player controls a [type].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Swampwalk",
    "fallbackDescription": "This creature can't be blocked as long as defending player controls a [type].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Swampwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "desertwalk": {
    "name": "Desertwalk",
    "description": "Desertwalk is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Desertwalk",
    "fallbackDescription": "Desertwalk is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Desertwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "craft": {
    "name": "Craft",
    "description": "Craft Ability WordIntroduced The Lost Caverns of IxalanLast used Lost Caverns CommanderTypical Text Craft — with [.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Craft",
    "fallbackDescription": "Craft Ability WordIntroduced The Lost Caverns of IxalanLast used Lost Caverns CommanderTypical Text Craft — with [.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Craft",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "plainswalk": {
    "name": "Plainswalk",
    "description": "This creature can't be blocked as long as defending player controls a [type].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Plainswalk",
    "fallbackDescription": "This creature can't be blocked as long as defending player controls a [type].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Plainswalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "split_second": {
    "name": "Split second",
    "description": "As long as this spell is on the stack, players can't cast spells or activate abilities that aren't mana abilities.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Split_second",
    "fallbackDescription": "As long as this spell is on the stack, players can't cast spells or activate abilities that aren't mana abilities.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Split_second",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "augment": {
    "name": "Augment",
    "description": "cost, Reveal this card from your hand: Combine it with target host. Augment only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Augment",
    "fallbackDescription": "cost, Reveal this card from your hand: Combine it with target host. Augment only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Augment",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "double_agenda": {
    "name": "Double agenda",
    "description": "Start the game with this conspiracy face down in the command zone and secretly name a card. You may turn this conspiracy face up any time and reveal the chosen name.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Double_agenda",
    "fallbackDescription": "Start the game with this conspiracy face down in the command zone and secretly name a card. You may turn this conspiracy face up any time and reveal the chosen name.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Double_agenda",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "reconfigure": {
    "name": "Reconfigure",
    "description": "[Cost]: Attach to target creature you control; or unattach from a creature. Reconfigure only as a sorcery. While attached this isn't a creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Reconfigure",
    "fallbackDescription": "[Cost]: Attach to target creature you control; or unattach from a creature. Reconfigure only as a sorcery. While attached this isn't a creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Reconfigure",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "ward": {
    "name": "Ward",
    "description": "A keyword ability. Whenever this permanent becomes the target of a spell or ability an opponent controls, counter it unless that player pays the ward cost.",
    "category": "protection",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ward",
    "fallbackDescription": "Spells and abilities that target this cost additional mana.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ward",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium-high"
    }
  },
  "partner_with": {
    "name": "Partner with",
    "description": "You can have two commanders if both have partner.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Partner_with",
    "fallbackDescription": "You can have two commanders if both have partner.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Partner_with",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "daybound": {
    "name": "Daybound",
    "description": "If a player cast no spells during their own turn, it becomes night next turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Daybound",
    "fallbackDescription": "If a player cast no spells during their own turn, it becomes night next turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Daybound",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "nightbound": {
    "name": "Nightbound",
    "description": "If a player cast no spells during their own turn, it becomes night next turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Nightbound",
    "fallbackDescription": "If a player cast no spells during their own turn, it becomes night next turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Nightbound",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "decayed": {
    "name": "Decayed",
    "description": "This creature can't block. When it attacks, sacrifice it at the end of combat.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Decayed",
    "fallbackDescription": "This creature can't block. When it attacks, sacrifice it at the end of combat.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Decayed",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "disturb": {
    "name": "Disturb",
    "description": "You may cast this card from your graveyard transformed for its disturb cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Disturb",
    "fallbackDescription": "You may cast this card from your graveyard transformed for its disturb cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Disturb",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "squad": {
    "name": "Squad",
    "description": "As an additional cost to cast this spell, you may pay [cost] any number of times. When this creature enters the battlefield, create that many tokens that are copies of it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Squad",
    "fallbackDescription": "As an additional cost to cast this spell, you may pay [cost] any number of times. When this creature enters the battlefield, create that many tokens that are copies of it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Squad",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "enlist": {
    "name": "Enlist",
    "description": "As this creature attacks, you may tap a nonattacking creature you control without summoning sickness. When you do, add its power to this creature's until end of turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Enlist",
    "fallbackDescription": "As this creature attacks, you may tap a nonattacking creature you control without summoning sickness. When you do, add its power to this creature's until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Enlist",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.084Z",
      "qualityRating": "medium"
    }
  },
  "read_ahead": {
    "name": "Read Ahead",
    "description": "Read Ahead is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Read_Ahead",
    "fallbackDescription": "Read Ahead is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Read_Ahead",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "ravenous": {
    "name": "Ravenous",
    "description": "This creature enters with X +1/+1 counters on it. If X is 5 or more, draw a card when it enters.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ravenous",
    "fallbackDescription": "This creature enters with X +1/+1 counters on it. If X is 5 or more, draw a card when it enters.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ravenous",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "blitz": {
    "name": "Blitz",
    "description": "If you cast this spell for its blitz cost, it gains haste and \"When this creature dies, draw a card\". Sacrifice it at the beginning of the next end step.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Blitz",
    "fallbackDescription": "If you cast this spell for its blitz cost, it gains haste and \"When this creature dies, draw a card\". Sacrifice it at the beginning of the next end step.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Blitz",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "offering": {
    "name": "Offering",
    "description": "You may cast this card any time you could cast an instant by sacrificing a [Subtype] and paying the difference in mana costs between this and the sacrificed [Subtype]. Mana cost includes colour.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Offering",
    "fallbackDescription": "You may cast this card any time you could cast an instant by sacrificing a [Subtype] and paying the difference in mana costs between this and the sacrificed [Subtype]. Mana cost includes colour.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Offering",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "living_metal": {
    "name": "Living metal",
    "description": "As long as it’s your turn, this Vehicle is also a creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Living_metal",
    "fallbackDescription": "As long as it’s your turn, this Vehicle is also a creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Living_metal",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "backup": {
    "name": "Backup",
    "description": "When this creature enters, put N +1/+1 counters on target creature. If that’s another creature, it gains the following abilities until end of turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Backup",
    "fallbackDescription": "When this creature enters, put N +1/+1 counters on target creature. If that’s another creature, it gains the following abilities until end of turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Backup",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "banding": {
    "name": "Banding",
    "description": "Any creatures with banding, and up to one without, can attack in a band. Bands are blocked as a group. If any creatures with banding you control are blocking or being blocked by a creature, you divide that creature's combat damage, not its controller, among any of the creatures it's being blocked by or is blocking.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Banding",
    "fallbackDescription": "Any creatures with banding, and up to one without, can attack in a band. Bands are blocked as a group. If any creatures with banding you control are blocking or being blocked by a creature, you divide that creature's combat damage, not its controller, among any of the creatures it's being blocked by or is blocking.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Banding",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "hidden_agenda": {
    "name": "Hidden agenda",
    "description": "Start the game with this conspiracy face down in the command zone and secretly name a card. You may turn this conspiracy face up any time and reveal the chosen name.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Hidden_agenda",
    "fallbackDescription": "Start the game with this conspiracy face down in the command zone and secretly name a card. You may turn this conspiracy face up any time and reveal the chosen name.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Hidden_agenda",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "for_mirrodin_": {
    "name": "For Mirrodin!",
    "description": "When this Equipment enters, create a 2/2 red Rebel creature token, then attach this to it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/For_Mirrodin!",
    "fallbackDescription": "When this Equipment enters, create a 2/2 red Rebel creature token, then attach this to it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/For_Mirrodin!",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "friends_forever": {
    "name": "Friends forever",
    "description": "You can have two commanders if both have friends forever.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Friends_forever",
    "fallbackDescription": "You can have two commanders if both have friends forever.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Friends_forever",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "casualty": {
    "name": "Casualty",
    "description": "As you cast this spell, you may sacrifice a creature with power N or greater. When you do, copy this spell.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Casualty",
    "fallbackDescription": "As you cast this spell, you may sacrifice a creature with power N or greater. When you do, copy this spell.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Casualty",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "protection": {
    "name": "Protection",
    "description": "A keyword ability that grants immunity from being damaged, enchanted, blocked, or targeted by sources with the specified quality.",
    "category": "protection",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Protection",
    "fallbackDescription": "Can't be damaged, enchanted, blocked, or targeted by the specified quality.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Protection",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium-high"
    }
  },
  "compleated": {
    "name": "Compleated",
    "description": "[Phyrexian hybrid mana] can be paid with M, N, or 2 life. For each [Phyrexian hybrid mana] paid with life, this planeswalker enters with two fewer loyalty counters.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Compleated",
    "fallbackDescription": "[Phyrexian hybrid mana] can be paid with M, N, or 2 life. For each [Phyrexian hybrid mana] paid with life, this planeswalker enters with two fewer loyalty counters.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Compleated",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "enchant": {
    "name": "Enchant",
    "description": "This card can only be attached to an [object or player].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Enchant",
    "fallbackDescription": "This card can only be attached to an [object or player].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Enchant",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "flash": {
    "name": "Flash",
    "description": "A keyword ability that allows you to cast this spell any time you could cast an instant.",
    "category": "timing",
    "isEvergreen": true,
    "wikiUrl": "https://mtg.fandom.com/wiki/Flash",
    "fallbackDescription": "Can be cast at instant speed.",
    "source": "enhanced_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Flash",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium-high"
    }
  },
  "boast": {
    "name": "Boast",
    "description": "Activate this ability only if this creature attacked this turn and only once each turn.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Boast",
    "fallbackDescription": "Activate this ability only if this creature attacked this turn and only once each turn.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Boast",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "demonstrate": {
    "name": "Demonstrate",
    "description": "When you cast this spell, you may copy it. If you do, choose an opponent to also copy it. Players may choose new targets for their copies.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Demonstrate",
    "fallbackDescription": "When you cast this spell, you may copy it. If you do, choose an opponent to also copy it. Players may choose new targets for their copies.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Demonstrate",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "sunburst": {
    "name": "Sunburst",
    "description": "This enters with a [+1/+1 or charge] counter on it for each colour of mana spent to cast it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Sunburst",
    "fallbackDescription": "This enters with a [+1/+1 or charge] counter on it for each colour of mana spent to cast it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Sunburst",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "flashback": {
    "name": "Flashback",
    "description": "You may cast this card from your graveyard for its flashback cost. Then exile it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Flashback",
    "fallbackDescription": "You may cast this card from your graveyard for its flashback cost. Then exile it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Flashback",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "cycling": {
    "name": "Cycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "cost_reduction",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Cycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Cycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "equip": {
    "name": "Equip",
    "description": "[Cost]: Attach this permanent to target [quality] creature you control. Activate this ability only any time you could cast a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Equip",
    "fallbackDescription": "[Cost]: Attach this permanent to target [quality] creature you control. Activate this ability only any time you could cast a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Equip",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "buyback": {
    "name": "Buyback",
    "description": "You may pay an additional [cost] as you cast this spell. If the buyback cost was paid, put this spell into its owner’s hand instead of into that player’s graveyard as it resolves.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Buyback",
    "fallbackDescription": "You may pay an additional [cost] as you cast this spell. If the buyback cost was paid, put this spell into its owner’s hand instead of into that player’s graveyard as it resolves.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Buyback",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "hexproof_from": {
    "name": "Hexproof from",
    "description": "This permanent can't be the target of spells or abilities your opponents control.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Hexproof_from",
    "fallbackDescription": "This permanent can't be the target of spells or abilities your opponents control.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Hexproof_from",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "more_than_meets_the_eye": {
    "name": "More Than Meets the Eye",
    "description": "You may cast this card converted for [cost]",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/More_Than_Meets_the_Eye",
    "fallbackDescription": "You may cast this card converted for [cost]",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/More_Than_Meets_the_Eye",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "cleave": {
    "name": "Cleave",
    "description": "You may cast this spell for its cleave cost. If you do, remove the words in square brackets.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Cleave",
    "fallbackDescription": "You may cast this spell for its cleave cost. If you do, remove the words in square brackets.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Cleave",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "champion": {
    "name": "Champion",
    "description": "When this enters the battlefield, sacrifice it unless you exile another creature you control. When this leaves the battlefield, that card returns to the battlefield.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Champion",
    "fallbackDescription": "When this enters the battlefield, sacrifice it unless you exile another creature you control. When this leaves the battlefield, that card returns to the battlefield.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Champion",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "specialise": {
    "name": "specialise",
    "description": "Pay [cost], choose a colour, discard a card of that colour or associated basic land type: This creature perpetually specialises into that colour. Activate only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Specialize",
    "fallbackDescription": "Pay [cost], choose a colour, discard a card of that colour or associated basic land type: This creature perpetually specialises into that colour. Activate only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/specialise",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "training": {
    "name": "Training",
    "description": "Whenever this creature attacks with another creature with greater power, put a +1/+1 counter on this creature.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Training",
    "fallbackDescription": "Whenever this creature attacks with another creature with greater power, put a +1/+1 counter on this creature.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Training",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "prototype": {
    "name": "Prototype",
    "description": "You may cast this spell with different mana cost, colour, and size. It keeps its abilities and types.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Prototype",
    "fallbackDescription": "You may cast this spell with different mana cost, colour, and size. It keeps its abilities and types.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Prototype",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "toxic": {
    "name": "Toxic",
    "description": "Players dealt combat damage by this creature also get N poison counter(s",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Toxic",
    "fallbackDescription": "Players dealt combat damage by this creature also get N poison counter(s",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Toxic",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "unearth": {
    "name": "Unearth",
    "description": "Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step or if it would leave the battlefield. Unearth only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Unearth",
    "fallbackDescription": "Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step or if it would leave the battlefield. Unearth only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Unearth",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "intensity": {
    "name": "Intensity",
    "description": "8% Scryfall Search fulloracle:\"Intensity\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Intensity",
    "fallbackDescription": "8% Scryfall Search fulloracle:\"Intensity\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Intensity",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "plainscycling": {
    "name": "Plainscycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Plainscycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Plainscycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "swampcycling": {
    "name": "Swampcycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Swampcycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Swampcycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "typecycling": {
    "name": "Typecycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Typecycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Typecycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "wizardcycling": {
    "name": "Wizardcycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Wizardcycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Wizardcycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "mountaincycling": {
    "name": "Mountaincycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Mountaincycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Mountaincycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "basic_landcycling": {
    "name": "Basic landcycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Basic_landcycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Basic_landcycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "islandcycling": {
    "name": "Islandcycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Islandcycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Islandcycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "forestcycling": {
    "name": "Forestcycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Forestcycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Forestcycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "slivercycling": {
    "name": "Slivercycling",
    "description": "Slivercycling is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Slivercycling",
    "fallbackDescription": "Slivercycling is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Slivercycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "landcycling": {
    "name": "Landcycling",
    "description": "[Cost], Discard this card: Draw a card.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Landcycling",
    "fallbackDescription": "[Cost], Discard this card: Draw a card.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Landcycling",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "bargain": {
    "name": "Bargain",
    "description": "You may sacrifice an artifact, enchantment, or token as you cast this spell.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Bargain",
    "fallbackDescription": "You may sacrifice an artifact, enchantment, or token as you cast this spell.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Bargain",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "choose_a_background": {
    "name": "Choose a background",
    "description": "You can have a Background as a second commander.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Choose_a_Background",
    "fallbackDescription": "You can have a Background as a second commander.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Choose_a_Background",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "echo": {
    "name": "Echo",
    "description": "At the beginning of your upkeep, if this came under your control since the beginning of your last upkeep, sacrifice it unless you pay its echo cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Echo",
    "fallbackDescription": "At the beginning of your upkeep, if this came under your control since the beginning of your last upkeep, sacrifice it unless you pay its echo cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Echo",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "disguise": {
    "name": "Disguise",
    "description": "You may cast this face down for as a 2/2 creature with ward . Turn it face up any time for its disguise cost.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Disguise",
    "fallbackDescription": "You may cast this face down for as a 2/2 creature with ward . Turn it face up any time for its disguise cost.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Disguise",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "doctor_s_companion": {
    "name": "Doctor's companion",
    "description": "Doctor's companion is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Doctor%27s_companion",
    "fallbackDescription": "Doctor's companion is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Doctor%27s_companion",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.085Z",
      "qualityRating": "medium"
    }
  },
  "landwalk": {
    "name": "Landwalk",
    "description": "This creature can't be blocked as long as defending player controls a [type].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Landwalk",
    "fallbackDescription": "This creature can't be blocked as long as defending player controls a [type].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Landwalk",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "umbra_armour": {
    "name": "Umbra armour",
    "description": "If enchanted permanent would be destroyed, instead remove all damage marked on it and destroy this Aura.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Umbra_armor",
    "fallbackDescription": "If enchanted permanent would be destroyed, instead remove all damage marked on it and destroy this Aura.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Umbra_armor",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "freerunning": {
    "name": "Freerunning",
    "description": "You may cast a spell for its freerunning cost if you dealt combat damage to a player this turn with an Assassin or commander.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Freerunning",
    "fallbackDescription": "You may cast a spell for its freerunning cost if you dealt combat damage to a player this turn with an Assassin or commander.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Freerunning",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "spree": {
    "name": "Spree",
    "description": "Choose one or more additional costs.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Spree",
    "fallbackDescription": "Choose one or more additional costs.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Spree",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "saddle": {
    "name": "Saddle",
    "description": "Tap any number of other creatures you control with total power N or more: This Mount becomes saddled until end of turn. Saddle only as a sorcery.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Saddle",
    "fallbackDescription": "Tap any number of other creatures you control with total power N or more: This Mount becomes saddled until end of turn. Saddle only as a sorcery.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Saddle",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "shadow": {
    "name": "Shadow",
    "description": "This creature can block or be blocked by only creatures with shadow.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Shadow",
    "fallbackDescription": "This creature can block or be blocked by only creatures with shadow.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Shadow",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "warp": {
    "name": "Warp",
    "description": "Warp is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Warp",
    "fallbackDescription": "Warp is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Warp",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "station": {
    "name": "Station",
    "description": "Station is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Station",
    "fallbackDescription": "Station is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Station",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "devour": {
    "name": "Devour",
    "description": "As this enters, you may sacrifice any number of creatures. This creature enters the battlefield with N times that many +1/+1 counters on it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Devour",
    "fallbackDescription": "As this enters, you may sacrifice any number of creatures. This creature enters the battlefield with N times that many +1/+1 counters on it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Devour",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "offspring": {
    "name": "Offspring",
    "description": "You may pay an additional [cost] as you cast this spell. If you do, when this creature enters, create a 1/1 token copy of it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Offspring",
    "fallbackDescription": "You may pay an additional [cost] as you cast this spell. If you do, when this creature enters, create a 1/1 token copy of it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Offspring",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "impending": {
    "name": "Impending",
    "description": "If you cast this spell for its impending cost, it enters with N time counters and isn't a creature until the last is removed. At the beginning of your end step, remove a time counter from it.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Impending",
    "fallbackDescription": "If you cast this spell for its impending cost, it enters with N time counters and isn't a creature until the last is removed. At the beginning of your end step, remove a time counter from it.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Impending",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "gift": {
    "name": "Gift",
    "description": "You may promise an opponent a gift as you cast this spell. If you do, they [get whatever you're gifting them].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Gift",
    "fallbackDescription": "You may promise an opponent a gift as you cast this spell. If you do, they [get whatever you're gifting them].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Gift",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "harmonize": {
    "name": "Harmonize",
    "description": "Harmonize is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Harmonize",
    "fallbackDescription": "Harmonize is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Harmonize",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "exhaust": {
    "name": "Exhaust",
    "description": "Activate each exhaust ability only once.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Exhaust",
    "fallbackDescription": "Activate each exhaust ability only once.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Exhaust",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "max_speed": {
    "name": "Max speed",
    "description": "Speed is a trait that players can have.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Max_speed",
    "fallbackDescription": "Speed is a trait that players can have.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Max_speed",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "fear": {
    "name": "Fear",
    "description": "This creature can't be blocked except by artifact creatures and/or black creatures.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fear",
    "fallbackDescription": "This creature can't be blocked except by artifact creatures and/or black creatures.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fear",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "mobilize": {
    "name": "Mobilize",
    "description": "Mobilize is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Mobilize",
    "fallbackDescription": "Mobilize is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Mobilize",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "double_team": {
    "name": "Double team",
    "description": "When this creature attacks, if it's not a token, conjure a duplicate of it into your hand. Then both cards perpetually lose double team.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Double_team",
    "fallbackDescription": "When this creature attacks, if it's not a token, conjure a duplicate of it into your hand. Then both cards perpetually lose double team.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Double_team",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "job_select": {
    "name": "Job select",
    "description": "Job select is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Job_select",
    "fallbackDescription": "Job select is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Job_select",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "eerie": {
    "name": "Eerie",
    "description": "9% Scryfall Search keyword:\"Eerie\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Eerie",
    "fallbackDescription": "9% Scryfall Search keyword:\"Eerie\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Eerie",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "battalion": {
    "name": "Battalion",
    "description": "6% Scryfall Search keyword:\"Battalion\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Battalion",
    "fallbackDescription": "6% Scryfall Search keyword:\"Battalion\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Battalion",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "bloodrush": {
    "name": "Bloodrush",
    "description": "BloodrushAbility WordIntroduced GatecrashLast used Dragon's MazeTypical Text Bloodrush — [cost], Discard this card: Target attacking creature gets.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Bloodrush",
    "fallbackDescription": "BloodrushAbility WordIntroduced GatecrashLast used Dragon's MazeTypical Text Bloodrush — [cost], Discard this card: Target attacking creature gets.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Bloodrush",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "channel": {
    "name": "Channel",
    "description": "Channel Ability WordIntroduced Saviors of KamigawaLast used Alchemy: KamigawaTypical Text Channel — [cost], Discard this card:.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Channel",
    "fallbackDescription": "Channel Ability WordIntroduced Saviors of KamigawaLast used Alchemy: KamigawaTypical Text Channel — [cost], Discard this card:.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Channel",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "chroma": {
    "name": "Chroma",
    "description": "ChromaAbility WordIntroduced EventideLast used EventideTypical Text Chroma — … for each … mana symbol in those cards' mana costs.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Chroma",
    "fallbackDescription": "ChromaAbility WordIntroduced EventideLast used EventideTypical Text Chroma — … for each … mana symbol in those cards' mana costs.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Chroma",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "cohort": {
    "name": "Cohort",
    "description": "Cohort Ability WordIntroduced Oath of the GatewatchLast used Oath of the GatewatchTypical Text Cohort — , Tap an untapped Ally you control:.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Cohort",
    "fallbackDescription": "Cohort Ability WordIntroduced Oath of the GatewatchLast used Oath of the GatewatchTypical Text Cohort — , Tap an untapped Ally you control:.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Cohort",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "constellation": {
    "name": "Constellation",
    "description": "9% Scryfall Search keyword:\"Constellation\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Constellation",
    "fallbackDescription": "9% Scryfall Search keyword:\"Constellation\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Constellation",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "converge": {
    "name": "Converge",
    "description": "ConvergeAbility WordIntroduced Battle for ZendikarLast used New Capenna CommanderTypical Text Converge —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Converge",
    "fallbackDescription": "ConvergeAbility WordIntroduced Battle for ZendikarLast used New Capenna CommanderTypical Text Converge —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Converge",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "delirium": {
    "name": "Delirium",
    "description": "3% Scryfall Search keyword:\"Delirium\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Delirium",
    "fallbackDescription": "3% Scryfall Search keyword:\"Delirium\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Delirium",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "domain": {
    "name": "Domain",
    "description": "Domain Ability WordIntroduced InvasionLast used Alchemy: DominariaTypical Text Domain —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Domain",
    "fallbackDescription": "Domain Ability WordIntroduced InvasionLast used Alchemy: DominariaTypical Text Domain —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Domain",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "fateful_hour": {
    "name": "Fateful hour",
    "description": "Fateful HourAbility WordIntroduced Dark AscensionLast used Lord of the Rings Holiday ReleaseTypical Text Fateful hour — If you have 5 or less life,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fateful_hour",
    "fallbackDescription": "Fateful HourAbility WordIntroduced Dark AscensionLast used Lord of the Rings Holiday ReleaseTypical Text Fateful hour — If you have 5 or less life,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fateful_hour",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "ferocious": {
    "name": "Ferocious",
    "description": "Ferocious Ability WordIntroduced Khans of TarkirLast used Modern Horizons 3Typical Text Ferocious —...",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Ferocious",
    "fallbackDescription": "Ferocious Ability WordIntroduced Khans of TarkirLast used Modern Horizons 3Typical Text Ferocious —...",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Ferocious",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "formidable": {
    "name": "Formidable",
    "description": "FormidableAbility WordIntroduced Dragons of TarkirLast used Lord of the Rings Holiday ReleaseTypical Text Formidable —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Formidable",
    "fallbackDescription": "FormidableAbility WordIntroduced Dragons of TarkirLast used Lord of the Rings Holiday ReleaseTypical Text Formidable —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Formidable",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "grandeur": {
    "name": "Grandeur",
    "description": "GrandeurAbility WordIntroduced Future SightLast used Modern Horizons 3Typical Text Grandeur — Discard another card named CARDNAME:.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Grandeur",
    "fallbackDescription": "GrandeurAbility WordIntroduced Future SightLast used Modern Horizons 3Typical Text Grandeur — Discard another card named CARDNAME:.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Grandeur",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "hellbent": {
    "name": "Hellbent",
    "description": "HellbentAbility WordIntroduced DissensionLast used UnfinityTypical Text Hellbent —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Hellbent",
    "fallbackDescription": "HellbentAbility WordIntroduced DissensionLast used UnfinityTypical Text Hellbent —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Hellbent",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "heroic": {
    "name": "Heroic",
    "description": "HeroicAbility WordIntroduced TherosLast used Foundations JumpstartTypical Text Heroic — Whenever you cast a spell that targets this card,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Heroic",
    "fallbackDescription": "HeroicAbility WordIntroduced TherosLast used Foundations JumpstartTypical Text Heroic — Whenever you cast a spell that targets this card,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Heroic",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "imprint": {
    "name": "Imprint",
    "description": "ImprintAbility WordIntroduced MirrodinLast used Modern Horizons 3Typical Text Imprint —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Imprint",
    "fallbackDescription": "ImprintAbility WordIntroduced MirrodinLast used Modern Horizons 3Typical Text Imprint —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Imprint",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "inspired": {
    "name": "Inspired",
    "description": "5% Scryfall Search keyword:\"Inspired\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Inspired",
    "fallbackDescription": "5% Scryfall Search keyword:\"Inspired\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Inspired",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "join_forces": {
    "name": "Join forces",
    "description": "Join ForcesAbility WordIntroduced CommanderLast used CommanderTypical Text Join forces — Starting with you, each player may pay any amount of mana.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Join_forces",
    "fallbackDescription": "Join ForcesAbility WordIntroduced CommanderLast used CommanderTypical Text Join forces — Starting with you, each player may pay any amount of mana.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Join_forces",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "kinship": {
    "name": "Kinship",
    "description": "KinshipAbility WordIntroduced MorningtideLast used MorningtideTypical Text Kinship — At the beginning of your upkeep, you may look at the top card of your library.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Kinship",
    "fallbackDescription": "KinshipAbility WordIntroduced MorningtideLast used MorningtideTypical Text Kinship — At the beginning of your upkeep, you may look at the top card of your library.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Kinship",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "landfall": {
    "name": "Landfall",
    "description": "2% 4% Scryfall Search keyword:\"Landfall\".",
    "category": "triggered",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Landfall",
    "fallbackDescription": "2% 4% Scryfall Search keyword:\"Landfall\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Landfall",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "lieutenant": {
    "name": "Lieutenant",
    "description": "LieutenantAbility WordIntroduced Commander 2014Last used MH3 CommanderTypical Text Lieutenant — As long as you control your commander,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Lieutenant",
    "fallbackDescription": "LieutenantAbility WordIntroduced Commander 2014Last used MH3 CommanderTypical Text Lieutenant — As long as you control your commander,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Lieutenant",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "metalcraft": {
    "name": "Metalcraft",
    "description": "MetalcraftAbility WordIntroduced Scars of MirrodinLast used The Brothers' War CommanderTypical Text Metalcraft —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Metalcraft",
    "fallbackDescription": "MetalcraftAbility WordIntroduced Scars of MirrodinLast used The Brothers' War CommanderTypical Text Metalcraft —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Metalcraft",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "morbid": {
    "name": "Morbid",
    "description": "4% Scryfall Search keyword:\"Morbid\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Morbid",
    "fallbackDescription": "4% Scryfall Search keyword:\"Morbid\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Morbid",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "parley": {
    "name": "Parley",
    "description": "ParleyAbility WordIntroduced ConspiracyLast used Murders at Karlov Manor CommanderTypical Text Parley — Each player reveals the top card of their library.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Parley",
    "fallbackDescription": "ParleyAbility WordIntroduced ConspiracyLast used Murders at Karlov Manor CommanderTypical Text Parley — Each player reveals the top card of their library.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Parley",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "radiance": {
    "name": "Radiance",
    "description": "RadianceAbility WordIntroduced Ravnica: City of GuildsLast used Ravnica: City of GuildsTypical Text...",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Radiance",
    "fallbackDescription": "RadianceAbility WordIntroduced Ravnica: City of GuildsLast used Ravnica: City of GuildsTypical Text...",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Radiance",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "raid": {
    "name": "Raid",
    "description": "4% Scryfall Search keyword:\"Raid\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Raid",
    "fallbackDescription": "4% Scryfall Search keyword:\"Raid\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Raid",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "rally": {
    "name": "Rally",
    "description": "Rally Ability WordIntroduced Battle for ZendikarLast used Battle for ZendikarTypical Text Rally — Whenever CARDNAME or another Ally enters the battlefield under your control, ….",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Rally",
    "fallbackDescription": "Rally Ability WordIntroduced Battle for ZendikarLast used Battle for ZendikarTypical Text Rally — Whenever CARDNAME or another Ally enters the battlefield under your control, ….",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Rally",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "spell_mastery": {
    "name": "Spell mastery",
    "description": "Spell masteryAbility WordIntroduced Magic OriginsLast used Lord of the Rings Holiday ReleaseTypical Text Spell mastery — If there are two or more instant and/or sorcery cards in your graveyard,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Spell_mastery",
    "fallbackDescription": "Spell masteryAbility WordIntroduced Magic OriginsLast used Lord of the Rings Holiday ReleaseTypical Text Spell mastery — If there are two or more instant and/or sorcery cards in your graveyard,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Spell_mastery",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "strive": {
    "name": "Strive",
    "description": "StriveAbility WordIntroduced Journey into NyxLast used Commander 2020Typical Text Strive — CARDNAME costs [mana] more to cast for each target beyond the first.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Strive",
    "fallbackDescription": "StriveAbility WordIntroduced Journey into NyxLast used Commander 2020Typical Text Strive — CARDNAME costs [mana] more to cast for each target beyond the first.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Strive",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.086Z",
      "qualityRating": "medium"
    }
  },
  "sweep": {
    "name": "Sweep",
    "description": "SweepAbility WordIntroduced Saviors of KamigawaLast used Saviors of KamigawaTypical Text Sweep — Return any number of [basic land] you control to their owner's hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Sweep",
    "fallbackDescription": "SweepAbility WordIntroduced Saviors of KamigawaLast used Saviors of KamigawaTypical Text Sweep — Return any number of [basic land] you control to their owner's hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Sweep",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "tempting_offer": {
    "name": "Tempting offer",
    "description": "Tempting offerAbility WordIntroduced Commander 2013Last used Bloomburrow CommanderTypical Text Tempting offer — [do something].",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Tempting_offer",
    "fallbackDescription": "Tempting offerAbility WordIntroduced Commander 2013Last used Bloomburrow CommanderTypical Text Tempting offer — [do something].",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Tempting_offer",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "threshold": {
    "name": "Threshold",
    "description": "3% Scryfall Search keyword:\"Threshold\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Threshold",
    "fallbackDescription": "3% Scryfall Search keyword:\"Threshold\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Threshold",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "will_of_the_council": {
    "name": "Will of the council",
    "description": "Will of the CouncilAbility WordIntroduced ConspiracyLast used Lord of the Rings CommanderTypical Text Will of the council —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Will_of_the_council",
    "fallbackDescription": "Will of the CouncilAbility WordIntroduced ConspiracyLast used Lord of the Rings CommanderTypical Text Will of the council —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Will_of_the_council",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "adamant": {
    "name": "Adamant",
    "description": "Adamant Ability WordIntroduced Throne of EldraineLast used Commander MastersTypical Text Adamant — If at least three [colour] mana was spent to cast this spell,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Adamant",
    "fallbackDescription": "Adamant Ability WordIntroduced Throne of EldraineLast used Commander MastersTypical Text Adamant — If at least three [colour] mana was spent to cast this spell,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Adamant",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "addendum": {
    "name": "Addendum",
    "description": "Addendum Ability WordIntroduced Ravnica AllegianceLast used New Capenna CommanderTypical Text Addendum — If you cast this spell during your main phase,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Addendum",
    "fallbackDescription": "Addendum Ability WordIntroduced Ravnica AllegianceLast used New Capenna CommanderTypical Text Addendum — If you cast this spell during your main phase,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Addendum",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "council_s_dilemma": {
    "name": "Council's dilemma",
    "description": "Council's DilemmaAbility WordIntroduced Conspiracy: Take the CrownLast used Lord of the Rings CommanderTypical Text Council's dilemma —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Council%27s_dilemma",
    "fallbackDescription": "Council's DilemmaAbility WordIntroduced Conspiracy: Take the CrownLast used Lord of the Rings CommanderTypical Text Council's dilemma —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Council%27s_dilemma",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "eminence": {
    "name": "Eminence",
    "description": "EminenceAbility WordIntroduced Commander 2017Last used March of the Machine/Commander decksTypical Text Eminence — (.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Eminence",
    "fallbackDescription": "EminenceAbility WordIntroduced Commander 2017Last used March of the Machine/Commander decksTypical Text Eminence — (.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Eminence",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "enrage": {
    "name": "Enrage",
    "description": "8% Scryfall Search keyword:\"Enrage\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Enrage",
    "fallbackDescription": "8% Scryfall Search keyword:\"Enrage\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Enrage",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "hero_s_reward": {
    "name": "Hero's Reward",
    "description": "Hero's RewardAbility WordIntroduced Face the HydraLast used Defeat a GodTypical Text Hero's reward — When ~ leaves the battlefield,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Hero's_Reward",
    "fallbackDescription": "Hero's RewardAbility WordIntroduced Face the HydraLast used Defeat a GodTypical Text Hero's reward — When ~ leaves the battlefield,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Hero's_Reward",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "kinfall": {
    "name": "Kinfall",
    "description": "KinfallAbility WordIntroduced Mystery BoosterLast used Mystery BoosterTypical Text Kinfall — Whenever a creature enters the battlefield under your control, if it shares a creature type with [cardname],.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Kinfall",
    "fallbackDescription": "KinfallAbility WordIntroduced Mystery BoosterLast used Mystery BoosterTypical Text Kinfall — Whenever a creature enters the battlefield under your control, if it shares a creature type with [cardname],.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Kinfall",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "landship": {
    "name": "Landship",
    "description": "LandshipAbility WordIntroduced Mystery BoosterLast used Mystery BoosterTypical Text Landship — At the beginning of your upkeep, you may look at the top card of your library.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Landship",
    "fallbackDescription": "LandshipAbility WordIntroduced Mystery BoosterLast used Mystery BoosterTypical Text Landship — At the beginning of your upkeep, you may look at the top card of your library.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Landship",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "legacy": {
    "name": "Legacy",
    "description": "LegacyDCI SanctionedPaper Magic Online Magic Arena RulesType ConstructedMultiplayer Scryfall Search format:\"Legacy\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Legacy",
    "fallbackDescription": "LegacyDCI SanctionedPaper Magic Online Magic Arena RulesType ConstructedMultiplayer Scryfall Search format:\"Legacy\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Legacy",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "revolt": {
    "name": "Revolt",
    "description": "Revolt Ability WordIntroduced Aether RevoltLast used Modern Horizons 3Typical Text Revolt —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Revolt",
    "fallbackDescription": "Revolt Ability WordIntroduced Aether RevoltLast used Modern Horizons 3Typical Text Revolt —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Revolt",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "underdog": {
    "name": "Underdog",
    "description": "UnderdogAbility WordIntroduced Mystery BoosterLast used Mystery BoosterTypical Text Underdog — If yo...",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Underdog",
    "fallbackDescription": "UnderdogAbility WordIntroduced Mystery BoosterLast used Mystery BoosterTypical Text Underdog — If yo...",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Underdog",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "undergrowth": {
    "name": "Undergrowth",
    "description": "Undergrowth Ability WordIntroduced Guilds of RavnicaLast used March of the Machine: The AftermathTypical Text Undergrowth —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Undergrowth",
    "fallbackDescription": "Undergrowth Ability WordIntroduced Guilds of RavnicaLast used March of the Machine: The AftermathTypical Text Undergrowth —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Undergrowth",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "void": {
    "name": "Void",
    "description": "Void is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Void",
    "fallbackDescription": "Void is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Void",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "descend": {
    "name": "Descend",
    "description": "3% 10 Descend 4 cards 30% 30% 30% 10% 9 Descend 8 cards 22.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Descend",
    "fallbackDescription": "3% 10 Descend 4 cards 30% 30% 30% 10% 9 Descend 8 cards 22.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Descend",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "fathomless_descent": {
    "name": "Fathomless descent",
    "description": "3% 10 Descend 4 cards 30% 30% 30% 10% 9 Descend 8 cards 22.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Fathomless_descent",
    "fallbackDescription": "3% 10 Descend 4 cards 30% 30% 30% 10% 9 Descend 8 cards 22.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Fathomless_descent",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "magecraft": {
    "name": "Magecraft",
    "description": "Magecraft Ability WordIntroduced Strixhaven: School of MagesLast used Modern Horizons 3Typical Text Magecraft — Whenever you cast or copy an instant or sorcery spell,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Magecraft",
    "fallbackDescription": "Magecraft Ability WordIntroduced Strixhaven: School of MagesLast used Modern Horizons 3Typical Text Magecraft — Whenever you cast or copy an instant or sorcery spell,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Magecraft",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "teamwork": {
    "name": "Teamwork",
    "description": "Teamwork is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Teamwork",
    "fallbackDescription": "Teamwork is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Teamwork",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "pack_tactics": {
    "name": "Pack tactics",
    "description": "Pack TacticsAbility WordIntroduced Dungeons & Dragons: Adventures in the Forgotten RealmsLast used Alchemy Horizons: Baldur's GateTypical Text Pack tactics — Whenever CARDNAME attacks, if you attacked with creatures with total power 6 or greater this combat,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Pack_tactics",
    "fallbackDescription": "Pack TacticsAbility WordIntroduced Dungeons & Dragons: Adventures in the Forgotten RealmsLast used Alchemy Horizons: Baldur's GateTypical Text Pack tactics — Whenever CARDNAME attacks, if you attacked with creatures with total power 6 or greater this combat,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Pack_tactics",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "coven": {
    "name": "Coven",
    "description": "8% Scryfall Search keyword:\"Coven\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Coven",
    "fallbackDescription": "8% Scryfall Search keyword:\"Coven\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Coven",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "alliance": {
    "name": "Alliance",
    "description": "3% Scryfall Search keyword:\"Alliance\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Alliance",
    "fallbackDescription": "3% Scryfall Search keyword:\"Alliance\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Alliance",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "corrupted": {
    "name": "Corrupted",
    "description": "8% Scryfall Search keyword:\"Corrupted\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Corrupted",
    "fallbackDescription": "8% Scryfall Search keyword:\"Corrupted\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Corrupted",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "secret_council": {
    "name": "Secret council",
    "description": "Secret CouncilAbility WordIntroduced Lord of the Rings CommanderLast used Murders at Karlov Manor CommanderTypical Text Secret council —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Secret_council",
    "fallbackDescription": "Secret CouncilAbility WordIntroduced Lord of the Rings CommanderLast used Murders at Karlov Manor CommanderTypical Text Secret council —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Secret_council",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "celebration": {
    "name": "Celebration",
    "description": "Celebration Ability WordIntroduced Wilds of EldraineLast used Alchemy: EldraineTypical Text Celebration — If two or more nonland permanents entered the battlefield under your turn,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Celebration",
    "fallbackDescription": "Celebration Ability WordIntroduced Wilds of EldraineLast used Alchemy: EldraineTypical Text Celebration — If two or more nonland permanents entered the battlefield under your turn,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Celebration",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "paradox": {
    "name": "Paradox",
    "description": "ParadoxAbility WordIntroduced Doctor WhoLast used Doctor WhoTypical Text Paradox — Whenever you cast a spell from anywhere but your hand.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Paradox",
    "fallbackDescription": "ParadoxAbility WordIntroduced Doctor WhoLast used Doctor WhoTypical Text Paradox — Whenever you cast a spell from anywhere but your hand.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Paradox",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "will_of_the_planeswalkers": {
    "name": "Will of the Planeswalkers",
    "description": "Will of the PlaneswalkersAbility WordIntroduced March of the Machine CommanderLast used March of the Machine CommanderTypical Text Will of the planeswalkers —.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Will_of_the_Planeswalkers",
    "fallbackDescription": "Will of the PlaneswalkersAbility WordIntroduced March of the Machine CommanderLast used March of the Machine CommanderTypical Text Will of the planeswalkers —.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Will_of_the_Planeswalkers",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "survival": {
    "name": "Survival",
    "description": "6% Scryfall Search keyword:\"Survival\".",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Survival",
    "fallbackDescription": "6% Scryfall Search keyword:\"Survival\".",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Survival",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "flurry": {
    "name": "Flurry",
    "description": "Flurry is a Magic: The Gathering mechanic.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Flurry",
    "fallbackDescription": "Flurry is a Magic: The Gathering mechanic.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Flurry",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "valiant": {
    "name": "Valiant",
    "description": "Valiant Ability WordIntroduced BloomburrowLast used Alchemy: BloomburrowTypical Text Valiant — Whenever [this card] becomes the target of a spell or ability you control for the first time each turn,.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Valiant",
    "fallbackDescription": "Valiant Ability WordIntroduced BloomburrowLast used Alchemy: BloomburrowTypical Text Valiant — Whenever [this card] becomes the target of a spell or ability you control for the first time each turn,.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Valiant",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  },
  "start_your_engines_": {
    "name": "Start your engines!",
    "description": "If you have no speed, it starts at 1. It increases once on each of your turns when an opponent loses life. Max speed is 4.",
    "category": "other",
    "isEvergreen": false,
    "wikiUrl": "https://mtg.fandom.com/wiki/Start_your_engines!",
    "fallbackDescription": "If you have no speed, it starts at 1. It increases once on each of your turns when an opponent loses life. Max speed is 4.",
    "source": "basic_fallback",
    "sourceUrl": "https://mtg.fandom.com/wiki/Start_your_engines!",
    "confidence": "medium",
    "metadata": {
      "hasOfficialContent": false,
      "hasFallback": true,
      "lastUpdated": "2025-07-20T04:54:09.087Z",
      "qualityRating": "medium"
    }
  }
};

export const searchMechanics = (query) => {
  if (!query || query.trim() === "") return allMechanics;

  const searchTerm = query.toLowerCase().trim();
  return allMechanics.filter((mechanic) =>
    mechanic.toLowerCase().includes(searchTerm),
  );
};

export const getMechanicsByCategory = (category) => {
  switch (category) {
    case "evergreen":
      return evergreenKeywords;
    default:
      return allMechanics;
  }
};

export const getMechanicDetails = (mechanicName) => {
  const key = mechanicName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return mechanicsDetails[key] || null;
};

export const getMechanicDescription = (mechanicName, preferFallback = false) => {
  const details = getMechanicDetails(mechanicName);
  if (!details) return null;

  return preferFallback && details.fallbackDescription ?
    details.fallbackDescription :
    details.description;
};

export const isOfficialDescription = (mechanicName) => {
  const details = getMechanicDetails(mechanicName);
  return details ? details.source === "official" : false;
};

export const getMechanicWikiUrl = (mechanicName) => {
  const details = getMechanicDetails(mechanicName);
  return details ? details.wikiUrl : null;
};

// Total count: 273 unique mechanics
export const totalMechanics = allMechanics.length;

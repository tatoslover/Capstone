import { useState, useEffect } from "react";
import {
  allMechanics,
  mechanicsDetails,
  evergreenKeywords,
  beginnerFriendly,
  getMechanicDetails,
  getMechanicWikiUrl,
} from "../../data/mechanics";

// Enhanced utility function to clean and format wiki text descriptions
const cleanDescription = (text, mechanicName) => {
  if (!text) return getFallbackDescription(mechanicName);

  // First, extract useful reminder text if it exists
  const reminderMatch = text.match(/\(([^)]+)\)/);
  const reminderText = reminderMatch ? reminderMatch[1] : '';

  // Clean the main text
  let cleaned = text
    // Remove citation markers
    .replace(/\[\d+\]/g, '')
    // Clean up wiki metadata
    .replace(/\b\w*Keyword\s*Ability\w*/gi, '')
    .replace(/Type\s+(Static|Triggered|Activated)\w*/gi, '')
    .replace(/Introduced\s+[^.]+/gi, '')
    .replace(/Last\s+used\s+[^.]+/gi, '')
    .replace(/Reminder\s+Text\s*/gi, '')
    .replace(/Storm\s+Scale\s+\d+/gi, '')
    .replace(/Statistics[^.]+/gi, '')
    .replace(/Scryfall\s+Search[^"]*"[^"]*"/gi, '')
    .replace(/\b\d+(\.\d+)?%/g, '') // Remove percentages
    .replace(/^\w+\s*\(/g, '') // Remove leading ability name with parenthesis
    // Normalise whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .trim();

  // If we have useful reminder text, use it
  if (reminderText && reminderText.length > 20 && !reminderText.includes('keyword')) {
    return reminderText.trim();
  }

  // Otherwise, try to extract the most meaningful sentence
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 15);

  if (sentences.length > 0) {
    let bestSentence = sentences[0].trim();

    // If first sentence is still messy, try the second
    if (sentences.length > 1 && (bestSentence.includes('Keyword') || bestSentence.includes('Type') || bestSentence.length < 20)) {
      bestSentence = sentences[1].trim();
    }

    const result = bestSentence.substring(0, 180).trim();
    // If result is still poor quality, use fallback
    if (result.length < 10 || result.includes('Ability Word') || result.includes('Static')) {
      return getFallbackDescription(mechanicName);
    }
    return result;
  }

  // Fallback: return cleaned text or fallback description
  const fallback = cleaned.substring(0, 120).trim();
  return fallback.length > 10 ? fallback : getFallbackDescription(mechanicName);
};

// Comprehensive fallback descriptions for mechanics - beginner-friendly explanations
const getFallbackDescription = (mechanicName) => {
  const fallbacks = {
    // Evergreen Keywords
    "Flying": "This creature can only be blocked by creatures with flying or reach.",
    "Trample": "Excess combat damage can be dealt to the defending player or planeswalker.",
    "First strike": "This creature deals combat damage before creatures without first strike.",
    "Deathtouch": "Any amount of damage this creature deals is lethal to other creatures.",
    "Lifelink": "Damage dealt by this creature causes you to gain that much life.",
    "Vigilance": "This creature doesn't tap when it attacks.",
    "Haste": "This creature can attack and use tap abilities immediately when it enters.",
    "Hexproof": "This creature can't be targeted by spells or abilities opponents control.",
    "Reach": "This creature can block creatures with flying.",
    "Menace": "This creature can't be blocked except by two or more creatures.",
    "Defender": "This creature can't attack.",
    "Double strike": "This creature deals first strike and regular combat damage.",
    "Indestructible": "This creature can't be destroyed by damage or effects that say 'destroy'.",
    "Flash": "You can cast this spell any time you could cast an instant.",
    "Protection": "This creature can't be damaged, enchanted, blocked, or targeted by the specified quality.",
    "Ward": "Spells and abilities that target this creature cost additional mana to cast.",

    // Popular Non-Evergreen Keywords
    "Cycling": "Pay the cycling cost and discard this card to draw a card.",
    "Flashback": "You can cast this spell from your graveyard by paying its flashback cost.",
    "Kicker": "You may pay an additional cost when casting this spell for an extra effect.",
    "Morph": "Cast this face down as a 2/2 creature, then turn it face up for its morph cost.",
    "Scavenge": "Exile this creature from your graveyard to put +1/+1 counters on target creature.",
    "Convoke": "You can tap creatures to help pay for this spell.",
    "Delve": "You can exile cards from your graveyard to help pay for this spell.",
    "Prowess": "Gets +1/+1 until end of turn whenever you cast a noncreature spell.",
    "Crew": "Tap any number of creatures with total power equal to or greater than this value.",
    "Cascade": "When you cast this spell, reveal cards until you reveal a cheaper spell and cast it.",
    "Storm": "Copy this spell for each spell cast before it this turn.",
    "Suspend": "Exile this card with time counters, then cast it when the last is removed.",
    "Madness": "You may cast this card for its madness cost when you discard it.",
    "Bloodthirst": "If an opponent was dealt damage this turn, this enters with +1/+1 counters.",
    "Evolve": "Whenever a creature enters under your control with greater power or toughness, put a +1/+1 counter on this creature.",
    "Undying": "When this creature dies, if it had no +1/+1 counters, return it with a +1/+1 counter.",
    "Persist": "When this creature dies, if it had no -1/-1 counters, return it with a -1/-1 counter.",
    "Dredge": "If you would draw a card, you may mill cards and return this to your hand instead.",
    "Affinity": "This spell costs less to cast for each artifact you control.",
    "Modular": "This enters with +1/+1 counters and can move them when it dies.",

    // Ability Words & Set Mechanics
    "Addendum": "Provides an additional effect if cast during your main phase.",
    "Living weapon": "When this equipment enters, create a 0/0 creature token and attach to it.",
    "Infect": "Deals damage to creatures as -1/-1 counters and to players as poison counters.",
    "Fabricate": "When this enters, you may create artifact creature tokens or put +1/+1 counters.",
    "Embalm": "Exile this creature card from your graveyard to create a token copy.",
    "Eternalize": "Exile this creature card from your graveyard to create a 4/4 token copy.",
    "Aftermath": "You can cast this from your graveyard, then exile it.",
    "Mentor": "Whenever this attacks, put a +1/+1 counter on target attacking creature with lesser power.",
    "Surveil": "Look at the top cards of your library, then put any number into your graveyard.",
    "Adapt": "Pay the adapt cost to put +1/+1 counters on this if it has no +1/+1 counters.",
    "Spectacle": "You may cast this for its spectacle cost if an opponent lost life this turn.",
    "Riot": "This enters with your choice of haste or a +1/+1 counter.",
    "Escape": "You may cast this from your graveyard by exiling cards and paying its escape cost.",
    "Mutate": "Put this on top or bottom of target non-human creature you own.",
    "Companion": "If your starting deck meets certain conditions, you may cast this from outside the game.",
    "Foretell": "Pay 2 mana to exile this face down, then cast it for its foretell cost later.",
    "Disturb": "You may cast this from your graveyard transformed for its disturb cost.",
    "Cleave": "You may choose to pay the cleave cost to ignore the bracketed text.",
    "Training": "Whenever this attacks with another creature, put a +1/+1 counter on this.",
    "Blitz": "You may cast this for its blitz cost for haste and card draw, but it's sacrificed.",
    "Casualty": "You may sacrifice a creature to copy this spell.",
    "Connive": "Draw a card, then discard a card. If you discarded a nonland, put a +1/+1 counter on this.",
    "Prototype": "You may cast this for its prototype cost as a smaller creature.",
    "Toxic": "Players dealt combat damage by this get poison counters equal to its toxic value.",
    "Backup": "When this enters, put +1/+1 counters on target creature and give it this creature's abilities.",

    // Landwalk abilities
    "Plainswalk": "This creature can't be blocked if defending player controls a Plains.",
    "Islandwalk": "This creature can't be blocked if defending player controls an Island.",
    "Swampwalk": "This creature can't be blocked if defending player controls a Swamp.",
    "Mountainwalk": "This creature can't be blocked if defending player controls a Mountain.",
    "Forestwalk": "This creature can't be blocked if defending player controls a Forest.",
    "Landwalk": "This creature can't be blocked if defending player controls the specified land type.",

    // Other mechanics
    "Equip": "Pay this cost to attach this equipment to target creature you control.",
    "Enchant": "This aura can only be attached to the specified permanent type.",
    "Partner": "You can have two commanders if both have partner.",
    "Annihilator": "Whenever this attacks, defending player sacrifices the specified number of permanents.",
    "Shroud": "This permanent can't be the target of spells or abilities.",
    "Intimidate": "This creature can't be blocked except by artifact creatures and creatures that share a colour.",
    "Fear": "This creature can't be blocked except by artifact creatures and black creatures.",
    "Shadow": "This creature can only block or be blocked by creatures with shadow.",
    "Horsemanship": "This creature can't be blocked except by creatures with horsemanship.",
    "Banding": "You can attack with multiple creatures as a band and redistribute combat damage.",
    "Flanking": "Whenever this blocks or is blocked by a creature without flanking, that creature gets -1/-1.",
    "Bushido": "Whenever this blocks or becomes blocked, it gets +X/+X until end of turn.",
    "Ninjutsu": "Return an unblocked attacker to hand to put this onto the battlefield attacking.",
    "Splice": "You may reveal this from your hand and pay its splice cost to add its effects to another spell.",
    "Soulshift": "When this dies, return target spirit card with lower mana value to your hand.",
    "Champion": "When this enters, exile target creature of the specified type you control or sacrifice this.",
    "Changeling": "This creature is every creature type.",
    "Hideaway": "When this enters, look at the top cards, exile one face down, put the rest on bottom.",
    "Prowl": "You may cast this for its prowl cost if a player was dealt combat damage by the specified creature type.",
    "Reinforce": "Discard this card and pay its reinforce cost to put +1/+1 counters on target creature.",
    "Conspire": "You may tap two untapped creatures that share a colour with this spell to copy it.",
    "Retrace": "You may cast this from your graveyard by discarding a land card.",
    "Devour": "When this enters, you may sacrifice creatures to put +1/+1 counters on it.",
    "Exalted": "Whenever a creature you control attacks alone, it gets +1/+1 until end of turn.",
    "Unearth": "Pay the unearth cost to return this from your graveyard to the battlefield with haste.",
    "Multikicker": "You may pay the kicker cost any number of times.",
    "Rebound": "If you cast this from your hand, exile it and cast it again next turn.",
    "Miracle": "You may cast this for its miracle cost if you drew it this turn.",
    "Soulbond": "You may pair this with another unpaired creature when either enters.",
    "Unleash": "You may have this enter with a +1/+1 counter, but then it can't block.",
    "Overload": "You may cast this for its overload cost to affect all valid targets.",
    "Scavenge": "Exile this from your graveyard and pay its scavenge cost to put +1/+1 counters on target creature.",
    "Cipher": "You may exile this encoded on a creature, then copy it whenever that creature deals combat damage.",
    "Extort": "Whenever you cast a spell, you may pay white or black mana to make each opponent lose 1 life.",
    "Bestow": "You may cast this as an aura for its bestow cost.",
    "Tribute": "As this enters, an opponent may put +1/+1 counters on it to prevent its triggered ability.",
    "Outlast": "Pay the outlast cost and tap this creature to put a +1/+1 counter on it.",
    "Dash": "You may cast this for its dash cost for haste, but return it to your hand at end of turn.",
    "Exploit": "When this enters, you may sacrifice a creature for an additional effect.",
    "Megamorph": "Like morph, but the creature gets a +1/+1 counter when turned face up.",
    "Awaken": "If you pay the awaken cost, target land becomes a creature with +1/+1 counters.",
    "Ingest": "Whenever this deals combat damage to a player, that player exiles the top card of their library.",
    "Devoid": "This spell is colourless.",
    "Surge": "You may pay the surge cost if you or a teammate cast another spell this turn.",
    "Skulk": "This creature can't be blocked by creatures with greater power.",
    "Emerge": "You may sacrifice a creature and pay the emerge cost minus that creature's mana value.",
    "Escalate": "Pay the escalate cost for each mode beyond the first.",
    "Delirium": "This has additional effects if there are four or more card types in your graveyard.",
    "Meld": "These two cards can be exiled and melded into a single double-faced card."
  };

  return fallbacks[mechanicName] || `${mechanicName} is a Magic: The Gathering mechanic.`;
};

export default function FilteredMechanicsList({
  onMechanicSelect,
  selectedMechanic,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechanics, setFilteredMechanics] = useState(
    allMechanics.sort(),
  );
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter mechanics based on search and category
  useEffect(() => {
    let filtered = allMechanics;

    // Apply category filter first
    if (selectedCategory === "evergreen") {
      filtered = evergreenKeywords;
    } else if (selectedCategory === "beginner") {
      filtered = beginnerFriendly;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((mechanic) =>
        mechanic.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredMechanics(filtered.sort());
  }, [searchQuery, selectedCategory]);

  const handleMechanicClick = (mechanicName) => {
    if (onMechanicSelect) {
      const newSelection =
        selectedMechanic?.name === mechanicName
          ? null
          : {
              name: mechanicName,
              id: mechanicName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            };
      onMechanicSelect(newSelection);
    }
  };

  // Remove citation markers like [1], [2][3], etc. from descriptions
  const removeCitations = (text) => {
    if (!text) return text;
    return text.replace(/\[\d+\](\[\d+\])*/g, "");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const categories = [
    { id: "all", label: "All Mechanics", count: allMechanics.length },
    { id: "evergreen", label: "Evergreen", count: evergreenKeywords.length },
    {
      id: "beginner",
      label: "Beginner Friendly",
      count: beginnerFriendly.length,
    },
  ];

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      {/* Centered Header */}
      <h2 style={{
        marginBottom: "1.5rem",
        textAlign: "center",
        fontSize: "2.25rem",
        fontWeight: "700",
        background: "linear-gradient(135deg, #ffc107, #fd7e14)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        ⚡ Mechanics Guide
      </h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#dee2e6",
          maxWidth: "700px",
          margin: "0 auto 2rem auto",
          lineHeight: "1.6",
          fontSize: "1.1rem"
        }}
      >
        Discover and explore {allMechanics.length} Magic: The Gathering mechanics with detailed descriptions and direct links to comprehensive guides
        and abilities
      </p>

      {/* Category Filter Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: "0.5rem 1rem",
              background:
                selectedCategory === category.id ? "#ffc107" : "#343a40",
              color: selectedCategory === category.id ? "#000" : "#fff",
              border: "2px solid #495057",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Search/Filter Bar */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
          position: "relative",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Filter mechanics by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#1a1a1a",
            color: "white",
            border: "2px solid #444",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#ffc107")}
          onBlur={(e) => (e.target.style.borderColor = "#444")}
        />

        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              color: "#999",
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#adb5bd",
          fontSize: "0.9rem",
        }}
      >
        {searchQuery || selectedCategory !== "all" ? (
          <>
            Showing {filteredMechanics.length} of {allMechanics.length}{" "}
            mechanics
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in {categories.find((c) => c.id === selectedCategory)?.label}
              </span>
            )}
          </>
        ) : (
          `Browse all ${allMechanics.length} mechanics below`
        )}
      </div>

      {/* Scrollable Mechanics Container */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "2px solid #444",
          borderRadius: "0.5rem",
          padding: "1rem",
          background: "#1a1a1a",
          marginBottom: "2rem",
        }}
      >
        {filteredMechanics.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#6c757d",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ marginBottom: "0.5rem", color: "#adb5bd" }}>
              No mechanics found
            </h3>
            <p style={{ margin: "0" }}>
              Try adjusting your search term or selecting a different category
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {filteredMechanics.map((mechanic) => {
              const isSelected = selectedMechanic?.name === mechanic;
              const mechanicData = getMechanicDetails(mechanic);

              // Get category colour
              const getCategoryColour = (category) => {
                switch (category) {
                  case "evasion": return "#0d6efd";
                  case "combat": return "#dc3545";
                  case "protection": return "#198754";
                  case "utility": return "#ffc107";
                  case "timing": return "#6f42c1";
                  case "cost_reduction": return "#20c997";
                  case "triggered": return "#fd7e14";
                  default: return "#6c757d";
                }
              };

              return (
                <div
                  key={mechanic}
                  onClick={() => handleMechanicClick(mechanic)}
                  className="mechanic-card"
                  style={{
                    padding: "1rem",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(0, 112, 243, 0.2), rgba(0, 112, 243, 0.1))"
                      : "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                    border: isSelected
                      ? "2px solid #0070f3"
                      : "2px solid #444",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    position: "relative",
                    boxShadow: isSelected
                      ? "0 4px 12px rgba(0, 112, 243, 0.3)"
                      : "0 2px 8px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.background = "linear-gradient(135deg, #2d2d2d, #3a3a3a)";
                      e.target.style.borderColor = "#6c757d";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.background = "linear-gradient(135deg, #1a1a1a, #2d2d2d)";
                      e.target.style.borderColor = "#444";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
                    }
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#ffffff",
                      fontSize: "1rem",
                      marginBottom: "0.75rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {mechanic}
                  </div>

                  {/* Enhanced Category badges */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.375rem",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {mechanicData?.isEvergreen && (
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "#28a745",
                          borderRadius: "0.375rem",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                        }}
                      >
                        ♾️ Evergreen
                      </span>
                    )}
                    {mechanicData?.category && (
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: getCategoryColour(mechanicData.category),
                          borderRadius: "0.375rem",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          color: "#ffffff",
                          textTransform: "capitalize",
                          boxShadow: `0 2px 4px ${getCategoryColour(mechanicData.category)}40`,
                        }}
                      >
                        {mechanicData.category.replace("_", " ")}
                      </span>
                    )}
                    {beginnerFriendly.includes(mechanic) && (
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "#17a2b8",
                          borderRadius: "0.375rem",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          boxShadow: "0 2px 4px rgba(23, 162, 184, 0.3)",
                        }}
                      >
                        ✨ Beginner
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Mechanic Details */}
      {selectedMechanic && (
        <div className="section-content">
          <h3
            style={{
              margin: "0 0 1.5rem 0",
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: "600",
              textAlign: "center",
              borderBottom: "2px solid #ffc107",
              paddingBottom: "0.5rem",
            }}
          >
            {selectedMechanic.name}
          </h3>

          {(() => {
            const mechanicData = getMechanicDetails(selectedMechanic.name);
            const wikiUrl = getMechanicWikiUrl(selectedMechanic.name);

            if (mechanicData) {
              return (
                <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                  {/* Clean Description */}
                  <div style={{
                    background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                    padding: "1.25rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #444",
                    marginBottom: "1.5rem"
                  }}>
                    <p style={{
                      margin: "0",
                      fontSize: "1.1rem",
                      lineHeight: "1.7",
                      color: "#ffffff",
                      fontWeight: "400"
                    }}>
                      {cleanDescription(mechanicData.description, selectedMechanic.name)}
                    </p>
                  </div>

                  {/* Enhanced Category badges */}
                  {(mechanicData.category ||
                    mechanicData.isEvergreen ||
                    evergreenKeywords.includes(selectedMechanic.name) ||
                    beginnerFriendly.includes(selectedMechanic.name)) && (
                    <div style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      marginBottom: "2rem",
                      padding: "1rem",
                      background: "rgba(0, 0, 0, 0.3)",
                      borderRadius: "0.75rem",
                      border: "1px solid #333"
                    }}>
                      {(mechanicData.isEvergreen || evergreenKeywords.includes(selectedMechanic.name)) && (
                        <span
                          style={{
                            padding: "0.5rem 1rem",
                            background: "linear-gradient(135deg, #28a745, #20c997)",
                            borderRadius: "0.5rem",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            boxShadow: "0 3px 8px rgba(40, 167, 69, 0.3)",
                          }}
                        >
                          ♾️ Evergreen Keyword
                        </span>
                      )}
                      {beginnerFriendly.includes(selectedMechanic.name) && (
                        <span
                          style={{
                            padding: "0.5rem 1rem",
                            background: "linear-gradient(135deg, #17a2b8, #0d6efd)",
                            borderRadius: "0.5rem",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            boxShadow: "0 3px 8px rgba(23, 162, 184, 0.3)",
                          }}
                        >
                          ✨ Beginner-Friendly
                        </span>
                      )}
                      {mechanicData.category && (
                        <span
                          style={{
                            padding: "0.5rem 1rem",
                            background: "linear-gradient(135deg, #6f42c1, #495057)",
                            borderRadius: "0.5rem",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            boxShadow: "0 3px 8px rgba(111, 66, 193, 0.3)",
                          }}
                        >
                          📂 {mechanicData.category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Enhanced Wiki Link */}
                  {wikiUrl && (
                    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                      <a
                        href={wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "1rem 2rem",
                          background: "linear-gradient(135deg, #0070f3, #0051cc)",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "0.75rem",
                          fontSize: "1rem",
                          fontWeight: "600",
                          boxShadow: "0 4px 12px rgba(0, 112, 243, 0.3)",
                          transition: "all 0.2s ease",
                          border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 6px 20px rgba(0, 112, 243, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(0, 112, 243, 0.3)";
                        }}
                      >
                        📖 Learn more on MTG Wiki →
                      </a>
                      <p style={{
                        margin: "0.75rem 0 0 0",
                        color: "#adb5bd",
                        fontSize: "0.9rem",
                        fontStyle: "italic"
                      }}>
                        Get comprehensive rules, examples, and card listings
                      </p>
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 2rem",
                    background: "linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(253, 126, 20, 0.1))",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                  }}
                >
                  <div style={{
                    fontSize: "3rem",
                    marginBottom: "1.5rem",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
                  }}>
                    📚
                  </div>
                  <h4 style={{
                    margin: "0 0 1rem 0",
                    color: "#ffc107",
                    fontSize: "1.25rem",
                    fontWeight: "600"
                  }}>
                    More Information Coming Soon
                  </h4>
                  <p style={{
                    margin: "0 0 1.5rem 0",
                    lineHeight: "1.6",
                    color: "#dee2e6",
                    fontSize: "1rem"
                  }}>
                    Enhanced details for <strong style={{ color: "#ffffff" }}>{selectedMechanic.name}</strong> are being prepared.
                  </p>
                  {getMechanicWikiUrl(selectedMechanic.name) && (
                    <a
                      href={getMechanicWikiUrl(selectedMechanic.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        background: "linear-gradient(135deg, #0070f3, #0051cc)",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "0.5rem",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        boxShadow: "0 3px 8px rgba(0, 112, 243, 0.3)"
                      }}
                    >
                      📖 Learn more on MTG Wiki →
                    </a>
                  )}
                </div>
              );
            }
          })()}
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(
              auto-fit,
              minmax(160px, 1fr)
            ) !important;
          }

          div[style*="maxHeight"] {
            max-height: 300px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr 1fr !important;
          }

          div[style*="maxHeight"] {
            max-height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
}

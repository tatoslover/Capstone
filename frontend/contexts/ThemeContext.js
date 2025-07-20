import { createContext, useContext, useState, useEffect } from "react";

// MTG Mana Colour Themes with proper contrast ratios
const MTG_THEMES = {
  white: {
    name: "White Mana",
    symbol: "⚪",
    primary: "transparent",
    secondary: "transparent",
    accent: "#E0E0E0",
    highlight: "#CCCCCC",
    text: "#FFFFFF",
    textLight: "#B0B0B0",
    border: "#404040",
    success: "#28A745",
    warning: "#FFC107",
    error: "#DC3545",
    background: "transparent",
    cardBg: "#1A1A1A",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage:
      "https://cards.scryfall.io/art_crop/front/d/f/df31f72c-076e-4d8e-9975-6d6281ab71f6.jpg?1751992023",
  },
  blue: {
    name: "Blue Mana",
    symbol: "🔵",
    primary: "transparent",
    secondary: "transparent",
    accent: "#64B5F6",
    highlight: "#42A5F5",
    text: "#FFFFFF",
    textLight: "#B0B0B0",
    border: "#404040",
    success: "#00695C",
    warning: "#FF8F00",
    error: "#C62828",
    background: "transparent",
    cardBg: "#1A1A1A",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage:
      "https://cards.scryfall.io/art_crop/front/a/a/aaa212be-1db5-4493-86c8-c01d29348e31.jpg?1751992105",
  },
  black: {
    name: "Black Mana",
    symbol: "⚫",
    primary: "transparent",
    secondary: "transparent",
    accent: "#AB47BC",
    highlight: "#9C27B0",
    text: "#FFFFFF",
    textLight: "#B0B0B0",
    border: "#404040",
    success: "#2E7D32",
    warning: "#F57C00",
    error: "#D32F2F",
    background: "transparent",
    cardBg: "#1A1A1A",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage:
      "https://cards.scryfall.io/art_crop/front/5/8/58496a56-437f-4204-9691-f63795e5cdab.jpg?1751992198",
  },
  red: {
    name: "Red Mana",
    symbol: "🔴",
    primary: "transparent",
    secondary: "transparent",
    accent: "#F44336",
    highlight: "#E53935",
    text: "#FFFFFF",
    textLight: "#B0B0B0",
    border: "#404040",
    success: "#388E3C",
    warning: "#FF8F00",
    error: "#C62828",
    background: "transparent",
    cardBg: "#1A1A1A",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage:
      "https://cards.scryfall.io/art_crop/front/5/c/5cd39b01-9a06-4575-9c63-9fb3ba9ef101.jpg?1751992245",
  },
  green: {
    name: "Green Mana",
    symbol: "🟢",
    primary: "transparent",
    secondary: "transparent",
    accent: "#66BB6A",
    highlight: "#4CAF50",
    text: "#FFFFFF",
    textLight: "#B0B0B0",
    border: "#404040",
    success: "#2E7D32",
    warning: "#F57C00",
    error: "#C62828",
    background: "transparent",
    cardBg: "#1A1A1A",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage:
      "https://cards.scryfall.io/art_crop/front/f/b/fb62605c-a58e-4e53-8336-b2bee316b5a6.jpg?1751992298",
  },
  colorless: {
    name: "Colourless",
    symbol: "🔘",
    primary: "transparent",
    secondary: "transparent",
    accent: "#ffd700",
    highlight: "#ffed4e",
    text: "#ffffff",
    textLight: "#b0b0b0",
    border: "#404040",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
    background: "transparent",
    cardBg: "#1a1a1a",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage:
      "https://cards.scryfall.io/art_crop/front/1/f/1fc2871b-c685-4951-b8e2-7370b9668f7e.jpg?1690002945",
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("white");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("mtgTheme");
    if (savedTheme && MTG_THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const theme = MTG_THEMES[currentTheme];
    const root = document.documentElement;

    // Apply theme colours as CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      if (
        typeof value === "string" &&
        key !== "name" &&
        key !== "symbol" &&
        key !== "backgroundImage"
      ) {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Apply background image directly to body to avoid CSS parsing issues
    if (theme.backgroundImage) {
      document.body.style.backgroundColor = "#000000";
      document.body.style.backgroundImage = `url("${theme.backgroundImage}")`;
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundRepeat = "no-repeat";
    } else {
      document.body.style.backgroundColor = "#000000";
      document.body.style.backgroundImage = "none";
    }

    // Apply additional computed properties
    root.style.setProperty("--theme-primary-rgb", hexToRgb(theme.primary));
    root.style.setProperty("--theme-accent-rgb", hexToRgb(theme.accent));

    // Add gold-specific CSS variables for colorless theme
    if (currentTheme === "colorless") {
      const accentRgb = hexToRgb(theme.accent);
      const highlightRgb = hexToRgb(theme.highlight);
      root.style.setProperty("--gold-accent", theme.accent);
      root.style.setProperty("--gold-highlight", theme.highlight);
      root.style.setProperty("--colourless-primary", theme.accent);
      root.style.setProperty("--colourless-secondary", theme.highlight);
      root.style.setProperty("--gold-shadow", `0 2px 4px rgba(${accentRgb}, 0.3)`);
    }

    // Save to localStorage
    localStorage.setItem("mtgTheme", currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (MTG_THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    theme: MTG_THEMES[currentTheme],
    themes: MTG_THEMES,
    changeTheme,
    availableThemes: Object.keys(MTG_THEMES),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  if (hex === "transparent") {
    return "26, 26, 26"; // Default dark background RGB
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "26, 26, 26"; // Default dark background RGB
};

export default ThemeContext;

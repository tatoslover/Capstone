import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeSelector({ compact = false, showLabel = true }) {
  const { currentTheme, themes, changeTheme, availableThemes } = useTheme();

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
  };

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          alignItems: "center",
        }}
      >
        {availableThemes.map((themeName) => {
          const theme = themes[themeName];
          const isActive = currentTheme === themeName;

          return (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              title={`Switch to ${theme.name}`}
              style={{
                width: "1.75rem",
                height: "1.75rem",
                border: isActive
                  ? "2px solid var(--theme-accent)"
                  : "1px solid var(--theme-border)",
                borderRadius: "50%",
                background: isActive
                  ? "var(--theme-primary)"
                  : "var(--theme-cardBg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                transition: "all 0.2s ease",
                boxShadow: isActive
                  ? "0 2px 4px var(--theme-shadowColor)"
                  : "0 1px 2px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
                  e.target.style.backgroundImage = `url("${theme.backgroundImage}")`;
                  e.target.style.backgroundSize = "cover";
                  e.target.style.backgroundPosition = "center";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
                  e.target.style.backgroundImage = "none";
                }
              }}
            >
              {theme.symbol}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--theme-cardBg)",
        border: "1px solid var(--theme-border)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {showLabel && (
        <div style={{ marginBottom: "1rem" }}>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              color: "var(--theme-accent)",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            🎨 Choose Your Mana Theme
          </h3>
          <p
            style={{
              margin: 0,
              color: "var(--theme-textLight)",
              fontSize: "0.9rem",
              lineHeight: "1.4",
            }}
          >
            Select a mana colour to personalise your experience. Each theme
            subtly adjusts colours whilst maintaining readability.
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {availableThemes.map((themeName) => {
          const theme = themes[themeName];
          const isActive = currentTheme === themeName;

          return (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem 0.75rem",
                border: isActive
                  ? "2px solid var(--theme-accent)"
                  : "1px solid var(--theme-border)",
                borderRadius: "0.5rem",
                background: isActive
                  ? "var(--theme-primary)"
                  : "var(--theme-cardBg)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isActive
                  ? "0 4px 8px var(--theme-shadowColor)"
                  : "0 2px 4px rgba(0,0,0,0.05)",
                transform: isActive ? "translateY(-2px)" : "translateY(0)",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                  e.target.style.borderColor = "var(--theme-accent)";
                  e.target.style.backgroundImage = `linear-gradient(rgba(26,26,26,0.8), rgba(26,26,26,0.8)), url("${theme.backgroundImage}")`;
                  e.target.style.backgroundSize = "cover";
                  e.target.style.backgroundPosition = "center";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                  e.target.style.borderColor = "var(--theme-border)";
                  e.target.style.backgroundImage = "none";
                }
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                  filter: isActive
                    ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    : "none",
                }}
              >
                {theme.symbol}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "var(--theme-accent)" : "var(--theme-text)",
                  textAlign: "center",
                }}
              >
                {theme.name}
              </div>
              {isActive && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--theme-textLight)",
                    marginTop: "0.25rem",
                    fontWeight: "400",
                  }}
                >
                  Active
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showLabel && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "var(--theme-secondary)",
            borderRadius: "0.5rem",
            border: "1px solid var(--theme-border)",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--theme-textLight)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>💡</span>
            <span>
              Themes include subtle land art backgrounds and are automatically
              saved between visits. All themes maintain proper contrast for
              accessibility.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

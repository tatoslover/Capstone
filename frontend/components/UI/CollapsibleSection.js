import { useState } from "react";

export default function CollapsibleSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
  icon = null,
  headerStyle = {},
  contentStyle = {},
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`card ${className}`} style={{ marginBottom: "2rem" }}>
      {/* Clickable Header */}
      <div
        onClick={toggleOpen}
        style={{
          cursor: "pointer",
          padding: "1.5rem",
          borderBottom: isOpen ? "1px solid var(--theme-border)" : "none",
          transition: "all 0.3s ease",
          userSelect: "none",
          ...headerStyle,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(var(--theme-accent-rgb), 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Title and Icon */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {icon && (
              <span
                style={{
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icon}
              </span>
            )}
            <div>
              <h2
                style={{
                  margin: 0,
                  textAlign: "left",
                  fontSize: "1.5rem",
                  color: "var(--theme-accent)",
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    color: "var(--theme-textLight)",
                    fontSize: "0.9rem",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Expand/Collapse Arrow */}
          <div
            style={{
              fontSize: "1.25rem",
              color: "var(--theme-accent)",
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              display: "flex",
              alignItems: "center",
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          maxHeight: isOpen ? "10000px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          style={{
            padding: isOpen ? "1.5rem" : "0 1.5rem",
            transition: "padding 0.3s ease-in-out",
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </div>

      {/* Collapsed State Hint */}
      {!isOpen && (
        <div
          style={{
            padding: "0.75rem 1.5rem",
            color: "var(--theme-textLight)",
            fontSize: "0.875rem",
            fontStyle: "italic",
            textAlign: "center",
            borderTop: "1px solid var(--theme-border)",
            background: "rgba(var(--theme-accent-rgb), 0.05)",
          }}
        >
          Click to expand and learn more about {title.toLowerCase()}
        </div>
      )}
    </div>
  );
}

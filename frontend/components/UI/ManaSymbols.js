import React from "react";

export default function ManaSymbols({ size = 48, className = "" }) {
  return (
    <div
      className={`mana-symbols ${className}`}
      style={{ width: size * 2.5, height: size * 1.5 }}
    >
      <svg
        width={size * 2.5}
        height={size * 1.5}
        viewBox="0 0 250 150"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Blue Mana - Water Drop */}
        <g className="mana-blue">
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="#000000"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="6"
          />
          <path
            d="M50 25 C40 35, 40 45, 50 55 C60 45, 60 35, 50 25 Z"
            fill="#0E68AB"
          />
          <path
            d="M55 35 C50 40, 50 45, 55 50 C60 45, 60 40, 55 35 Z"
            fill="#4A90E2"
          />
        </g>

        {/* Black Mana - Skull */}
        <g className="mana-black">
          <circle
            cx="125"
            cy="50"
            r="35"
            fill="#000000"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="6"
          />
          <ellipse cx="125" cy="45" rx="20" ry="15" fill="#9370DB" />
          <circle cx="115" cy="40" r="6" fill="#000000" />
          <circle cx="135" cy="40" r="6" fill="#000000" />
          <rect x="122" y="50" width="6" height="12" fill="#000000" />
          <path
            d="M110 65 Q125 70 140 65"
            stroke="#000000"
            strokeWidth="3"
            fill="none"
          />
        </g>

        {/* Red Mana - Flame */}
        <g className="mana-red">
          <circle
            cx="200"
            cy="50"
            r="35"
            fill="#000000"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="6"
          />
          <path
            d="M200 25 C190 30, 185 40, 190 50 C195 45, 200 45, 205 50 C210 40, 205 30, 200 25 Z"
            fill="#D3202A"
          />
          <path
            d="M200 30 C195 35, 192 42, 195 48 C198 45, 200 45, 202 48 C205 42, 202 35, 200 30 Z"
            fill="#FF4444"
          />
          <path
            d="M205 35 C200 38, 198 43, 202 47 C205 44, 207 44, 210 47 C212 43, 210 38, 205 35 Z"
            fill="#FF6666"
          />
        </g>

        {/* White Mana - Sun */}
        <g className="mana-white">
          <circle
            cx="87.5"
            cy="100"
            r="35"
            fill="#000000"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="6"
          />
          <circle cx="87.5" cy="100" r="12" fill="#FFFBD5" />
          <g transform="translate(87.5, 100)">
            <line
              x1="0"
              y1="-25"
              x2="0"
              y2="-20"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="0"
              y1="25"
              x2="0"
              y2="20"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="-25"
              y1="0"
              x2="-20"
              y2="0"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="25"
              y1="0"
              x2="20"
              y2="0"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="-18"
              y1="-18"
              x2="-14"
              y2="-14"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="18"
              y1="18"
              x2="14"
              y2="14"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="18"
              y1="-18"
              x2="14"
              y2="-14"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
            <line
              x1="-18"
              y1="18"
              x2="-14"
              y2="14"
              stroke="#FFFBD5"
              strokeWidth="3"
            />
          </g>
        </g>

        {/* Green Mana - Tree/Forest */}
        <g className="mana-green">
          <circle
            cx="162.5"
            cy="100"
            r="35"
            fill="#000000"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="6"
          />
          <ellipse cx="162.5" cy="90" rx="18" ry="15" fill="#00733E" />
          <ellipse cx="150" cy="95" rx="12" ry="10" fill="#228B22" />
          <ellipse cx="175" cy="95" rx="12" ry="10" fill="#228B22" />
          <ellipse cx="162.5" cy="105" rx="15" ry="12" fill="#32CD32" />
          <rect x="160" y="105" width="5" height="15" fill="#8B4513" />
        </g>

        {/* Magical Glow Effect */}
        <defs>
          <filter id="mana-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <animate id="pulse">
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.05;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </animate>
        </defs>
      </svg>

      <style jsx>{`
        .mana-symbols {
          display: inline-block;
          position: relative;
        }

        .mana-symbols svg {
          filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
        }

        .mana-blue,
        .mana-black,
        .mana-red,
        .mana-white,
        .mana-green {
          filter: url(#mana-glow);
          transform-origin: center;
        }

        .mana-blue {
          animation: gentle-pulse 4s ease-in-out infinite;
        }

        .mana-black {
          animation: gentle-pulse 4s ease-in-out infinite 0.8s;
        }

        .mana-red {
          animation: gentle-pulse 4s ease-in-out infinite 1.6s;
        }

        .mana-white {
          animation: gentle-pulse 4s ease-in-out infinite 2.4s;
        }

        .mana-green {
          animation: gentle-pulse 4s ease-in-out infinite 3.2s;
        }

        @keyframes gentle-pulse {
          0%,
          90%,
          100% {
            transform: scale(1);
            filter: url(#mana-glow) brightness(1);
          }
          5% {
            transform: scale(1.05);
            filter: url(#mana-glow) brightness(1.2);
          }
        }

        /* Hover effect */
        .mana-symbols:hover svg {
          filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.5));
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .mana-symbols:hover .mana-blue,
        .mana-symbols:hover .mana-black,
        .mana-symbols:hover .mana-red,
        .mana-symbols:hover .mana-white,
        .mana-symbols:hover .mana-green {
          animation: energize 0.6s ease-in-out;
        }

        @keyframes energize {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

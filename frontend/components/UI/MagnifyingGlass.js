import React from "react";

export default function MagnifyingGlass({ size = 48, className = "" }) {
  return (
    <div
      className={`magnifying-glass ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Magnifying Glass Lens */}
        <circle
          cx="35"
          cy="35"
          r="30"
          fill="none"
          stroke="var(--theme-primary, #007bff)"
          strokeWidth="4"
        />

        {/* Glass shine effect */}
        <ellipse
          cx="30"
          cy="30"
          rx="18"
          ry="15"
          fill="url(#glassShine)"
          opacity="0.3"
          transform="rotate(-45 30 30)"
        />

        {/* Handle */}
        <line
          x1="56"
          y1="56"
          x2="75"
          y2="75"
          stroke="var(--theme-primary, #007bff)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Handle grip detail */}
        <line
          x1="65"
          y1="65"
          x2="70"
          y2="70"
          stroke="var(--theme-accent, #8b7355)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Animated search sparkle */}
        <g className="search-sparkles">
          <circle cx="35" cy="35" r="2" fill="#FFD700">
            <animate
              attributeName="cx"
              values="20;35;50;35;20"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="35;20;35;50;35"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;1;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="35" cy="35" r="1.5" fill="#4169E1">
            <animate
              attributeName="cx"
              values="35;25;45;25;35"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="cy"
              values="25;45;45;25;25"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
        </g>

        {/* Animated magnification lines */}
        <g className="magnify-effect">
          <line
            x1="35"
            y1="35"
            x2="35"
            y2="35"
            stroke="#4169E1"
            strokeWidth="1"
            opacity="0"
          >
            <animate
              attributeName="x2"
              values="35;55;35"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="35;15;35"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </line>

          <line
            x1="35"
            y1="35"
            x2="35"
            y2="35"
            stroke="#4169E1"
            strokeWidth="1"
            opacity="0"
          >
            <animate
              attributeName="x2"
              values="35;15;35"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.6s"
            />
            <animate
              attributeName="y2"
              values="35;55;35"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.6s"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </line>
        </g>

        {/* Definitions for gradients */}
        <defs>
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#FFFFFF", stopOpacity: 0.8 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#FFFFFF", stopOpacity: 0 }}
            />
          </linearGradient>

          <filter id="search-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .magnifying-glass {
          display: inline-block;
          position: relative;
        }

        .magnifying-glass svg {
          filter: drop-shadow(0 0 4px rgba(0, 123, 255, 0.3));
          transition: all 0.3s ease;
        }

        .search-sparkles {
          filter: url(#search-glow);
        }

        /* Hover effect */
        .magnifying-glass:hover svg {
          filter: drop-shadow(0 0 8px rgba(0, 123, 255, 0.5));
          transform: scale(1.1) rotate(-5deg);
        }

        .magnifying-glass:hover .search-sparkles {
          animation: intensify 0.5s ease-out;
        }

        @keyframes intensify {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Active searching animation */
        .magnifying-glass svg {
          animation: subtle-search 4s ease-in-out infinite;
        }

        @keyframes subtle-search {
          0%,
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(-2px) translateY(-2px) rotate(-3deg);
          }
          50% {
            transform: translateX(2px) translateY(-2px) rotate(3deg);
          }
          75% {
            transform: translateX(-2px) translateY(2px) rotate(-3deg);
          }
        }
      `}</style>
    </div>
  );
}

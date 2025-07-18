import React from 'react';

export default function MinimalWizard({ size = 48, className = '' }) {
  return (
    <div className={`minimal-wizard ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Minimalist Wizard Figure */}
        <g className="wizard-figure">
          {/* Simple Triangle Hat */}
          <path
            d="M50 20 L40 50 L60 50 Z"
            fill="var(--theme-primary, #2D3748)"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="1.5"
          />

          {/* Head Circle */}
          <circle
            cx="50"
            cy="55"
            r="6"
            fill="var(--theme-primary, #2D3748)"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="1"
          />

          {/* Simple Body */}
          <rect
            x="45"
            y="61"
            width="10"
            height="20"
            fill="var(--theme-primary, #2D3748)"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="1"
            rx="5"
          />

          {/* Staff */}
          <line
            x1="35"
            y1="45"
            x2="35"
            y2="85"
            stroke="var(--theme-accent, #805ad5)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Glowing Staff Orb */}
          <circle
            cx="35"
            cy="40"
            r="4"
            fill="#4169E1"
            opacity="0.9"
          >
            <animate
              attributeName="fill"
              values="#4169E1;#9370DB;#00BFFF;#FFD700;#4169E1"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="4;5.5;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner Orb Glow */}
          <circle
            cx="35"
            cy="40"
            r="2"
            fill="#FFFFFF"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Gentle Magic Aura */}
        <circle
          cx="35"
          cy="40"
          r="8"
          fill="none"
          stroke="#9370DB"
          strokeWidth="1"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="6;12;6"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.4;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Subtle Energy Particles */}
        <g className="energy-particles">
          <circle
            cx="35"
            cy="40"
            r="1"
            fill="#FFD700"
            opacity="0"
          >
            <animate
              attributeName="cy"
              values="40;25;15"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx="35"
            cy="40"
            r="0.8"
            fill="#87CEEB"
            opacity="0"
          >
            <animate
              attributeName="cy"
              values="40;20;10"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="cx"
              values="35;30;25"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="1;0.3;0"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>

          <circle
            cx="35"
            cy="40"
            r="0.6"
            fill="#DDA0DD"
            opacity="0"
          >
            <animate
              attributeName="cy"
              values="40;22;12"
              dur="2.8s"
              repeatCount="indefinite"
              begin="2s"
            />
            <animate
              attributeName="cx"
              values="35;40;45"
              dur="2.8s"
              repeatCount="indefinite"
              begin="2s"
            />
            <animate
              attributeName="opacity"
              values="1;0.4;0"
              dur="2.8s"
              repeatCount="indefinite"
              begin="2s"
            />
          </circle>
        </g>

        {/* Magical Glow Effect */}
        <defs>
          <filter id="minimal-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .minimal-wizard {
          display: inline-block;
          position: relative;
        }

        .minimal-wizard svg {
          filter: drop-shadow(0 0 6px rgba(65, 105, 225, 0.3));
        }

        .wizard-figure {
          filter: url(#minimal-glow);
        }

        .energy-particles {
          filter: url(#minimal-glow);
        }

        /* Hover effect */
        .minimal-wizard:hover svg {
          filter: drop-shadow(0 0 12px rgba(65, 105, 225, 0.5));
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .minimal-wizard:hover .wizard-figure {
          animation: gentle-pulse 1.5s ease-in-out;
        }

        .minimal-wizard:hover .energy-particles {
          animation: particle-burst 2s ease-out;
        }

        @keyframes gentle-pulse {
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

        @keyframes particle-burst {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

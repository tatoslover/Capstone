import React from 'react';

export default function WizardStaff({ size = 48, className = '' }) {
  return (
    <div className={`wizard-staff ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Staff Body */}
        <rect
          x="47"
          y="25"
          width="6"
          height="60"
          fill="var(--theme-primary, #8B4513)"
          stroke="var(--theme-accent, #805ad5)"
          strokeWidth="1"
          rx="3"
        />

        {/* Staff Grip */}
        <rect
          x="45"
          y="70"
          width="10"
          height="8"
          fill="var(--theme-secondary, #654321)"
          rx="2"
        />

        {/* Orb Holder */}
        <circle
          cx="50"
          cy="20"
          r="8"
          fill="none"
          stroke="var(--theme-accent, #805ad5)"
          strokeWidth="2"
        />

        {/* Magical Orb */}
        <circle
          cx="50"
          cy="20"
          r="6"
          fill="#4169E1"
          opacity="0.8"
        >
          <animate
            attributeName="fill"
            values="#4169E1;#9370DB;#00BFFF;#4169E1"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="6;7;6"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Inner Orb Glow */}
        <circle
          cx="50"
          cy="20"
          r="4"
          fill="#FFFFFF"
          opacity="0.3"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Sparkles emanating from orb */}
        <g className="sparkles">
          {/* Sparkle 1 */}
          <circle
            cx="50"
            cy="20"
            r="1"
            fill="#FFD700"
            opacity="0"
          >
            <animate
              attributeName="cx"
              values="50;40;30"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="20;15;10"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Sparkle 2 */}
          <circle
            cx="50"
            cy="20"
            r="1"
            fill="#FFD700"
            opacity="0"
          >
            <animate
              attributeName="cx"
              values="50;60;70"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="cy"
              values="20;15;10"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;0"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>

          {/* Sparkle 3 */}
          <circle
            cx="50"
            cy="20"
            r="1"
            fill="#FFD700"
            opacity="0"
          >
            <animate
              attributeName="cx"
              values="50;45;35"
              dur="1.8s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="cy"
              values="20;10;5"
              dur="1.8s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="1;0.7;0"
              dur="1.8s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>

          {/* Sparkle 4 */}
          <circle
            cx="50"
            cy="20"
            r="1"
            fill="#FFD700"
            opacity="0"
          >
            <animate
              attributeName="cx"
              values="50;55;65"
              dur="2.2s"
              repeatCount="indefinite"
              begin="1.5s"
            />
            <animate
              attributeName="cy"
              values="20;12;8"
              dur="2.2s"
              repeatCount="indefinite"
              begin="1.5s"
            />
            <animate
              attributeName="opacity"
              values="1;0.6;0"
              dur="2.2s"
              repeatCount="indefinite"
              begin="1.5s"
            />
          </circle>
        </g>

        {/* Energy rings around orb */}
        <circle
          cx="50"
          cy="20"
          r="10"
          fill="none"
          stroke="#9370DB"
          strokeWidth="1"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="8;15;8"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="50"
          cy="20"
          r="12"
          fill="none"
          stroke="#4169E1"
          strokeWidth="1"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="10;18;10"
            dur="4s"
            repeatCount="indefinite"
            begin="1s"
          />
          <animate
            attributeName="opacity"
            values="0.4;0;0.4"
            dur="4s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>

        {/* Magical Glow Effect */}
        <defs>
          <filter id="orb-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .wizard-staff {
          display: inline-block;
          position: relative;
        }

        .wizard-staff svg {
          filter: drop-shadow(0 0 6px rgba(65, 105, 225, 0.4));
        }

        .sparkles {
          filter: url(#orb-glow);
        }

        /* Hover effect */
        .wizard-staff:hover svg {
          filter: drop-shadow(0 0 12px rgba(65, 105, 225, 0.6));
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .wizard-staff:hover .sparkles {
          animation: burst 1s ease-out;
        }

        @keyframes burst {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

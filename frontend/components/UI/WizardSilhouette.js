import React from 'react';

export default function WizardSilhouette({ size = 48, className = '' }) {
  return (
    <div className={`wizard-silhouette ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Wizard Silhouette */}
        <g className="wizard-body">
          {/* Hat */}
          <path
            d="M45 15 L20 60 L35 60 L35 65 L65 65 L65 60 L80 60 L55 15 Z"
            fill="var(--theme-primary, #2D3748)"
            opacity="0.9"
          />

          {/* Head */}
          <circle
            cx="50"
            cy="65"
            r="8"
            fill="var(--theme-primary, #2D3748)"
            opacity="0.9"
          />

          {/* Beard */}
          <path
            d="M42 70 Q50 78 58 70 Q56 82 50 85 Q44 82 42 70"
            fill="var(--theme-primary, #2D3748)"
            opacity="0.8"
          />

          {/* Body/Robes */}
          <path
            d="M35 75 Q50 73 65 75 L68 95 Q50 93 32 95 Z"
            fill="var(--theme-primary, #2D3748)"
            opacity="0.9"
          />

          {/* Staff */}
          <rect
            x="25"
            y="50"
            width="3"
            height="45"
            fill="var(--theme-accent, #805ad5)"
            opacity="0.8"
            transform="rotate(-15 26.5 72.5)"
          />

          {/* Staff Top */}
          <circle
            cx="22"
            cy="48"
            r="4"
            fill="var(--theme-highlight, #FFD700)"
            opacity="0.9"
          >
            <animate
              attributeName="opacity"
              values="0.9;1;0.9"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Floating Sparkles */}
        <g className="floating-sparkles">
          {/* Sparkle 1 */}
          <g className="sparkle">
            <path
              d="M30 40 L32 44 L36 44 L33 47 L34 51 L30 49 L26 51 L27 47 L24 44 L28 44 Z"
              fill="#FFD700"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -5,-10; -10,-20"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0.5;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Sparkle 2 */}
          <g className="sparkle">
            <circle
              cx="70"
              cy="45"
              r="2"
              fill="#87CEEB"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 8,-15; 15,-30"
                dur="4s"
                repeatCount="indefinite"
                begin="1s"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.4;0"
                dur="4s"
                repeatCount="indefinite"
                begin="1s"
              />
            </circle>
          </g>

          {/* Sparkle 3 */}
          <g className="sparkle">
            <path
              d="M25 30 L27 34 L31 34 L28 37 L29 41 L25 39 L21 41 L22 37 L19 34 L23 34 Z"
              fill="#DDA0DD"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -3,-12; -8,-25"
                dur="3.5s"
                repeatCount="indefinite"
                begin="2s"
              />
              <animate
                attributeName="opacity"
                values="0;1;0.6;0"
                dur="3.5s"
                repeatCount="indefinite"
                begin="2s"
              />
            </path>
          </g>

          {/* Sparkle 4 */}
          <g className="sparkle">
            <circle
              cx="75"
              cy="35"
              r="1.5"
              fill="#98FB98"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 5,-8; 12,-18"
                dur="2.8s"
                repeatCount="indefinite"
                begin="0.5s"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0.3;0"
                dur="2.8s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </circle>
          </g>

          {/* Sparkle 5 */}
          <g className="sparkle">
            <path
              d="M65 25 L66 28 L69 28 L67 30 L68 33 L65 32 L62 33 L63 30 L61 28 L64 28 Z"
              fill="#F0E68C"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 3,-14; 8,-28"
                dur="4.2s"
                repeatCount="indefinite"
                begin="1.8s"
              />
              <animate
                attributeName="opacity"
                values="0;1;0.4;0"
                dur="4.2s"
                repeatCount="indefinite"
                begin="1.8s"
              />
            </path>
          </g>

          {/* Sparkle 6 */}
          <g className="sparkle">
            <circle
              cx="35"
              cy="25"
              r="1"
              fill="#FFB6C1"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -8,-12; -15,-25"
                dur="3.2s"
                repeatCount="indefinite"
                begin="2.5s"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.2;0"
                dur="3.2s"
                repeatCount="indefinite"
                begin="2.5s"
              />
            </circle>
          </g>
        </g>

        {/* Magical Aura */}
        <circle
          cx="50"
          cy="65"
          r="35"
          fill="none"
          stroke="var(--theme-accent, #805ad5)"
          strokeWidth="1"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="30;40;30"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.3;0"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Magical Glow Effect */}
        <defs>
          <filter id="silhouette-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .wizard-silhouette {
          display: inline-block;
          position: relative;
        }

        .wizard-silhouette svg {
          filter: drop-shadow(0 0 8px rgba(128, 90, 213, 0.3));
        }

        .wizard-body {
          filter: url(#silhouette-glow);
        }

        .sparkle {
          transform-origin: center;
        }

        /* Hover effect */
        .wizard-silhouette:hover svg {
          filter: drop-shadow(0 0 12px rgba(128, 90, 213, 0.5));
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .wizard-silhouette:hover .floating-sparkles {
          animation: magical-surge 2s ease-in-out;
        }

        .wizard-silhouette:hover .wizard-body {
          animation: gentle-glow 1.5s ease-in-out;
        }

        @keyframes magical-surge {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes gentle-glow {
          0% {
            filter: url(#silhouette-glow) brightness(1);
          }
          50% {
            filter: url(#silhouette-glow) brightness(1.3);
          }
          100% {
            filter: url(#silhouette-glow) brightness(1);
          }
        }
      `}</style>
    </div>
  );
}

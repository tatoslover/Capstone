import React from 'react';

export default function WizardIcon({ size = 48, className = '' }) {
  return (
    <div className={`wizard-icon ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Wizard Hat */}
        <path
          d="M50 15 L25 75 L75 75 Z"
          fill="var(--theme-primary, #4a5568)"
          stroke="var(--theme-accent, #805ad5)"
          strokeWidth="2"
        />

        {/* Hat Brim */}
        <ellipse
          cx="50"
          cy="75"
          rx="27"
          ry="8"
          fill="var(--theme-primary, #4a5568)"
          stroke="var(--theme-accent, #805ad5)"
          strokeWidth="2"
        />

        {/* Hat Band */}
        <rect
          x="30"
          y="65"
          width="40"
          height="6"
          fill="var(--theme-accent, #805ad5)"
          rx="3"
        />

        {/* Twinkling Stars */}
        <g className="stars">
          {/* Star 1 */}
          <g className="star star-1">
            <path
              d="M35 35 L37 41 L43 41 L38 45 L40 51 L35 47 L30 51 L32 45 L27 41 L33 41 Z"
              fill="#ffd700"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
                begin="0s"
              />
            </path>
          </g>

          {/* Star 2 */}
          <g className="star star-2">
            <path
              d="M65 30 L67 36 L73 36 L68 40 L70 46 L65 42 L60 46 L62 40 L57 36 L63 36 Z"
              fill="#ffd700"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2.5s"
                repeatCount="indefinite"
                begin="0.8s"
              />
            </path>
          </g>

          {/* Star 3 */}
          <g className="star star-3">
            <path
              d="M45 25 L47 31 L53 31 L48 35 L50 41 L45 37 L40 41 L42 35 L37 31 L43 31 Z"
              fill="#ffd700"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
                begin="1.5s"
              />
            </path>
          </g>

          {/* Star 4 - Smaller */}
          <circle
            cx="28"
            cy="50"
            r="2"
            fill="#ffd700"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.8s"
              repeatCount="indefinite"
              begin="2.2s"
            />
          </circle>

          {/* Star 5 - Smaller */}
          <circle
            cx="72"
            cy="55"
            r="2"
            fill="#ffd700"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2.2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>

          {/* Star 6 - Tiny sparkle */}
          <circle
            cx="55"
            cy="20"
            r="1.5"
            fill="#ffffff"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="3s"
            />
          </circle>
        </g>

        {/* Magical Glow Effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .wizard-icon {
          display: inline-block;
          position: relative;
        }

        .wizard-icon svg {
          filter: drop-shadow(0 0 8px rgba(128, 90, 213, 0.3));
        }

        .star {
          transform-origin: center;
        }

        .star-1 {
          animation: twinkle-rotate 4s linear infinite;
        }

        .star-2 {
          animation: twinkle-rotate 5s linear infinite reverse;
        }

        .star-3 {
          animation: twinkle-rotate 6s linear infinite;
        }

        @keyframes twinkle-rotate {
          0% {
            transform: rotate(0deg) scale(0.8);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(0.8);
          }
        }

        /* Hover effect */
        .wizard-icon:hover svg {
          filter: drop-shadow(0 0 12px rgba(128, 90, 213, 0.5));
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .wizard-icon:hover .stars {
          animation: float 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
}

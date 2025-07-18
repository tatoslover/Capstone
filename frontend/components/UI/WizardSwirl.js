import React from 'react';

export default function WizardSwirl({ size = 48, className = '' }) {
  return (
    <div className={`wizard-swirl ${className}`} style={{ width: size, height: size }}>
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

        {/* Swirling Magic Energy */}
        <g className="swirling-magic">
          {/* Energy Stream 1 */}
          <path
            d="M50 45 Q35 35 25 45 Q15 55 25 65 Q35 75 50 65"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            opacity="0.8"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values="M50 45 Q35 35 25 45 Q15 55 25 65 Q35 75 50 65;
                      M50 45 Q40 30 30 40 Q20 50 30 60 Q40 70 50 60;
                      M50 45 Q35 35 25 45 Q15 55 25 65 Q35 75 50 65"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Energy Stream 2 */}
          <path
            d="M50 50 Q65 40 75 50 Q85 60 75 70 Q65 80 50 70"
            fill="none"
            stroke="#9370DB"
            strokeWidth="2"
            opacity="0.8"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values="M50 50 Q65 40 75 50 Q85 60 75 70 Q65 80 50 70;
                      M50 50 Q60 35 70 45 Q80 55 70 65 Q60 75 50 65;
                      M50 50 Q65 40 75 50 Q85 60 75 70 Q65 80 50 70"
              dur="4s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </path>

          {/* Energy Stream 3 */}
          <path
            d="M50 55 Q40 45 30 55 Q20 65 30 75 Q40 85 50 75"
            fill="none"
            stroke="#00BFFF"
            strokeWidth="1.5"
            opacity="0.7"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values="M50 55 Q40 45 30 55 Q20 65 30 75 Q40 85 50 75;
                      M50 55 Q45 40 35 50 Q25 60 35 70 Q45 80 50 70;
                      M50 55 Q40 45 30 55 Q20 65 30 75 Q40 85 50 75"
              dur="5s"
              repeatCount="indefinite"
              begin="2s"
            />
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </path>

          {/* Energy Stream 4 */}
          <path
            d="M50 40 Q60 30 70 40 Q80 50 70 60 Q60 70 50 60"
            fill="none"
            stroke="#FF69B4"
            strokeWidth="1.5"
            opacity="0.7"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values="M50 40 Q60 30 70 40 Q80 50 70 60 Q60 70 50 60;
                      M50 40 Q55 25 65 35 Q75 45 65 55 Q55 65 50 55;
                      M50 40 Q60 30 70 40 Q80 50 70 60 Q60 70 50 60"
              dur="5s"
              repeatCount="indefinite"
              begin="3s"
            />
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="3s"
              repeatCount="indefinite"
              begin="1.5s"
            />
          </path>
        </g>

        {/* Orbital Energy Particles */}
        <g className="orbital-particles">
          {/* Particle 1 */}
          <circle
            cx="50"
            cy="50"
            r="2"
            fill="#FFD700"
            opacity="0.9"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 50 50; 360 50 50"
              dur="6s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -20; 0 -20"
              additive="sum"
            />
          </circle>

          {/* Particle 2 */}
          <circle
            cx="50"
            cy="50"
            r="1.5"
            fill="#9370DB"
            opacity="0.8"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="120 50 50; 480 50 50"
              dur="6s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -25; 0 -25"
              additive="sum"
            />
          </circle>

          {/* Particle 3 */}
          <circle
            cx="50"
            cy="50"
            r="1"
            fill="#00BFFF"
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="240 50 50; 600 50 50"
              dur="6s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -30; 0 -30"
              additive="sum"
            />
          </circle>

          {/* Particle 4 */}
          <circle
            cx="50"
            cy="50"
            r="1.5"
            fill="#FF69B4"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="60 50 50; -300 50 50"
              dur="8s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -15; 0 -15"
              additive="sum"
            />
          </circle>
        </g>

        {/* Central Energy Core */}
        <circle
          cx="50"
          cy="55"
          r="3"
          fill="#FFFFFF"
          opacity="0.8"
        >
          <animate
            attributeName="r"
            values="3;5;3"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Magical Glow Effect */}
        <defs>
          <filter id="swirl-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .wizard-swirl {
          display: inline-block;
          position: relative;
        }

        .wizard-swirl svg {
          filter: drop-shadow(0 0 8px rgba(128, 90, 213, 0.3));
        }

        .swirling-magic {
          filter: url(#swirl-glow);
        }

        .orbital-particles {
          filter: url(#swirl-glow);
        }

        /* Hover effect */
        .wizard-swirl:hover svg {
          filter: drop-shadow(0 0 15px rgba(128, 90, 213, 0.6));
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .wizard-swirl:hover .swirling-magic {
          animation: energy-boost 1s ease-in-out;
        }

        .wizard-swirl:hover .orbital-particles {
          animation: orbital-boost 2s ease-in-out;
        }

        @keyframes energy-boost {
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

        @keyframes orbital-boost {
          0% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

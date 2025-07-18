import { useState, useEffect } from "react";
import {
  addConnectionListener,
  removeConnectionListener,
} from "../services/apiService";

const ConnectionStatus = ({ className = "", showDetails = false }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const handleConnectionChange = (online) => {
      setIsOnline(online);
      setLastChecked(new Date());
    };

    // Add listener
    addConnectionListener(handleConnectionChange);

    // Cleanup
    return () => {
      removeConnectionListener(handleConnectionChange);
    };
  }, []);

  const statusIcon = isOnline ? "🟢" : "🔴";
  const statusText = isOnline ? "Online" : "Offline";
  const statusMode = isOnline ? "Backend Connected" : "Mock Data Mode";

  return (
    <div
      className={`connection-status ${className} ${isOnline ? "online" : "offline"}`}
    >
      <div className="status-indicator">
        <span className="status-icon" role="img" aria-label={statusText}>
          {statusIcon}
        </span>
        <span className="status-text">{statusText}</span>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="status-mode">{statusMode}</div>
          {lastChecked && (
            <div className="last-checked">
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .connection-status {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 0.875rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--theme-border);
          background: rgba(26, 26, 26, 0.95);
          backdrop-filter: blur(2px);
          transition: all 0.3s ease;
        }

        .connection-status.online {
          border-color: var(--theme-success);
          background: rgba(40, 167, 69, 0.1);
          color: var(--theme-success);
        }

        .connection-status.offline {
          border-color: var(--theme-warning);
          background: rgba(255, 193, 7, 0.1);
          color: var(--theme-warning);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .status-icon {
          font-size: 0.75rem;
          animation: pulse 2s infinite;
        }

        .status-details {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .status-mode {
          font-weight: 500;
        }

        .last-checked {
          margin-top: 0.25rem;
          font-style: italic;
          opacity: 0.8;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .connection-status {
            font-size: 0.75rem;
            padding: 0.5rem;
          }

          .status-details {
            font-size: 0.6875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ConnectionStatus;

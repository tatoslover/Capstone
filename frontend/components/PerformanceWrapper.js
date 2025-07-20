import React, { useEffect, useState } from 'react';
import { initPerformanceMonitoring } from '../utils/performance';
import PerformanceDashboard from './PerformanceDashboard';

const PerformanceWrapper = ({ children }) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if we're in production
    const prod = process.env.NODE_ENV === 'production';
    setIsProduction(prod);

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Only show dashboard toggle in development or if explicitly enabled
    if (!prod || localStorage.getItem('enablePerformanceDashboard') === 'true') {
      // Add keyboard shortcut to toggle dashboard (Ctrl+Shift+P)
      const handleKeyDown = (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
          event.preventDefault();
          setShowDashboard(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Add performance monitoring toggle button in development
      if (!prod) {
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '📊';
        toggleButton.title = 'Toggle Performance Dashboard (Ctrl+Shift+P)';
        toggleButton.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 10000;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        `;

        toggleButton.addEventListener('mouseenter', () => {
          toggleButton.style.transform = 'scale(1.1)';
          toggleButton.style.background = '#2563eb';
        });

        toggleButton.addEventListener('mouseleave', () => {
          toggleButton.style.transform = 'scale(1)';
          toggleButton.style.background = '#3b82f6';
        });

        toggleButton.addEventListener('click', () => {
          setShowDashboard(prev => !prev);
        });

        document.body.appendChild(toggleButton);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          if (document.body.contains(toggleButton)) {
            document.body.removeChild(toggleButton);
          }
        };
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  // Performance optimization: Add resource hints
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Preconnect to backend API
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    document.head.appendChild(preconnectLink);

    // Preconnect to Scryfall API
    const scryfallPreconnect = document.createElement('link');
    scryfallPreconnect.rel = 'preconnect';
    scryfallPreconnect.href = 'https://api.scryfall.com';
    document.head.appendChild(scryfallPreconnect);

    // Add performance meta tags
    const performanceMeta = document.createElement('meta');
    performanceMeta.name = 'performance-monitoring';
    performanceMeta.content = 'enabled';
    document.head.appendChild(performanceMeta);

    return () => {
      if (document.head.contains(preconnectLink)) {
        document.head.removeChild(preconnectLink);
      }
      if (document.head.contains(scryfallPreconnect)) {
        document.head.removeChild(scryfallPreconnect);
      }
      if (document.head.contains(performanceMeta)) {
        document.head.removeChild(performanceMeta);
      }
    };
  }, []);

  // Log performance warnings in development
  useEffect(() => {
    // Only run on client side and in development
    if (typeof window === 'undefined' || isProduction) return;

    // Monitor for slow page loads
    const checkPageLoad = () => {
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        if (loadTime > 3000) {
          console.warn(`🐌 Page load took ${loadTime}ms (threshold: 3000ms)`);
        }
      }
    };

    window.addEventListener('load', checkPageLoad);

    // Monitor for memory leaks
    const memoryCheck = setInterval(() => {
      if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usedPercent > 80) {
          console.warn(`🧠 High memory usage: ${usedPercent.toFixed(1)}%`);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('load', checkPageLoad);
      clearInterval(memoryCheck);
    };
  }, [isProduction]);

  return (
    <>
      {children}
      {showDashboard && (
        <PerformanceDashboard
          isVisible={showDashboard}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {/* Performance-related styles */}
      <style jsx>{`
        /* Optimise font loading */
        @font-face {
          font-family: 'system';
          font-style: normal;
          font-weight: 300;
          src: local('.SFNSText-Light'), local('.HelveticaNeueDeskInterface-Light'),
               local('.LucidaGrandeUI'), local('Ubuntu Light'), local('Segoe UI Light'),
               local('Roboto-Light'), local('DroidSans'), local('Tahoma');
        }

        /* Smooth scrolling performance */
        * {
          scroll-behavior: smooth;
        }

        /* GPU acceleration for animations */
        .performance-optimised {
          will-change: transform;
          transform: translateZ(0);
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Dark mode performance optimisation */
        @media (prefers-color-scheme: dark) {
          * {
            color-scheme: dark;
          }
        }

        /* Print optimisations */
        @media print {
          .performance-dashboard,
          .performance-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default PerformanceWrapper;

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Documentation from '../pages/documentation';
import { ThemeProvider } from '../contexts/ThemeContext';
import * as performanceUtils from '../utils/performance';
import * as apiService from '../services/apiService';

// Mock the performance utils
jest.mock('../utils/performance', () => ({
  getPerformanceMetrics: jest.fn(),
  logPerformanceSummary: jest.fn(),
  exportPerformanceData: jest.fn(),
  initPerformanceMonitoring: jest.fn(),
}));

// Mock the API service
jest.mock('../services/apiService', () => ({
  apiService: {
    health: jest.fn(),
  },
  addConnectionListener: jest.fn(),
  removeConnectionListener: jest.fn(),
}));

// Mock the performance components
jest.mock('../components/PerformanceDashboard', () => {
  return function MockPerformanceDashboard({ isVisible, embedded }) {
    return (
      <div data-testid="performance-dashboard">
        Performance Dashboard Mock
        <span data-testid="dashboard-visible">{isVisible ? 'visible' : 'hidden'}</span>
        <span data-testid="dashboard-embedded">{embedded ? 'embedded' : 'floating'}</span>
      </div>
    );
  };
});

jest.mock('../components/PerformanceOverview', () => {
  return function MockPerformanceOverview({ metrics }) {
    return (
      <div data-testid="performance-overview">
        Performance Overview Mock
        <span data-testid="metrics-loaded">{metrics ? 'loaded' : 'loading'}</span>
      </div>
    );
  };
});

jest.mock('../components/PerformanceHealthIndicator', () => {
  return function MockPerformanceHealthIndicator({ metrics, backendStatus }) {
    return (
      <div data-testid="performance-health">
        Performance Health Mock
        <span data-testid="health-status">{backendStatus}</span>
      </div>
    );
  };
});

// Mock fetch for backend metrics
global.fetch = jest.fn();

const mockPerformanceMetrics = {
  session: {
    duration: 45000,
    start: Date.now() - 45000,
  },
  apiCalls: {
    total: 5,
    successful: 4,
    failed: 1,
    averageResponseTime: 350,
    slowCalls: [],
  },
  userInteractions: {
    total: 12,
    averageResponseTime: 50,
    slowInteractions: [],
  },
  errors: {
    total: 0,
    recent: [],
  },
  memory: {
    usedJSHeapSize: 25000000,
    totalJSHeapSize: 50000000,
    jsHeapSizeLimit: 100000000,
    usedPercentage: 50,
  },
  webVitals: {
    lcp: {
      value: 2000,
      rating: 'good',
    },
    fid: {
      value: 80,
      rating: 'good',
    },
    cls: {
      value: 0.05,
      rating: 'good',
    },
  },
  connection: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
  },
};

const mockBackendMetrics = {
  status: 'optimal',
  uptime: '2h 15m',
  averageResponseTime: 120,
  errorRate: 0.5,
};

const renderDocumentationWithTheme = () => {
  return render(
    <ThemeProvider>
      <Documentation />
    </ThemeProvider>
  );
};

describe('Performance Dashboard Integration in Documentation', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock returns
    performanceUtils.getPerformanceMetrics.mockReturnValue(mockPerformanceMetrics);
    apiService.apiService.health.mockResolvedValue({ status: 'OK' });

    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/monitoring/performance')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBackendMetrics),
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    // Mock URL and DOM APIs
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock document.createElement for export functionality
    const mockElement = {
      href: '',
      download: '',
      click: jest.fn(),
    };
    document.createElement = jest.fn(() => mockElement);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders performance section button in documentation', () => {
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });

    expect(performanceButton).toBeInTheDocument();
  });

  test('shows performance content when section is selected', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });

    await user.click(performanceButton);

    expect(screen.getByText(/Real-time Performance Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitor application performance/i)).toBeInTheDocument();
  });

  test('renders performance overview component when section is active', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });

    await user.click(performanceButton);

    expect(screen.getByTestId('performance-overview')).toBeInTheDocument();
  });

  test('renders performance health indicator when section is active', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });

    await user.click(performanceButton);

    expect(screen.getByTestId('performance-health')).toBeInTheDocument();
  });

  test('toggles detailed dashboard visibility', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    // Open performance section
    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    // Initially dashboard should not be visible
    expect(screen.queryByTestId('performance-dashboard')).not.toBeInTheDocument();

    // Click show detailed dashboard
    const showDashboardButton = screen.getByRole('button', {
      name: /Show Detailed Dashboard/i,
    });
    await user.click(showDashboardButton);

    // Dashboard should now be visible and embedded
    expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-visible')).toHaveTextContent('visible');
    expect(screen.getByTestId('dashboard-embedded')).toHaveTextContent('embedded');

    // Click hide dashboard
    const hideDashboardButton = screen.getByRole('button', {
      name: /Hide Detailed Dashboard/i,
    });
    await user.click(hideDashboardButton);

    // Dashboard should be hidden again
    expect(screen.queryByTestId('performance-dashboard')).not.toBeInTheDocument();
  });

  test('refresh metrics button calls performance utilities', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    // Open performance section
    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    // Wait for initial load
    await waitFor(() => {
      expect(performanceUtils.getPerformanceMetrics).toHaveBeenCalled();
    });

    // Click refresh metrics
    const refreshButton = screen.getByRole('button', {
      name: /Refresh Metrics/i,
    });

    await user.click(refreshButton);

    // Should call performance utilities again
    expect(performanceUtils.getPerformanceMetrics).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/monitoring/performance');
  });

  test('export report button creates downloadable file', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    // Open performance section
    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    // Click export report
    const exportButton = screen.getByRole('button', {
      name: /Export Report/i,
    });

    await user.click(exportButton);

    // Should create blob and trigger download
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  test('log to console button calls performance summary', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    // Open performance section
    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    // Click log to console
    const logButton = screen.getByRole('button', {
      name: /Log to Console/i,
    });

    await user.click(logButton);

    expect(performanceUtils.logPerformanceSummary).toHaveBeenCalled();
  });

  test('fetches backend metrics when performance section is opened', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });

    await user.click(performanceButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/monitoring/performance');
    });
  });

  test('handles backend metrics fetch error gracefully', async () => {
    const user = userEvent.setup();

    // Mock fetch to reject
    global.fetch.mockRejectedValue(new Error('Network error'));

    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });

    await user.click(performanceButton);

    // Should not crash and should still render components
    expect(screen.getByTestId('performance-overview')).toBeInTheDocument();
    expect(screen.getByTestId('performance-health')).toBeInTheDocument();
  });

  test('auto-refreshes metrics when detailed dashboard is visible', async () => {
    const user = userEvent.setup();

    // Mock timers
    jest.useFakeTimers();

    renderDocumentationWithTheme();

    // Open performance section
    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    // Show detailed dashboard to trigger auto-refresh
    const showDashboardButton = screen.getByRole('button', {
      name: /Show Detailed Dashboard/i,
    });
    await user.click(showDashboardButton);

    // Fast-forward time to trigger refresh
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(performanceUtils.getPerformanceMetrics).toHaveBeenCalledTimes(3); // Initial + manual + auto-refresh
    });

    jest.useRealTimers();
  });

  test('stops auto-refresh when detailed dashboard is hidden', async () => {
    const user = userEvent.setup();

    jest.useFakeTimers();

    renderDocumentationWithTheme();

    // Open performance section and show dashboard
    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    const showDashboardButton = screen.getByRole('button', {
      name: /Show Detailed Dashboard/i,
    });
    await user.click(showDashboardButton);

    // Hide dashboard
    const hideDashboardButton = screen.getByRole('button', {
      name: /Hide Detailed Dashboard/i,
    });
    await user.click(hideDashboardButton);

    // Fast-forward time - should not trigger additional refreshes
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Should not have additional calls beyond initial setup
    expect(performanceUtils.getPerformanceMetrics).toHaveBeenCalledTimes(2); // Initial + manual only

    jest.useRealTimers();
  });

  test('renders performance features documentation', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    expect(screen.getByText(/Web Vitals Monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/API Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory Monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/Error Tracking/i)).toBeInTheDocument();
  });

  test('renders developer tools documentation', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    expect(screen.getByText(/Ctrl\+Shift\+P/i)).toBeInTheDocument();
    expect(screen.getByText(/window\.performanceUtils/i)).toBeInTheDocument();
  });

  test('renders performance optimisation tips', async () => {
    const user = userEvent.setup();
    renderDocumentationWithTheme();

    const performanceButton = screen.getByRole('button', {
      name: /🚀 Performance Monitoring/i,
    });
    await user.click(performanceButton);

    expect(screen.getByText(/Performance Optimisation Tips/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitor memory usage regularly/i)).toBeInTheDocument();
    expect(screen.getByText(/Keep API response times under 500ms/i)).toBeInTheDocument();
  });
});

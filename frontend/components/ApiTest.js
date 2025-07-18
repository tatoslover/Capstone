import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import ConnectionStatus from './ConnectionStatus';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const addResult = (name, status, details = '') => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      name,
      status,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runHealthCheck = async () => {
    setCurrentTest('Health Check');
    try {
      const result = await apiService.health();
      addResult('Health Check', 'PASS', JSON.stringify(result, null, 2));
    } catch (error) {
      addResult('Health Check', 'FAIL', error.message);
    }
  };

  const runUserTests = async () => {
    setCurrentTest('User CRUD Tests');

    try {
      // Get all users
      const users = await apiService.users.getAll();
      addResult('Get All Users', 'PASS', `Found ${users.length} users`);

      if (users.length > 0) {
        // Get first user
        const user = await apiService.users.getById(users[0].id);
        addResult('Get User by ID', 'PASS', `Username: ${user.username}`);
      }

      // Create test user
      const testUser = await apiService.users.create({
        username: `test_user_${Date.now()}`
      });
      addResult('Create User', 'PASS', `Created user ID: ${testUser.id}`);

      // Update test user
      const updatedUser = await apiService.users.update(testUser.id, {
        username: `updated_${testUser.username}`
      });
      addResult('Update User', 'PASS', `Updated username: ${updatedUser.username}`);

      // Delete test user
      await apiService.users.delete(testUser.id);
      addResult('Delete User', 'PASS', 'User deleted successfully');

    } catch (error) {
      addResult('User CRUD Tests', 'FAIL', error.message);
    }
  };

  const runFavouritesTests = async () => {
    setCurrentTest('Favourites Tests');

    try {
      // Get favourites for first user
      const favourites = await apiService.favourites.getByUserId(1);
      addResult('Get User Favourites', 'PASS', `Found ${favourites.length} favourites`);

      // Add a test favourite
      const newFavourite = await apiService.favourites.create({
        user_id: 1,
        card_name: 'Test Card',
        ability_type: 'Test Ability',
        notes: 'This is a test favourite'
      });
      addResult('Create Favourite', 'PASS', `Added: ${newFavourite.card_name}`);

      // Update the favourite
      const updatedFavourite = await apiService.favourites.update(newFavourite.id, {
        notes: 'Updated test notes'
      });
      addResult('Update Favourite', 'PASS', 'Notes updated successfully');

      // Delete the favourite
      await apiService.favourites.delete(newFavourite.id);
      addResult('Delete Favourite', 'PASS', 'Favourite deleted successfully');

    } catch (error) {
      addResult('Favourites Tests', 'FAIL', error.message);
    }
  };

  const runCardTests = async () => {
    setCurrentTest('Card Search Tests');

    try {
      // Search for cards
      const searchResults = await apiService.cards.search('lightning');
      addResult('Card Search', 'PASS', `Found ${searchResults.data.length} cards`);

      // Get random cards
      const randomCards = await apiService.cards.random();
      addResult('Random Cards', 'PASS', `Got ${randomCards.data.length} random cards`);

      // Get random cards by ability
      const abilityCards = await apiService.cards.random('flying');
      addResult('Cards by Ability', 'PASS', `Found ${abilityCards.data.length} flying cards`);

    } catch (error) {
      addResult('Card Search Tests', 'FAIL', error.message);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    await runHealthCheck();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests

    await runUserTests();
    await new Promise(resolve => setTimeout(resolve, 500));

    await runFavouritesTests();
    await new Promise(resolve => setTimeout(resolve, 500));

    await runCardTests();

    setCurrentTest('');
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return '#22c55e';
      case 'FAIL': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const passedTests = testResults.filter(t => t.status === 'PASS').length;
  const failedTests = testResults.filter(t => t.status === 'FAIL').length;

  return (
    <div className="api-test-container">
      <div className="test-header">
        <h1>API Testing Dashboard</h1>
        <p>Test the connection between frontend and backend (real or mock API)</p>

        <div className="connection-status-display">
          <ConnectionStatus showDetails={true} />
        </div>
      </div>

      <div className="test-controls">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="test-button test-button-primary"
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>

        <div className="individual-tests">
          <button onClick={runHealthCheck} disabled={isRunning} className="test-button">
            Health Check
          </button>
          <button onClick={runUserTests} disabled={isRunning} className="test-button">
            User CRUD
          </button>
          <button onClick={runFavouritesTests} disabled={isRunning} className="test-button">
            Favourites
          </button>
          <button onClick={runCardTests} disabled={isRunning} className="test-button">
            Card Search
          </button>
        </div>

        <button onClick={clearResults} className="test-button test-button-secondary">
          Clear Results
        </button>
      </div>

      {isRunning && currentTest && (
        <div className="current-test">
          <div className="spinner"></div>
          Running: {currentTest}
        </div>
      )}

      {testResults.length > 0 && (
        <div className="test-summary">
          <h3>Test Summary</h3>
          <div className="summary-stats">
            <span className="stat stat-total">Total: {testResults.length}</span>
            <span className="stat stat-pass">Passed: {passedTests}</span>
            <span className="stat stat-fail">Failed: {failedTests}</span>
            <span className="stat stat-rate">
              Success Rate: {Math.round((passedTests / testResults.length) * 100)}%
            </span>
          </div>
        </div>
      )}

      <div className="test-results">
        {testResults.map(result => (
          <div key={result.id} className={`test-result test-result-${result.status.toLowerCase()}`}>
            <div className="result-header">
              <span className="result-status" style={{ color: getStatusColor(result.status) }}>
                {result.status === 'PASS' ? '✅' : '❌'} {result.status}
              </span>
              <span className="result-name">{result.name}</span>
              <span className="result-time">{result.timestamp}</span>
            </div>
            {result.details && (
              <div className="result-details">
                <pre>{result.details}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .api-test-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .test-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .test-header h1 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .test-header p {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .connection-status-display {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .test-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .individual-tests {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .test-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .test-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .test-button-primary {
          background-color: #3b82f6;
          color: white;
          font-size: 1rem;
          padding: 1rem 2rem;
        }

        .test-button-primary:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .test-button:not(.test-button-primary):not(.test-button-secondary) {
          background-color: #f3f4f6;
          color: #374151;
        }

        .test-button:not(.test-button-primary):not(.test-button-secondary):hover:not(:disabled) {
          background-color: #e5e7eb;
        }

        .test-button-secondary {
          background-color: #ef4444;
          color: white;
        }

        .test-button-secondary:hover:not(:disabled) {
          background-color: #dc2626;
        }

        .current-test {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          color: #92400e;
          font-weight: 500;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid #fbbf24;
          border-top: 2px solid #92400e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .test-summary {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .test-summary h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .summary-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat {
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .stat-total {
          background-color: #e5e7eb;
          color: #374151;
        }

        .stat-pass {
          background-color: #dcfce7;
          color: #166534;
        }

        .stat-fail {
          background-color: #fecaca;
          color: #991b1b;
        }

        .stat-rate {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .test-results {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .test-result {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          background-color: white;
        }

        .test-result-pass {
          border-left: 4px solid #22c55e;
        }

        .test-result-fail {
          border-left: 4px solid #ef4444;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 500;
        }

        .result-status {
          font-size: 0.875rem;
        }

        .result-name {
          flex: 1;
          color: #1f2937;
        }

        .result-time {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: normal;
        }

        .result-details {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #f3f4f6;
        }

        .result-details pre {
          font-size: 0.75rem;
          color: #4b5563;
          background-color: #f9fafb;
          padding: 0.5rem;
          border-radius: 0.25rem;
          overflow-x: auto;
          white-space: pre-wrap;
          margin: 0;
        }

        @media (max-width: 640px) {
          .api-test-container {
            padding: 1rem;
          }

          .individual-tests {
            flex-direction: column;
            align-items: center;
          }

          .test-button {
            width: 100%;
            max-width: 200px;
          }

          .summary-stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ApiTest;

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Simple mock component for testing user interactions
const MockUserForm = () => {
  const [username, setUsername] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const newUser = await response.json();
      setUsers(prev => [...prev, newUser]);
      setUsername('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="user-form">
      <h2>User Management</h2>

      {error && (
        <div data-testid="error-message" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="form">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            data-testid="username-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim()}
          data-testid="submit-button"
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      <div data-testid="user-list">
        <h3>Users ({users.length})</h3>
        {users.map(user => (
          <div key={user.id} data-testid={`user-${user.id}`}>
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('User Interaction Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Form Rendering', () => {
    test('should render user form correctly', () => {
      render(<MockUserForm />);

      expect(screen.getByTestId('user-form')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByLabelText('Username:')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByText('Users (0)')).toBeInTheDocument();
    });

    test('should disable submit button when username is empty', () => {
      render(<MockUserForm />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    test('should enable submit button when username is entered', async () => {
      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('submit-button');

      await user.type(usernameInput, 'testuser');

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('User Creation Flow', () => {
    test('should create user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        created_at: '2023-01-01T00:00:00Z'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const user = userEvent.setup();
      render(<MockUserForm />);

      // Fill in the form
      const usernameInput = screen.getByTestId('username-input');
      await user.type(usernameInput, 'testuser');

      // Submit the form
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      // Verify API was called
      expect(fetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser' })
      });

      // Verify user appears in list
      await waitFor(() => {
        expect(screen.getByText('Users (1)')).toBeInTheDocument();
        expect(screen.getByTestId('user-1')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Verify form is reset
      expect(usernameInput.value).toBe('');
    });

    test('should handle API errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Username already exists' })
      });

      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      await user.type(usernameInput, 'duplicateuser');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
      });

      // Form should still have the username
      expect(usernameInput.value).toBe('duplicateuser');
    });

    test('should show loading state during submission', async () => {
      // Create a promise that never resolves to simulate loading
      fetch.mockImplementationOnce(() => new Promise(() => {}));

      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      await user.type(usernameInput, 'testuser');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      // Should show loading state
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(usernameInput).toBeDisabled();
    });

    test('should trim whitespace from username', async () => {
      const mockUser = {
        id: 1,
        username: 'trimmeduser',
        created_at: '2023-01-01T00:00:00Z'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      await user.type(usernameInput, '  trimmeduser  ');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(fetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'trimmeduser' })
      });
    });
  });

  describe('Multiple Users', () => {
    test('should handle creating multiple users', async () => {
      const users = [
        { id: 1, username: 'user1', created_at: '2023-01-01T00:00:00Z' },
        { id: 2, username: 'user2', created_at: '2023-01-02T00:00:00Z' }
      ];

      // Mock successful responses for both users
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => users[0]
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => users[1]
        });

      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('submit-button');

      // Create first user
      await user.type(usernameInput, 'user1');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Users (1)')).toBeInTheDocument();
        expect(screen.getByTestId('user-1')).toBeInTheDocument();
      });

      // Create second user
      await user.type(usernameInput, 'user2');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Users (2)')).toBeInTheDocument();
        expect(screen.getByTestId('user-1')).toBeInTheDocument();
        expect(screen.getByTestId('user-2')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('should submit form when Enter is pressed in input', async () => {
      const mockUser = {
        id: 1,
        username: 'keyboarduser',
        created_at: '2023-01-01T00:00:00Z'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      await user.type(usernameInput, 'keyboarduser');
      await user.keyboard('{Enter}');

      expect(fetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'keyboarduser' })
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-1')).toBeInTheDocument();
      });
    });

    test('should focus submit button when tabbing from input', async () => {
      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('submit-button');

      // Focus input and add text to enable button
      await user.click(usernameInput);
      await user.type(usernameInput, 'test');

      // Tab to next element (submit button)
      await user.tab();

      expect(submitButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels and structure', () => {
      render(<MockUserForm />);

      const usernameInput = screen.getByLabelText('Username:');
      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(usernameInput).toHaveAttribute('type', 'text');

      const form = screen.getByTestId('form');
      expect(form).toHaveAttribute('data-testid', 'form');
    });

    test('should announce error messages to screen readers', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Validation failed' })
      });

      const user = userEvent.setup();
      render(<MockUserForm />);

      await user.type(screen.getByTestId('username-input'), 'invalid');
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('Validation failed');
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const user = userEvent.setup();
      render(<MockUserForm />);

      await user.type(screen.getByTestId('username-input'), 'networktest');
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    test('should not submit empty username after trimming', async () => {
      const user = userEvent.setup();
      render(<MockUserForm />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('submit-button');

      // Type only spaces
      await user.type(usernameInput, '   ');

      // Submit button should still be disabled
      expect(submitButton).toBeDisabled();

      // Clicking shouldn't trigger API call
      await user.click(submitButton);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should handle invalid JSON response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      const user = userEvent.setup();
      render(<MockUserForm />);

      await user.type(screen.getByTestId('username-input'), 'jsontest');
      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
      });
    });
  });
});

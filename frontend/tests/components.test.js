import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserSelector from '../components/User/UserSelector';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

describe('UserSelector Component', () => {
  let mockOnUserSelect;

  beforeEach(() => {
    mockOnUserSelect = jest.fn();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUsers = [
    {
      id: 1,
      username: 'testuser1',
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      username: 'testuser2',
      created_at: '2023-01-02T00:00:00Z'
    }
  ];

  describe('Loading State', () => {
    test('should show loading spinner whilst fetching users', () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      expect(screen.getByText('Loading users...')).toBeInTheDocument();
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  describe('User List Display', () => {
    test('should render list of existing users', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('testuser1')).toBeInTheDocument();
        expect(screen.getByText('testuser2')).toBeInTheDocument();
      });

      expect(screen.getByText('Existing Profiles')).toBeInTheDocument();
    });

    test('should show creation date for each user', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Created 1/1/2023')).toBeInTheDocument();
        expect(screen.getByText('Created 1/2/2023')).toBeInTheDocument();
      });
    });

    test('should call onUserSelect when user is clicked', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('testuser1')).toBeInTheDocument();
      });

      await user.click(screen.getByText('testuser1'));

      expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('Current User Display', () => {
    test.skip('should show current user information when provided', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const currentUser = { id: 1, username: 'currentuser' };
      render(
        <UserSelector
          onUserSelect={mockOnUserSelect}
          currentUser={currentUser}
        />
      );

      expect(screen.getByText('Currently logged in as:')).toBeInTheDocument();
      expect(screen.getByText('currentuser')).toBeInTheDocument();
      expect(screen.getByText('Switch User')).toBeInTheDocument();
    });

    test('should hide user selection when current user is set', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const currentUser = { id: 1, username: 'currentuser' };
      render(
        <UserSelector
          onUserSelect={mockOnUserSelect}
          currentUser={currentUser}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Existing Profiles')).not.toBeInTheDocument();
        expect(screen.queryByText('Create New Profile')).not.toBeInTheDocument();
      });
    });

    test.skip('should call onUserSelect with null when switch user is clicked', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const currentUser = { id: 1, username: 'currentuser' };
      const user = userEvent.setup();

      render(
        <UserSelector
          onUserSelect={mockOnUserSelect}
          currentUser={currentUser}
        />
      );

      await user.click(screen.getByText('Switch User'));

      expect(mockOnUserSelect).toHaveBeenCalledWith(null);
    });
  });

  describe('User Creation', () => {
    test('should show create new profile button initially', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });
    });

    test('should show form when create new profile is clicked', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByText('Create Profile')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('should create new user when form is submitted', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsers
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 3, username: 'newuser', created_at: '2023-01-03T00:00:00Z' })
        });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      // Wait for initial load and click create button
      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      // Fill in the form
      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'newuser');

      // Submit the form
      await user.click(screen.getByText('Create Profile'));

      // Check that the API was called correctly
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'newuser' })
        }
      );

      // Check that onUserSelect was called with the new user
      await waitFor(() => {
        expect(mockOnUserSelect).toHaveBeenCalledWith({
          id: 3,
          username: 'newuser',
          created_at: '2023-01-03T00:00:00Z'
        });
      });
    });

    test('should disable create button when username is empty', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      const createButton = screen.getByText('Create Profile');
      expect(createButton).toBeDisabled();
    });

    test('should show error when user creation fails', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsers
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Username already exists' })
        });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'duplicateuser');

      await user.click(screen.getByText('Create Profile'));

      await waitFor(() => {
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
      });
    });

    test('should cancel form when cancel button is clicked', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'testinput');

      await user.click(screen.getByText('Cancel'));

      // Form should be hidden
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
      expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should show error when failing to fetch users', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load users')).toBeInTheDocument();
      });
    });

    test('should show error when API returns error status', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load users')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      const user = userEvent.setup();
      await user.click(screen.getByText('+ Create New Profile'));

      const usernameInput = screen.getByLabelText('Username');
      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(usernameInput).toHaveAttribute('type', 'text');
    });

    test('should be keyboard navigable', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('testuser1')).toBeInTheDocument();
      });

      // Tab to first user button
      await user.tab();
      const firstUserButton = screen.getByText('testuser1').closest('button');
      expect(firstUserButton).toHaveFocus();

      // Press Enter to select user
      await user.keyboard('{Enter}');
      expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('Responsive Behaviour', () => {
    test('should handle empty users list gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      // Should not show "Existing Profiles" section
      expect(screen.queryByText('Existing Profiles')).not.toBeInTheDocument();

      // Should still show create new profile option
      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    test('should handle username with special characters', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => []
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            username: 'user-with_special.chars',
            created_at: '2023-01-01T00:00:00Z'
          })
        });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'user-with_special.chars');

      await user.click(screen.getByText('Create Profile'));

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/users',
        expect.objectContaining({
          body: JSON.stringify({ username: 'user-with_special.chars' })
        })
      );
    });

    test('should trim whitespace from username input', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => []
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            username: 'trimmeduser',
            created_at: '2023-01-01T00:00:00Z'
          })
        });

      const user = userEvent.setup();
      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(screen.getByText('+ Create New Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Create New Profile'));

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, '  trimmeduser  ');

      await user.click(screen.getByText('Create Profile'));

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/users',
        expect.objectContaining({
          body: JSON.stringify({ username: 'trimmeduser' })
        })
      );
    });
  });

  describe('Environment Configuration', () => {
    test('should use custom API URL from environment', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = 'https://custom-api.example.com';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('https://custom-api.example.com/api/users');
      });

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    test('should fall back to localhost when no environment URL is set', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      render(<UserSelector onUserSelect={mockOnUserSelect} />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/users');
      });

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });
});

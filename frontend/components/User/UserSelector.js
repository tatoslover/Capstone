import { useState, useEffect } from 'react';

export default function UserSelector({ onUserSelect, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [creating, setCreating] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    try {
      setCreating(true);
      setError('');

      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const newUser = await response.json();
      setUsers([newUser, ...users]);
      setNewUsername('');
      setShowCreateForm(false);
      onUserSelect(newUser);
    } catch (err) {
      setError(err.message);
      console.error('Error creating user:', err);
    } finally {
      setCreating(false);
    }
  };

  const selectUser = (user) => {
    onUserSelect(user);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Select Your Profile</h3>
        <p className="card-subtitle">
          Choose an existing profile or create a new one to save your favorite cards
        </p>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Current User Display */}
      {currentUser && (
        <div style={{
          background: '#e3f2fd',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #bbdefb'
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>
            Currently logged in as: <strong>{currentUser.username}</strong>
          </p>
          <button
            onClick={() => onUserSelect(null)}
            className="btn-outline mt-1"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            Switch User
          </button>
        </div>
      )}

      {/* Show user selection only if no current user */}
      {!currentUser && (
        <>
          {/* Existing Users */}
          {users.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                Existing Profiles
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => selectUser(user)}
                    style={{
                      padding: '1rem',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.5rem',
                      background: 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '1rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#007bff';
                      e.target.style.background = '#f8f9fa';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#dee2e6';
                      e.target.style.background = 'white';
                    }}
                  >
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {user.username}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                      Created {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create New User Section */}
          <div style={{ borderTop: users.length > 0 ? '1px solid #e9ecef' : 'none', paddingTop: users.length > 0 ? '1.5rem' : '0' }}>
            {!showCreateForm ? (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  Create New Profile
                </h4>
                <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
                  Start fresh with a new profile to track your favorite cards
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-outline"
                  style={{ width: '100%' }}
                >
                  + Create New Profile
                </button>
              </div>
            ) : (
              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                  Create New Profile
                </h4>
                <form onSubmit={createUser}>
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter a username"
                      disabled={creating}
                      style={{ marginBottom: '1rem' }}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      disabled={creating || !newUsername.trim()}
                      style={{ flex: 1 }}
                    >
                      {creating ? 'Creating...' : 'Create Profile'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewUsername('');
                        setError('');
                      }}
                      className="btn-secondary"
                      disabled={creating}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

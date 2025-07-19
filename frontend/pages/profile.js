import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import Loading from "../components/UI/Loading";
import { apiService, addConnectionListener, removeConnectionListener } from "../services/apiService";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState("");
  const [isOnline, setIsOnline] = useState(true);


  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setEditingUsername(user.username);
      } catch (e) {
        localStorage.removeItem("currentUser");
      }
    }

    // Listen for connection status changes first
    const handleConnectionChange = (online) => {
      setIsOnline(online);
    };

    addConnectionListener(handleConnectionChange);

    // Get initial connection status
    setIsOnline(apiService.isOnline());

    // Check connection and fetch if online
    if (apiService.isOnline()) {
      fetchUsers();
    } else {
      setLoading(false);
    }

    return () => {
      removeConnectionListener(handleConnectionChange);
    };
  }, []);

  // Separate effect to handle connection changes
  useEffect(() => {
    if (isOnline && users.length === 0 && !loading) {
      fetchUsers();
    }
  }, [isOnline]);

  const fetchUsers = async () => {
    if (!isOnline) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiService.users.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.message === 'OFFLINE_MODE' || !isOnline) {
        setError("Currently in offline mode - demo functionality available");
      } else {
        setError("Failed to load users. Please try again.");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    if (!isOnline) {
      showNotification("Cannot create profiles while offline.", "error");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const newUser = await apiService.users.create({ username: newUsername.trim() });

      // Update local state
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setNewUsername("");
      setEditingUsername(newUser.username);
      setIsCreating(false);

      showNotification("Profile created successfully!", "success");
    } catch (err) {
      console.error("Error creating user:", err);
      if (err.message === 'OFFLINE_MODE' || !isOnline) {
        setError("Cannot create profiles in offline mode");
      } else {
        setError(err.message || "Failed to create user");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUsername.trim() || !currentUser) return;

    if (!isOnline) {
      showNotification("Cannot update profiles while offline.", "error");
      return;
    }



    try {
      setActionLoading(true);
      setError("");

      const updatedUser = await apiService.users.update(currentUser.id, { username: editingUsername.trim() });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentUser.id ? updatedUser : user,
        ),
      );
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setIsEditing(false);

      showNotification("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    if (!isOnline) {
      showNotification("Cannot delete profiles while offline.", "error");
      return;
    }



    const confirmed = window.confirm(
      `Are you sure you want to delete your profile "${currentUser.username}"? This will also remove all your saved favourites and cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await apiService.users.delete(currentUser.id);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== currentUser.id),
      );
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setIsEditing(false);
      setEditingUsername("");

      showNotification("Profile deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting user:", err);
      if (err.message === 'OFFLINE_MODE' || !isOnline) {
        setError("Cannot delete profiles in offline mode");
      } else {
        setError(err.message || "Failed to delete user");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setEditingUsername(user.username);
    setIsEditing(false);
    showNotification(`Switched to ${user.username}!`, "success");
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#28a745" : "#dc3545"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: 500;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Add CSS animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideIn 0.3s ease-out reverse";
        setTimeout(() => {
          document.body.removeChild(notification);
          document.head.removeChild(style);
        }, 300);
      }
    }, 3000);
  };

  // Show offline message if backend is not connected
  if (!isOnline) {
    return (
      <Layout title="Profile - Planeswalker's Primer">
        <div className="container page-content">
          <div
            className="card text-center"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🌐</div>
            <h2 className="card-title">Currently Offline</h2>
            <p className="mb-3" style={{ fontSize: "1.1rem" }}>
              Profile management requires a connection to the backend server. Please check your connection and try again.
            </p>
            <div
              className="d-flex gap-2 justify-center"
              style={{ flexWrap: "wrap" }}
            >
              <button
                onClick={() => window.location.reload()}
                className="btn"
              >
                🔄 Retry Connection
              </button>
              <a href="/search" className="btn-outline">
                🔍 Search Cards Instead
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile - Planeswalker's Primer">
      <div className="container page-content">
        {/* Page Header */}
        <div className="text-center mb-3">
          <div
            className="header-box"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <h1>Profile Management</h1>
            <p style={{ fontSize: "1.25rem" }}>
              Manage your profile and user settings
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <Loading message="Loading profile..." size="large" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`${error.includes('offline') ? 'info' : 'error'} mt-2 mb-2`}>
            <h4 className="mb-1">{error.includes('offline') ? 'Offline Mode' : 'Error'}</h4>
            <p className="mb-0">{error}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Current User Section */}
            {currentUser ? (
              <div className="card mb-3 text-center">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👤</div>
                <h2 className="card-title mb-1">{currentUser.username}</h2>
                <p className="mb-0" style={{ fontSize: "1.1rem" }}>
                  Profile created:{" "}
                  {new Date(currentUser.created_at).toLocaleDateString()}
                </p>

                {/* Create/Edit/Delete Buttons */}
                <div
                  className="d-flex gap-2 justify-center mt-3"
                  style={{ flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => setIsCreating(!isCreating)}
                    disabled={actionLoading}
                    className="btn profile-btn-blue"
                  >
                    {isCreating ? "Cancel Create" : "Create Profile"}
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={actionLoading || ((!isOnline || !apiService.isOnline()) && currentUser.username === "Demo")}
                    className="btn profile-btn-blue"
                  >
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={actionLoading || ((!isOnline || !apiService.isOnline()) && currentUser.username === "Demo")}
                    className="btn btn-danger"
                    style={{
                      opacity: actionLoading || ((!isOnline || !apiService.isOnline()) && currentUser.username === "Demo") ? 0.5 : 1,
                      background: 'var(--theme-danger)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    {actionLoading ? "Deleting..." : "Delete Profile"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center mb-3">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👤</div>
                <h3 className="card-title">No Profile Selected</h3>
                <p className="mb-3">
                  Create a new profile or select an existing one to get started.
                </p>
              </div>
            )}

            {/* Edit Profile Form */}
            {isEditing && currentUser && (
              <div className="card mb-3">
                <h3 className="card-title mb-3">Edit Profile</h3>
                <form onSubmit={handleUpdateUser}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      value={editingUsername}
                      onChange={(e) => setEditingUsername(e.target.value)}
                      placeholder="Enter username"
                      disabled={actionLoading}
                      required
                    />
                  </div>
                  <div
                    className="d-flex gap-2"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={actionLoading}
                      className="btn profile-btn-blue"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading || !editingUsername.trim()}
                      className="btn profile-btn-blue"
                    >
                      {actionLoading ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Create New Profile Form */}
            {(isCreating || !currentUser) && (
              <div className="card mb-3">
                <h3 className="card-title mb-3">Create New Profile</h3>
                <form onSubmit={handleCreateUser}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter username"
                      disabled={actionLoading}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2" style={{ justifyContent: "flex-end" }}>
                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreating(false);
                          setNewUsername("");
                        }}
                        disabled={actionLoading}
                        className="btn profile-btn-blue"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={actionLoading || !newUsername.trim() || (!isOnline && !apiService.isOnline())}
                      className="btn profile-btn-blue"
                    >
                      {actionLoading ? "Creating..." : "Create Profile"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Users List */}
            {users.length > 0 && (
              <div className="card">
                <h3 className="card-title mb-3">
                  {currentUser ? "Switch Profile" : "Select Profile"}
                </h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="d-flex justify-between align-center"
                      style={{
                        padding: "1rem",
                        border:
                          currentUser?.id === user.id
                            ? "2px solid var(--theme-primary)"
                            : "1px solid var(--theme-border)",
                        borderRadius: "0.5rem",
                        background:
                          currentUser?.id === user.id
                            ? "rgba(var(--theme-primaryRgb), 0.1)"
                            : "var(--theme-cardBg)",
                      }}
                    >
                      <div>
                        <h4
                          className="card-title mb-1"
                          style={{ fontSize: "1rem" }}
                        >
                          {user.username}
                          {currentUser?.id === user.id && (
                            <span
                              className="text-muted"
                              style={{
                                fontSize: "0.875rem",
                                marginLeft: "0.5rem",
                              }}
                            >
                              (Current)
                            </span>
                          )}
                        </h4>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "0.875rem" }}
                        >
                          Created:{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => handleSwitchUser(user)}
                          disabled={actionLoading}
                          className="btn profile-btn-blue"
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem"
                          }}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


          </>
        )}
      </div>
    </Layout>
  );
}

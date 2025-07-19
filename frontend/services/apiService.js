// Simplified API Service - Direct backend communication only
// No offline fallbacks or mock data

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const REQUEST_TIMEOUT = 5000; // 5 seconds

// Connection state management
let isOnline = true;
let connectionListeners = [];
let healthCheckInterval = null;

// Add connection status listener
export function addConnectionListener(callback) {
  connectionListeners.push(callback);
  // Immediately call with current status
  callback(isOnline);
}

// Remove connection status listener
export function removeConnectionListener(callback) {
  connectionListeners = connectionListeners.filter(cb => cb !== callback);
}

// Notify all listeners of connection status change
function notifyConnectionChange(online) {
  if (isOnline !== online) {
    isOnline = online;
    console.log(`🔗 Backend connection: ${online ? 'ONLINE' : 'OFFLINE'}`);
    connectionListeners.forEach(callback => callback(online));
  }
}

// Health check function
async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      notifyConnectionChange(true);
      return { success: true, data };
    } else {
      notifyConnectionChange(false);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    notifyConnectionChange(false);
    return { success: false, error: error.message };
  }
}

// Start periodic health checks
export function startHealthChecks() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }

  // Initial check
  checkBackendHealth();

  // Periodic checks every 30 seconds
  healthCheckInterval = setInterval(checkBackendHealth, 30000);
}

// Stop health checks
export function stopHealthChecks() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    notifyConnectionChange(true);
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error.message);
    notifyConnectionChange(false);
    throw error;
  }
}

// Main API service
export const apiService = {
  // Get current connection status
  isOnline: () => isOnline,

  // Health check
  async health() {
    return await apiRequest('/health');
  },

  // User operations
  users: {
    async getAll() {
      return await apiRequest('/api/users');
    },

    async getById(id) {
      return await apiRequest(`/api/users/${id}`);
    },

    async create(userData) {
      return await apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    async update(id, userData) {
      return await apiRequest(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    },

    async delete(id) {
      return await apiRequest(`/api/users/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Favourites operations
  favourites: {
    async getByUserId(userId) {
      return await apiRequest(`/api/favorites/${userId}`);
    },

    async create(favouriteData) {
      return await apiRequest('/api/favorites', {
        method: 'POST',
        body: JSON.stringify(favouriteData)
      });
    },

    async update(id, favouriteData) {
      return await apiRequest(`/api/favorites/${id}`, {
        method: 'PUT',
        body: JSON.stringify(favouriteData)
      });
    },

    async delete(id) {
      return await apiRequest(`/api/favorites/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Card operations - direct Scryfall API calls
  cards: {
    async search(query) {
      try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodedQuery}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            return { data: [], total_cards: 0 };
          }
          throw new Error(`Scryfall API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Card search error:', error);
        throw error;
      }
    },

    async random(ability) {
      try {
        let url = 'https://api.scryfall.com/cards/random';
        if (ability) {
          url += `?q=oracle:${encodeURIComponent(ability)}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Scryfall API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Random card error:', error);
        throw error;
      }
    },

    async getById(id) {
      try {
        const response = await fetch(`https://api.scryfall.com/cards/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Scryfall API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Get card by ID error:', error);
        throw error;
      }
    },
  },

  // Messages (for testing)
  messages: {
    async getAll() {
      return await apiRequest('/api/messages');
    },

    async create(messageData) {
      return await apiRequest('/api/messages', {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
    }
  }
};

// Auto-start health checks when module loads
if (typeof window !== 'undefined') {
  // Start health checks to detect backend availability
  startHealthChecks();
}

export default apiService;

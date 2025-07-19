// API Service with Online/Offline Detection and Mock Fallback
// Automatically switches between real backend and mock data based on connectivity

import { mockApi } from './mockApi.js';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const REQUEST_TIMEOUT = 5000; // 5 seconds

// Connection state management - start by checking if backend is available
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

  // Periodic checks
  healthCheckInterval = setInterval(checkBackendHealth, HEALTH_CHECK_INTERVAL);
}

// Stop health checks
export function stopHealthChecks() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

// Generic API request function with fallback
async function apiRequest(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

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
    console.log(`📱 Backend unavailable for ${endpoint}, using offline mode:`, error.message);
    notifyConnectionChange(false);
    throw new Error('OFFLINE_MODE');
  }
}

// Main API service
export const apiService = {
  // Get current connection status
  isOnline: () => isOnline,

  // Health check
  async health() {
    try {
      return await apiRequest('/health');
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        return await mockApi.health();
      }
      throw error;
    }
  },

  // User operations
  users: {
    async getAll() {
      try {
        return await apiRequest('/api/users');
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.users.getAll();
        }
        throw error;
      }
    },

    async getById(id) {
      try {
        return await apiRequest(`/api/users/${id}`);
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.users.getById(id);
        }
        throw error;
      }
    },

    async create(userData) {
      try {
        return await apiRequest('/api/users', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.users.create(userData);
        }
        throw error;
      }
    },

    async update(id, userData) {
      try {
        return await apiRequest(`/api/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(userData)
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.users.update(id, userData);
        }
        throw error;
      }
    },

    async delete(id) {
      try {
        return await apiRequest(`/api/users/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.users.delete(id);
        }
        throw error;
      }
    }
  },

  // Favourites operations
  favourites: {
    async getByUserId(userId) {
      try {
        return await apiRequest(`/api/favorites/${userId}`);
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.favourites.getByUserId(userId);
        }
        throw error;
      }
    },

    async create(favouriteData) {
      try {
        return await apiRequest('/api/favorites', {
          method: 'POST',
          body: JSON.stringify(favouriteData)
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.favourites.create(favouriteData);
        }
        throw error;
      }
    },

    async update(id, favouriteData) {
      try {
        return await apiRequest(`/api/favorites/${id}`, {
          method: 'PUT',
          body: JSON.stringify(favouriteData)
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.favourites.update(id, favouriteData);
        }
        throw error;
      }
    },

    async delete(id) {
      try {
        return await apiRequest(`/api/favorites/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.favourites.delete(id);
        }
        throw error;
      }
    }
  },

  // Card operations
  // Card search (direct Scryfall API via mock service)
  cards: {
    async search(query) {
      // Always use mock API which now calls Scryfall directly
      return await mockApi.cards.search(query);
    },

    async random(ability) {
      // Always use mock API which now calls Scryfall directly
      return await mockApi.cards.random(ability);
    },

    async getById(id) {
      // Always use mock API which now calls Scryfall directly
      return await mockApi.cards.getById(id);
    },
  },

  // Messages (for testing)
  messages: {
    async getAll() {
      try {
        return await apiRequest('/api/messages');
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.messages.getAll();
        }
        throw error;
      }
    },

    async create(messageData) {
      try {
        return await apiRequest('/api/messages', {
          method: 'POST',
          body: JSON.stringify(messageData)
        });
      } catch (error) {
        if (error.message === 'OFFLINE_MODE') {
          return await mockApi.messages.create(messageData);
        }
        throw error;
      }
    }
  }
};

// Auto-start health checks when module loads
if (typeof window !== 'undefined') {
  // Start health checks to detect backend availability
  startHealthChecks();
}

export default apiService;

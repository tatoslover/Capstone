// API Cache Utility for Scryfall API responses
// Implements in-memory caching with TTL and size limits

class APICache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100; // Maximum number of cached entries
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes default
    this.cleanupInterval = options.cleanupInterval || 60 * 1000; // 1 minute
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
    };

    // Start periodic cleanup
    this.startCleanup();
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  // Get item from cache
  get(url, params) {
    const key = this.generateKey(url, params);
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.data;
  }

  // Set item in cache
  set(url, params, data, ttl) {
    const key = this.generateKey(url, params);
    const expiry = Date.now() + (ttl || this.defaultTTL);

    // Check size limit
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (first in map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }

    this.cache.set(key, {
      data,
      expiry,
      timestamp: Date.now(),
    });
  }

  // Clear all cache entries
  clear() {
    this.cache.clear();
  }

  // Remove expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Start periodic cleanup
  startCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cleanupTimer = setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  // Stop periodic cleanup
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // Get cache statistics
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  // Get cache info for debugging
  getInfo() {
    const entries = [];
    for (const [key, item] of this.cache.entries()) {
      entries.push({
        key,
        timestamp: new Date(item.timestamp).toISOString(),
        expiry: new Date(item.expiry).toISOString(),
        expiresIn: Math.max(0, item.expiry - Date.now()),
      });
    }
    return entries;
  }
}

// Specific cache configurations for different API endpoints
const cacheConfigs = {
  cardSearch: {
    maxSize: 50,
    defaultTTL: 10 * 60 * 1000, // 10 minutes for search results
  },
  cardDetails: {
    maxSize: 200,
    defaultTTL: 30 * 60 * 1000, // 30 minutes for individual cards
  },
  randomCard: {
    maxSize: 20,
    defaultTTL: 1 * 60 * 1000, // 1 minute for random cards
  },
};

// Create cache instances
const caches = {
  cardSearch: new APICache(cacheConfigs.cardSearch),
  cardDetails: new APICache(cacheConfigs.cardDetails),
  randomCard: new APICache(cacheConfigs.randomCard),
};

// Cache wrapper for API calls
export async function withCache(cacheType, url, params, fetchFunction) {
  const cache = caches[cacheType];
  if (!cache) {
    console.warn(`Unknown cache type: ${cacheType}`);
    return await fetchFunction();
  }

  // Check cache first
  const cached = cache.get(url, params);
  if (cached) {
    console.log(`🎯 Cache hit for ${cacheType}`);
    return cached;
  }

  // Fetch from API
  console.log(`📡 Cache miss for ${cacheType}, fetching from API`);
  try {
    const data = await fetchFunction();
    // Only cache successful responses
    if (data) {
      cache.set(url, params, data);
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${cacheType}:`, error);
    throw error;
  }
}

// Export cache instances for direct access
export const cardSearchCache = caches.cardSearch;
export const cardDetailsCache = caches.cardDetails;
export const randomCardCache = caches.randomCard;

// Export function to get all cache stats
export function getAllCacheStats() {
  return {
    cardSearch: cardSearchCache.getStats(),
    cardDetails: cardDetailsCache.getStats(),
    randomCard: randomCardCache.getStats(),
  };
}

// Export function to clear all caches
export function clearAllCaches() {
  Object.values(caches).forEach(cache => cache.clear());
  console.log('🧹 All caches cleared');
}

// Cleanup function for when component unmounts
export function stopAllCacheCleanup() {
  Object.values(caches).forEach(cache => cache.stopCleanup());
}

export default APICache;

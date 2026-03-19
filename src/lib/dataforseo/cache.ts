// Caching layer for DataForSEO API responses
// Uses localStorage for client-side caching with TTL support

import { cacheConfig } from '@/config/api-config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

type CacheType = keyof typeof cacheConfig.ttlByType;

class DataForSEOCache {
  private prefix: string;
  private enabled: boolean;
  private memoryCache: Map<string, CacheEntry<unknown>>;

  constructor() {
    this.prefix = cacheConfig.keyPrefix;
    this.enabled = cacheConfig.enabled;
    this.memoryCache = new Map();
  }

  /**
   * Generate a cache key from the endpoint and parameters
   */
  private generateKey(endpoint: string, params?: Record<string, unknown>): string {
    const paramString = params ? JSON.stringify(params) : '';
    const hash = this.simpleHash(paramString);
    return `${this.prefix}${endpoint}_${hash}`;
  }

  /**
   * Simple hash function for cache keys
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get TTL for a specific cache type
   */
  private getTTL(type?: CacheType): number {
    if (type && type in cacheConfig.ttlByType) {
      return cacheConfig.ttlByType[type];
    }
    return cacheConfig.ttl;
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    const expiresAt = entry.timestamp + (entry.ttl * 1000);
    return now < expiresAt;
  }

  /**
   * Get data from cache
   */
  get<T>(endpoint: string, params?: Record<string, unknown>): T | null {
    if (!this.enabled) return null;

    const key = this.generateKey(endpoint, params);

    // Try memory cache first
    const memoryEntry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (memoryEntry && this.isValid(memoryEntry)) {
      return memoryEntry.data;
    }

    // Try localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          if (this.isValid(entry)) {
            // Restore to memory cache
            this.memoryCache.set(key, entry);
            return entry.data;
          } else {
            // Clean up expired entry
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn('Cache read error:', error);
      }
    }

    return null;
  }

  /**
   * Set data in cache
   */
  set<T>(
    endpoint: string,
    data: T,
    params?: Record<string, unknown>,
    type?: CacheType
  ): void {
    if (!this.enabled) return;

    const key = this.generateKey(endpoint, params);
    const ttl = this.getTTL(type);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (error) {
        // localStorage might be full, clear old entries
        console.warn('Cache write error:', error);
        this.clearExpired();
      }
    }
  }

  /**
   * Remove a specific cache entry
   */
  remove(endpoint: string, params?: Record<string, unknown>): void {
    const key = this.generateKey(endpoint, params);
    
    this.memoryCache.delete(key);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear all cache entries for this application
   */
  clear(): void {
    this.memoryCache.clear();

    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    // Clear expired from memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry as CacheEntry<unknown>)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear expired from localStorage
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry: CacheEntry<unknown> = JSON.parse(stored);
              if (!this.isValid(entry)) {
                keysToRemove.push(key);
              }
            }
          } catch {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { memoryEntries: number; localStorageEntries: number; totalSize: number } {
    let localStorageEntries = 0;
    let totalSize = 0;

    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          localStorageEntries++;
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length * 2; // UTF-16 characters
          }
        }
      }
    }

    return {
      memoryEntries: this.memoryCache.size,
      localStorageEntries,
      totalSize,
    };
  }
}

// Export singleton instance
export const cache = new DataForSEOCache();

// Export class for testing
export { DataForSEOCache };

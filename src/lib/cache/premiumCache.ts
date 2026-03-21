interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class PremiumCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly TTL = 5 * 60 * 1000

  set<T>(key: string, value: T): void {
    this.cache.set(key, { value, expiresAt: Date.now() + this.TTL })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return entry.value as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  invalidateUser(userId: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`premium:${userId}`)) {
        this.cache.delete(key)
      }
    }
  }
}

export const premiumCache = new PremiumCache()

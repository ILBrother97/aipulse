export const cacheRules = {
  '/api/premium-status': { maxAge: 300, staleWhileRevalidate: 60 },
  '/api/usage/*': { maxAge: 60, staleWhileRevalidate: 30 },
  '/api/analytics/*': { maxAge: 3600, staleWhileRevalidate: 300 }
}

export function shouldCache(path: string): { maxAge: number; staleWhileRevalidate: number } | null {
  for (const [pattern, rules] of Object.entries(cacheRules)) {
    if (path.match(new RegExp(pattern.replace('*', '.*')))) {
      return rules
    }
  }
  return null
}

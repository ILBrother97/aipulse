type Feature = 'ai_queries' | 'collections' | 'workflows' | 'analytics' | 'themes'

const PREMIUM_FEATURES: Feature[] = ['ai_queries', 'collections', 'workflows', 'analytics', 'themes']

export function isPremiumFeature(feature: string): boolean {
  return PREMIUM_FEATURES.includes(feature as Feature)
}

export function getFeatureLimit(feature: string, isPremium: boolean): number {
  if (isPremium) return -1 // Unlimited
  
  const limits: Record<Feature, number> = {
    ai_queries: 1,
    collections: 3,
    workflows: 1,
    analytics: 0,
    themes: 5
  }
  
  return limits[feature as Feature] ?? 0
}

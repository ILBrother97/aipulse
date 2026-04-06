// All features are now free for everyone
// Premium is only for ad-free experience
// This file is kept for backward compatibility but returns unlimited access

export function isPremiumFeature(_feature: string): boolean {
  return false
}

export function getFeatureLimit(_feature: string, _isPremium: boolean): number {
  return -1 // Unlimited for everyone
}

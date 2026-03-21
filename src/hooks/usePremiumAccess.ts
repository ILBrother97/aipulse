import { useCallback } from 'react'
import { usePremium } from '../contexts/PremiumContext'
import { validateUsage } from '../lib/api/usageValidation'

export function usePremiumAccess() {
  const { isPremium, isLoading } = usePremium()

  const checkFeature = useCallback(async (feature: string) => {
    if (isPremium) return { allowed: true, isPremium: true }
    return validateUsage(feature)
  }, [isPremium])

  return { isPremium, isLoading, checkFeature }
}

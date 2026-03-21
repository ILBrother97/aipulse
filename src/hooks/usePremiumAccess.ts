import { useCallback } from 'react'
import { usePremium } from '../contexts/PremiumContext'
import { validateUserUsage } from '../lib/api/usageValidation'
import { supabase } from '@/lib/supabase'

export function usePremiumAccess() {
  const { isPremium, isLoading } = usePremium()

  const checkFeature = useCallback(async (feature: string) => {
    if (isPremium) return { canAccess: true, isPremium: true, currentUsage: 0, limit: 0 }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { canAccess: false, isPremium: false, currentUsage: 0, limit: 0 }
    
    return validateUserUsage(user.id, feature)
  }, [isPremium])

  return { isPremium, isLoading, checkFeature }
}

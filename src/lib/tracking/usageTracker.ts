import { supabase } from '@/lib/supabase'
import { validateUserUsage, incrementUsage } from '../api/usageValidation'

export async function trackUsage(feature: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const validation = await validateUserUsage(user.id, feature)
  
  if (!validation.canAccess) {
    throw new Error(`Usage limit exceeded for ${feature}`)
  }

  await incrementUsage(user.id, feature)

  return true
}

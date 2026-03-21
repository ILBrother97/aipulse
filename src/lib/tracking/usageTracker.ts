import { supabase } from '@/lib/supabase'
import { validateUsage } from '../api/usageValidation'

export async function trackUsage(feature: string): Promise<boolean> {
  const validation = await validateUsage(feature)
  
  if (!validation.allowed) {
    throw new Error(`Usage limit exceeded for ${feature}`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await (supabase.from('usage_events') as any).insert({
    user_id: user.id,
    event_type: 'usage',
    feature_type: feature
  })

  return true
}

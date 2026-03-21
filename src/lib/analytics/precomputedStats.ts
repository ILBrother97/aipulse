import { supabase } from '@/lib/supabase'

export async function getDailyStats(feature?: string) {
  let query = supabase.from('daily_usage_stats').select('*').order('date', { ascending: false }).limit(30)
  if (feature) query = query.eq('feature_type', feature)
  return (await query).data
}

export async function getMonthlyStats(feature?: string) {
  let query = supabase.from('monthly_usage_stats').select('*').order('month', { ascending: false }).limit(12)
  if (feature) query = query.eq('feature_type', feature)
  return (await query).data
}

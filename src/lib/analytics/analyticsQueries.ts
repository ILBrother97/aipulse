import { supabase } from '@/lib/supabase'

export async function getAnalytics(includeArchived = false) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentEvents } = await supabase
    .from('usage_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())

  if (includeArchived) {
    const { data: archivedEvents } = await supabase
      .from('usage_events_archive')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())

    return [...(recentEvents ?? []), ...(archivedEvents ?? [])]
  }

  return recentEvents ?? []
}

import { supabase } from '@/lib/supabase'

export async function validateUsage(feature: string): Promise<{ allowed: boolean; isPremium: boolean; currentUsage?: number; limit?: number }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { allowed: false, isPremium: false }

  const { data: { session } } = await supabase.auth.getSession()
  
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
    body: JSON.stringify({ userId: user.id, feature })
  })

  return response.json()
}

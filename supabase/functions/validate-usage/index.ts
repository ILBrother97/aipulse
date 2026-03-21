import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PREMIUM_LIMITS = {
  ai_queries: { free: 1, premium: -1 },
  collections: { free: 3, premium: -1 },
  workflows: { free: 1, premium: -1 },
}

async function incrementUsage(userId: string, feature: string, supabase: any) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase.from('user_usage').select('id, usage_count').eq('user_id', userId).eq('feature_type', feature).eq('reset_date', today).single()
  
  if (data) {
    await supabase.from('user_usage').update({ usage_count: data.usage_count + 1 }).eq('id', data.id)
  } else {
    await supabase.from('user_usage').insert({ user_id: userId, feature_type: feature, usage_count: 1, reset_date: today })
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, feature, increment } = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!userId || !feature) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } })
    
    const { data: { user } } = await supabase.auth.getUser()
    const isPremium = user?.user_metadata?.subscription_status === 'active'

    if (isPremium) {
      return new Response(JSON.stringify({ allowed: true, isPremium: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const today = new Date().toISOString().split('T')[0]
    const limit = PREMIUM_LIMITS[feature as keyof typeof PREMIUM_LIMITS]
    
    if (!limit) {
      return new Response(JSON.stringify({ error: 'Invalid feature' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: usage } = await supabase.from('user_usage').select('usage_count').eq('user_id', userId).eq('feature_type', feature).eq('reset_date', today).single()

    const currentUsage = usage?.usage_count ?? 0
    const allowed = currentUsage < limit.free

    if (increment && allowed) {
      await incrementUsage(userId, feature, supabase)
    }

    return new Response(JSON.stringify({ allowed, isPremium: false, currentUsage, limit: limit.free }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

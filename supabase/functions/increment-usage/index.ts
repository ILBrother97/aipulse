const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, feature } = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await fetch(`${supabaseUrl}/rest/v1/user_usage?user_id=eq.${userId}&feature_type=eq.${feature}&reset_date=eq.${today}&select=id,usage_count`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    }).then(r => r.json())

    if (existing && existing.length > 0) {
      await fetch(`${supabaseUrl}/rest/v1/user_usage?id=eq.${existing[0].id}`, {
        method: 'PATCH',
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ usage_count: existing[0].usage_count + 1 })
      })
    } else {
      await fetch(`${supabaseUrl}/rest/v1/user_usage`, {
        method: 'POST',
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, feature_type: feature, usage_count: 1, reset_date: today })
      })
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

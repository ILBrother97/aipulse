Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/archive_usage_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey!,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })

  return new Response(JSON.stringify({ success: response.ok }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

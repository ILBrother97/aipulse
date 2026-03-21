Deno.serve(async () => {
  const checks = {
    database: false,
    timestamp: new Date().toISOString()
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    checks.database = response.ok
  } catch {
    checks.database = false
  }

  const healthy = checks.database
  return new Response(JSON.stringify({ healthy, checks }), {
    headers: { 'Content-Type': 'application/json' },
    status: healthy ? 200 : 503
  })
})

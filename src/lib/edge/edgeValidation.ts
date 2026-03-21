export async function edgeValidatePremium(userId: string): Promise<boolean> {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, feature: 'edge_check' })
  })
  const data = await response.json()
  return data.isPremium ?? false
}

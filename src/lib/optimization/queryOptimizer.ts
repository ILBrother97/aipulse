import { supabase } from '@/lib/supabase'

export async function optimizedQuery(
  table: string,
  conditions: Record<string, any>,
  options: { limit?: number; orderBy?: string; useIndex?: string } = {}
) {
  let query = supabase.from(table).select('*', { count: 'exact' })
  
  for (const [key, value] of Object.entries(conditions)) {
    query = query.eq(key, value)
  }
  
  if (options.orderBy) {
    query = query.order(options.orderBy as any, { ascending: false })
  }
  
  if (options.limit) {
    query = query.limit(options.limit)
  }
  
  return query
}

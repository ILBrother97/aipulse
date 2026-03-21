import { supabase } from '@/lib/supabase'

interface AuditEvent {
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  metadata?: Record<string, any>
  ip_address?: string
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await (supabase.from('audit_logs') as any).insert({
      user_id: event.user_id,
      action: event.action,
      resource_type: event.resource_type,
      resource_id: event.resource_id,
      metadata: event.metadata,
      ip_address: event.ip_address,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}

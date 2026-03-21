import { supabase } from '@/lib/supabase'

interface DeadLetterMessage {
  id: string
  originalMessage: any
  error: string
  failedAt: string
  retryCount: number
}

export async function addToDeadLetterQueue(
  messageId: string,
  originalMessage: any,
  error: Error
): Promise<void> {
  await (supabase.from('dead_letter_queue') as any).insert({
    original_message: originalMessage,
    error_message: error.message,
    message_id: messageId,
    failed_at: new Date().toISOString()
  })
}

export async function getDeadLetterMessages(limit = 100): Promise<DeadLetterMessage[]> {
  const { data } = await supabase
    .from('dead_letter_queue')
    .select('*')
    .order('failed_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

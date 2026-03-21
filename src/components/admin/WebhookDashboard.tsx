import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface WebhookLog {
  id: string
  event_type: string
  status: string
  retry_count: number
  error_message: string | null
  processed_at: string | null
  created_at: string
}

export function WebhookDashboard() {
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 10000)
    return () => clearInterval(interval)
  }, [])

  async function loadLogs() {
    const { data } = await supabase
      .from('webhook_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setLogs(data ?? [])
    setLoading(false)
  }

  const stats = {
    pending: logs.filter(l => l.status === 'pending').length,
    processed: logs.filter(l => l.status === 'processed').length,
    failed: logs.filter(l => l.status === 'failed').length
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Webhook Processing Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-yellow-100 p-4 rounded">Pending: {stats.pending}</div>
        <div className="bg-green-100 p-4 rounded">Processed: {stats.processed}</div>
        <div className="bg-red-100 p-4 rounded">Failed: {stats.failed}</div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Retries</th>
              <th className="p-2 text-left">Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td className="p-2">{log.event_type}</td>
                <td className="p-2">{log.status}</td>
                <td className="p-2">{log.retry_count}</td>
                <td className="p-2 text-red-600">{log.error_message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

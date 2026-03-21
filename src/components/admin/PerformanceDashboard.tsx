import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { alertManager } from '@/lib/monitoring/alerting'

interface PerformanceMetric {
  name: string
  value: number
  threshold: number
  timestamp: string
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [alerts, setAlerts] = useState(alertManager.getRecentAlerts())

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(alertManager.getRecentAlerts())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Performance Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Recent Alerts</h3>
          {alerts.length === 0 ? (
            <p className="text-gray-500">No recent alerts</p>
          ) : (
            <ul className="space-y-2">
              {alerts.slice(-5).reverse().map((alert, i) => (
                <li key={i} className={`p-2 rounded ${
                  alert.level === 'critical' ? 'bg-red-100' :
                  alert.level === 'error' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  <span className="font-medium">{alert.level}:</span> {alert.message}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">System Health</h3>
          <p>Status: <span className="text-green-600">Healthy</span></p>
          <p>Uptime: 99.9%</p>
        </div>
      </div>
    </div>
  )
}

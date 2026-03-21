import { useEffect, useState } from 'react'
import { getAnalytics } from '../../lib/analytics/analyticsQueries'

interface UsageStats {
  total: number
  byFeature: Record<string, number>
  recentActivity: any[]
}

export function UsageAnalytics() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then(data => {
      const byFeature: Record<string, number> = {}
      data.forEach((event: any) => {
        byFeature[event.feature_type] = (byFeature[event.feature_type] || 0) + 1
      })
      setStats({ total: data.length, byFeature, recentActivity: data.slice(-10) })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading analytics...</div>
  if (!stats) return <div>Failed to load analytics</div>

  return (
    <div className="usage-analytics">
      <h3>Usage Statistics</h3>
      <p>Total events: {stats.total}</p>
      <div className="feature-breakdown">
        {Object.entries(stats.byFeature).map(([feature, count]) => (
          <div key={feature}>{feature}: {count}</div>
        ))}
      </div>
    </div>
  )
}

interface SuspiciousActivity {
  userId: string
  type: string
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}

const activityLog: SuspiciousActivity[] = []
const RAPID_FIRE_THRESHOLD = 10
const RAPID_FIRE_WINDOW = 5000

export function detectAbuse(userId: string, action: string): { isSuspicious: boolean; severity: SuspiciousActivity['severity'] } {
  const now = Date.now()
  const recentActivity = activityLog.filter(
    a => a.userId === userId && now - a.timestamp < RAPID_FIRE_WINDOW
  )
  
  if (recentActivity.length >= RAPID_FIRE_THRESHOLD) {
    const activity: SuspiciousActivity = {
      userId,
      type: 'rapid_fire',
      timestamp: now,
      severity: 'high'
    }
    activityLog.push(activity)
    return { isSuspicious: true, severity: 'high' }
  }
  
  return { isSuspicious: false, severity: 'low' }
}

export function logSuspiciousActivity(activity: SuspiciousActivity) {
  activityLog.push(activity)
  console.warn(`[Abuse Detection] User ${activity.userId}: ${activity.type} (${activity.severity})`)
}

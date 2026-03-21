type AlertLevel = 'info' | 'warning' | 'error' | 'critical'

interface Alert {
  level: AlertLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
}

class AlertManager {
  private alerts: Alert[] = []

  log(level: AlertLevel, message: string, context?: Record<string, any>) {
    const alert: Alert = { level, message, timestamp: new Date(), context }
    this.alerts.push(alert)
    console.error(`[${level.toUpperCase()}] ${message}`, context)
    
    if (level === 'critical' || level === 'error') {
      this.sendAlert(alert)
    }
  }

  private async sendAlert(alert: Alert) {
    console.error('ALERT:', JSON.stringify(alert))
  }

  getRecentAlerts(limit = 100): Alert[] {
    return this.alerts.slice(-limit)
  }
}

export const alertManager = new AlertManager()

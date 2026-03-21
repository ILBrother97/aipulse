interface Metric {
  name: string
  value: number
  unit: string
  timestamp: number
}

class MetricsCollector {
  private metrics: Metric[] = []
  private readonly MAX_METRICS = 1000

  record(name: string, value: number, unit = 'ms') {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: Date.now()
    })
    
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS)
    }
  }

  get(name: string, duration = 60000): Metric[] {
    const cutoff = Date.now() - duration
    return this.metrics.filter(m => m.name === name && m.timestamp > cutoff)
  }

  getStats(name: string, duration = 60000): { avg: number; p95: number; max: number } {
    const data = this.get(name, duration).map(m => m.value)
    if (data.length === 0) return { avg: 0, p95: 0, max: 0 }
    
    const sorted = [...data].sort((a, b) => a - b)
    return {
      avg: data.reduce((a, b) => a + b, 0) / data.length,
      p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
      max: sorted[sorted.length - 1] ?? 0
    }
  }
}

export const metricsCollector = new MetricsCollector()

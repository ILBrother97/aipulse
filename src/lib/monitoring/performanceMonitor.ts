type MetricType = 'api' | 'db' | 'ui'

export function measurePerformance<T>(name: string, fn: () => Promise<T>, type: MetricType = 'api'): Promise<T> {
  const start = performance.now()
  return fn().finally(() => {
    const duration = performance.now() - start
    const threshold = type === 'db' ? 100 : type === 'ui' ? 16 : 200
    if (duration > threshold) {
      console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`)
    }
  })
}

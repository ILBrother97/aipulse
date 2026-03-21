const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 5000, 30000]

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[i] ?? 30000))
      }
    }
  }
  
  throw lastError!
}

export function calculateBackoff(retryCount: number): number {
  const baseDelay = 1000
  const maxDelay = 30000
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay)
  const jitter = Math.random() * 1000
  return exponentialDelay + jitter
}

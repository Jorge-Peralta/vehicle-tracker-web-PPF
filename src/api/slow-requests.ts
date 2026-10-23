/**
 * Tracks requests that take longer than SLOW_REQUEST_MS, so the UI can explain the delay.
 * The API runs on Render's free tier (and the database on Neon), which sleep when idle:
 * the first request after a while can take 30+ seconds while they wake up.
 */
const SLOW_REQUEST_MS = 3000

let slowRequestCount = 0
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

/** Call when a request starts; returns a function to call when it settles. */
export function trackRequest(): () => void {
  let isSlow = false
  const timer = setTimeout(() => {
    isSlow = true
    slowRequestCount += 1
    notify()
  }, SLOW_REQUEST_MS)

  return () => {
    clearTimeout(timer)
    if (isSlow) {
      slowRequestCount -= 1
      notify()
    }
  }
}

// `useSyncExternalStore` contract
export function subscribeToSlowRequests(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function hasSlowRequests() {
  return slowRequestCount > 0
}

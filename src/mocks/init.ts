import { env } from '@shared/config/env'

const PREV_MOCK_KEY = 'nedu_mock_was_on'

export async function enableMocking(): Promise<void> {
  if (typeof window === 'undefined') return

  const prevOn = sessionStorage.getItem(PREV_MOCK_KEY) === '1'

  if (env.enableMocking) {
    const { worker } = await import('./browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
      quiet: true,
    })
    sessionStorage.setItem(PREV_MOCK_KEY, '1')
    return
  }

  // Mock disabled — unregister any leftover service worker
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations()
    for (const r of regs) {
      if (r.active?.scriptURL?.includes('mockServiceWorker')) {
        await r.unregister()
      }
    }
  }
  if (prevOn) {
    sessionStorage.removeItem(PREV_MOCK_KEY)
    location.reload()
  }
}

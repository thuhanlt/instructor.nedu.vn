import { initGA4, trackGA4 } from './ga4'
import { initClarity } from './clarity'
import { ANALYTICS_EVENTS, type AnalyticsEvent } from './events'

const ALLOWED_HOSTS = ['instructor.nedu.vn']

function shouldFire(): boolean {
  if (typeof window === 'undefined') return false
  return ALLOWED_HOSTS.includes(window.location.hostname)
}

export const analytics = {
  init() {
    if (!shouldFire()) return
    initGA4()
    void initClarity()
  },
  track(event: AnalyticsEvent | string, params?: Record<string, unknown>) {
    if (!shouldFire()) return
    trackGA4(event, params)
  },
}

export { ANALYTICS_EVENTS }
export type { AnalyticsEvent }
export { RouteTracker } from './RouteTracker'

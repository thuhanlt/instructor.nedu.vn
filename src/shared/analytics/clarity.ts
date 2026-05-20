import { env } from '../config/env'

let ready = false

export async function initClarity(): Promise<void> {
  if (ready || !env.clarityId) return
  if (typeof window === 'undefined') return
  try {
    const mod = await import('@microsoft/clarity')
    const clarity = (mod as { default?: { init?: (id: string) => void } }).default ?? mod
    if (clarity && typeof (clarity as { init?: (id: string) => void }).init === 'function') {
      ;(clarity as { init: (id: string) => void }).init(env.clarityId)
      ready = true
    }
  } catch {
    // ignore — clarity is optional
  }
}

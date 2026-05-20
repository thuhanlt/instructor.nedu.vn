import { env } from '../config/env'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let ready = false

export function initGA4(): void {
  if (ready || !env.ga4Id) return
  if (typeof window === 'undefined') return

  const id = env.ga4Id
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
  ready = true
}

export function trackGA4(event: string, params?: Record<string, unknown>) {
  if (!ready || !window.gtag) return
  window.gtag('event', event, params ?? {})
}

export function trackGA4PageView(path: string, title?: string) {
  if (!ready || !window.gtag) return
  window.gtag('event', 'page_view', { page_path: path, page_title: title })
}

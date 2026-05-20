export type ToastKind = 'success' | 'info' | 'warn' | 'error'

export interface ToastItem {
  id: number
  msg: string
  kind: ToastKind
}

type Listener = (toasts: ToastItem[]) => void

class ToastBus {
  private toasts: ToastItem[] = []
  private listeners = new Set<Listener>()
  private seq = 1

  push(msg: string, kind: ToastKind = 'info', timeoutMs = 3000) {
    const id = this.seq++
    this.toasts = [...this.toasts, { id, msg, kind }]
    this.emit()
    window.setTimeout(() => this.dismiss(id), timeoutMs)
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.emit()
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    fn(this.toasts)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private emit() {
    for (const fn of this.listeners) fn(this.toasts)
  }
}

export const toastBus = new ToastBus()

export function notify(msg: string, kind: ToastKind = 'info') {
  toastBus.push(msg, kind)
}

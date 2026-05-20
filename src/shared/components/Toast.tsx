import { useEffect, useState } from 'react'
import { toastBus, type ToastItem } from '../utils/notify'

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return toastBus.subscribe(setToasts)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

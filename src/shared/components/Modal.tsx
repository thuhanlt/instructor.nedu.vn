import { useEffect, type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Icon } from './Icon'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  footer?: ReactNode
  dismissOnBackdrop?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  dismissOnBackdrop = true,
}: Props) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && dismissOnBackdrop) onClose()
      }}
    >
      <div
        className={cn('modal', size === 'sm' && 'modal-sm', size === 'lg' && 'modal-lg')}
        role="dialog"
        aria-modal="true"
      >
        {title || onClose ? (
          <div className="modal-header">
            <div className="title">{title}</div>
            <button className="icon-btn" onClick={onClose} aria-label="Đóng" type="button">
              <Icon name="close" size={18} />
            </button>
          </div>
        ) : null}
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  )
}

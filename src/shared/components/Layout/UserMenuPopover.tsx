import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '@shared/i18n'
import { Icon } from '../Icon'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'

interface Props {
  open: boolean
  onClose: () => void
  onRequestLogout: () => void
}

export function UserMenuPopover({ open, onClose, onRequestLogout }: Props) {
  const t = useT()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) onClose()
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="user-popover" ref={ref}>
      <div className="head">
        <div className="name">{user?.name ?? '—'}</div>
        <div className="role">Người Dẫn Đường Chính</div>
      </div>
      <button
        className="item"
        type="button"
        onClick={() => {
          onClose()
          navigate('/profile')
        }}
      >
        <Icon name="profile" size={16} />
        {t('sidebar.profile')}
      </button>
      <button
        className="item danger"
        type="button"
        onClick={() => {
          onClose()
          onRequestLogout()
        }}
      >
        <Icon name="logout" size={16} />
        {t('sidebar.logout')}
      </button>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { Modal } from '../Modal'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { useT } from '@shared/i18n'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { notify } from '@shared/utils/notify'
import { env } from '@shared/config/env'

interface Props {
  open: boolean
  onClose: () => void
}

export function LogoutConfirmModal({ open, onClose }: Props) {
  const t = useT()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  async function handleLogout() {
    await logout()
    onClose()
    notify(t('logout.done'), 'success')
    // In mock mode the store auto-re-logs in the mock user, so stay on the current page.
    if (!env.enableMocking) {
      navigate('/login', { replace: true })
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--red-l)',
            color: 'var(--red)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Icon name="logout" size={24} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 19,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {t('logout.title')}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('logout.sub')}</div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          marginTop: 6,
        }}
      >
        <Button variant="o" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant="confirm" onClick={handleLogout}>
          {t('sidebar.logout')}
        </Button>
      </div>
    </Modal>
  )
}

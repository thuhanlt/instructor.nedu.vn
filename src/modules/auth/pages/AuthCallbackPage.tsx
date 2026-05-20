import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useT } from '@shared/i18n'
import { notify } from '@shared/utils/notify'

export function AuthCallbackPage() {
  const t = useT()
  const navigate = useNavigate()
  const acceptTokens = useAuthStore((s) => s.acceptTokens)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash
    const params = new URLSearchParams(hash)
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (!access_token || !refresh_token) {
      notify(t('login.failed'), 'error')
      navigate('/login', { replace: true })
      return
    }

    acceptTokens({ access_token, refresh_token }).then((user) => {
      if (!user) {
        notify(t('login.failed'), 'error')
        navigate('/login', { replace: true })
        return
      }
      navigate('/', { replace: true })
    })
  }, [acceptTokens, navigate, t])

  return (
    <div className="login-shell">
      <div className="spinner" />
      <div className="spinner-label" style={{ marginTop: 12, color: '#fff' }}>
        {t('login.signing-in')}
      </div>
    </div>
  )
}

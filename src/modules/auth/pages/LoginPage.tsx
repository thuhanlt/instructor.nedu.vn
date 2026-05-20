import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useT } from '@shared/i18n'
import { Icon } from '@shared/components/Icon'
import { env } from '@shared/config/env'

export function LoginPage() {
  const t = useT()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const initialized = useAuthStore((s) => s.initialized)
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)

  // If already logged in (mock mode auto-login or persistent token), skip the login screen.
  useEffect(() => {
    if (initialized && user) {
      navigate('/', { replace: true })
    }
  }, [initialized, user, navigate])

  // Mock mode: never show the Google login UI — jump straight in.
  useEffect(() => {
    if (env.enableMocking && initialized && !user) {
      navigate('/', { replace: true })
    }
  }, [initialized, user, navigate])

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="logo">N·Education</div>
        <h1>{t('login.greet')}</h1>
        <p className="sub">{t('login.sub')}</p>
        <button
          type="button"
          className="btn-google"
          onClick={() => loginWithGoogle()}
        >
          <Icon name="google" size={18} />
          {t('login.google')}
        </button>
        <div className="footer-note">{t('login.footer')}</div>
      </div>
    </div>
  )
}

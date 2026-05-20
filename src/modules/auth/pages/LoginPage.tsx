import { useAuthStore } from '../stores/useAuthStore'
import { useT } from '@shared/i18n'
import { Icon } from '@shared/components/Icon'

export function LoginPage() {
  const t = useT()
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)

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

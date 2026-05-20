import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../Icon'
import { NotificationBell } from '../NotificationBell'
import { UserMenuPopover } from './UserMenuPopover'
import { TimezoneClock } from '@shared/timezone/TimezoneClock'
import { timezoneShortLabel } from '@shared/timezone'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { useT, type DictKey } from '@shared/i18n'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { LogoutConfirmModal } from './LogoutConfirmModal'
import { analytics, ANALYTICS_EVENTS } from '@shared/analytics'

const PAGE_TITLE_KEYS: Record<string, DictKey> = {
  '/': 'page.home',
  '/calendar': 'page.calendar',
  '/qa': 'page.qa',
  '/students': 'page.students',
  '/feedback': 'page.feedback',
  '/courses': 'page.courses',
  '/profile': 'page.profile',
}

export function Topbar() {
  const t = useT()
  const location = useLocation()
  const navigate = useNavigate()
  const toggleSidebar = usePrefsStore((s) => s.toggleSidebar)
  const timezone = usePrefsStore((s) => s.timezone)
  const lang = usePrefsStore((s) => s.lang)
  const setLang = usePrefsStore((s) => s.setLang)
  const user = useAuthStore((s) => s.user)

  const [userMenu, setUserMenu] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const titleKey = PAGE_TITLE_KEYS[location.pathname] ?? 'page.home'

  const initial = (user?.name ?? 'N').slice(0, 1).toUpperCase()

  return (
    <header className="topbar">
      <button
        className="icon-btn"
        type="button"
        aria-label="Menu"
        onClick={toggleSidebar}
      >
        <Icon name="menu" size={20} />
      </button>
      <div className="logo">
        <span className="logo-mark">N</span>
        <span>N·Education</span>
      </div>
      <div className="divider" />
      <div className="page-title">{t(titleKey)}</div>

      <div className="spacer" />

      <button
        className="tz-badge"
        type="button"
        onClick={() => navigate('/profile')}
      >
        <Icon name="clock" size={14} />
        <span className="pill">{timezoneShortLabel(timezone)}</span>
        <span className="time">
          <TimezoneClock tz={timezone} format="HH:mm" />
        </span>
      </button>

      <div className="lang-toggle">
        <button
          type="button"
          className={lang === 'vi' ? 'on' : ''}
          onClick={() => {
            if (lang !== 'vi') {
              setLang('vi')
              analytics.track(ANALYTICS_EVENTS.LANG_CHANGED, { lang: 'vi' })
            }
          }}
        >
          Việt
        </button>
        <button
          type="button"
          className={lang === 'en' ? 'on' : ''}
          onClick={() => {
            if (lang !== 'en') {
              setLang('en')
              analytics.track(ANALYTICS_EVENTS.LANG_CHANGED, { lang: 'en' })
            }
          }}
        >
          EN
        </button>
      </div>

      <NotificationBell />

      <button
        type="button"
        className="user-pill"
        onClick={() => setUserMenu((v) => !v)}
      >
        <span className="avatar">{initial}</span>
        <span>{user?.name ?? '—'}</span>
      </button>

      <UserMenuPopover
        open={userMenu}
        onClose={() => setUserMenu(false)}
        onRequestLogout={() => setLogoutOpen(true)}
      />

      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </header>
  )
}

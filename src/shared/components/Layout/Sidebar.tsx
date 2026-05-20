import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Icon, type IconName } from '../Icon'
import { useT, type DictKey } from '@shared/i18n'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { DashboardData } from '@shared/types/domain'
import { cn } from '@shared/utils/cn'
import { LogoutConfirmModal } from './LogoutConfirmModal'

interface NavItem {
  to: string
  icon: IconName
  labelKey: DictKey
  badge?: number
}

export function Sidebar() {
  const t = useT()
  const navigate = useNavigate()
  const sidebarOpen = usePrefsStore((s) => s.sidebarOpen)
  const user = useAuthStore((s) => s.user)
  const [logoutOpen, setLogoutOpen] = useState(false)

  // Used to populate the "Chương trình" section + Q&A badge
  const { data: dash } = useQuery({
    queryKey: ['home', 'dashboard'],
    queryFn: () => api.get<DashboardData>('/instructor/dashboard'),
    staleTime: 60 * 1000,
  })

  const qaBadge = dash?.stats.pendingQuestionCount ?? 0

  const overview: NavItem[] = [
    { to: '/', icon: 'home', labelKey: 'page.home' },
    { to: '/calendar', icon: 'cal', labelKey: 'page.calendar' },
  ]
  const classNav: NavItem[] = [
    { to: '/qa', icon: 'msg', labelKey: 'page.qa', badge: qaBadge },
    { to: '/students', icon: 'users', labelKey: 'page.students' },
    { to: '/feedback', icon: 'star', labelKey: 'page.feedback' },
  ]

  const activePrograms = dash?.activePrograms ?? []

  const initial = (user?.name ?? 'N').slice(0, 1).toUpperCase()

  return (
    <aside className={cn('sidebar', !sidebarOpen && 'collapsed')}>
      <div className="scroll">
        <div className="section-label">{t('sidebar.overview')}</div>
        {overview.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn('nav', isActive && 'on')}
          >
            <Icon name={item.icon} className="nav-icon" />
            {t(item.labelKey)}
          </NavLink>
        ))}

        <div className="section-label">{t('sidebar.class')}</div>
        {classNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn('nav', isActive && 'on')}
          >
            <Icon name={item.icon} className="nav-icon" />
            {t(item.labelKey)}
            {item.badge && item.badge > 0 ? (
              <span className="nav-badge">{item.badge}</span>
            ) : null}
          </NavLink>
        ))}

        <div className="section-label">{t('sidebar.programs')}</div>
        {activePrograms.length === 0 ? (
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--faint)',
              padding: '6px 10px',
            }}
          >
            Chưa có lớp đang hoạt động
          </div>
        ) : (
          activePrograms.map((p) => (
            <button
              key={`${p.programId}-${p.klassId}`}
              type="button"
              className="nav-course"
              onClick={() =>
                navigate(`/courses?program=${p.programId}&klass=${p.klassId}`)
              }
            >
              <span className="dot" style={{ background: p.color }} />
              <span className="body">
                <span className="name">{p.programName}</span>
                <span className="sub">
                  {p.klassLabel} · {p.sessionsTotal} buổi
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-row">
          <div className="avatar">{initial}</div>
          <div className="body">
            <div className="name">{user?.name ?? '—'}</div>
            <div className="role">Người Dẫn Đường</div>
          </div>
        </div>
        <button
          type="button"
          className="nav"
          onClick={() => navigate('/profile')}
        >
          <Icon name="profile" className="nav-icon" />
          {t('sidebar.profile')}
        </button>
        <button
          type="button"
          className="nav logout"
          onClick={() => setLogoutOpen(true)}
        >
          <Icon name="logout" className="nav-icon" />
          {t('sidebar.logout')}
        </button>
      </div>
      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </aside>
  )
}

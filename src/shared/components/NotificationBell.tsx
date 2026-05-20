import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { api } from '@shared/config/api-client'
import type { NotificationItem, PanelKey } from '@shared/types/domain'

const PANEL_PATH: Record<PanelKey, string> = {
  home: '/',
  calendar: '/calendar',
  qa: '/qa',
  students: '/students',
  feedback: '/feedback',
  profile: '/profile',
  courses: '/courses',
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMin = Math.round((now - then) / 60000)
  if (diffMin < 1) return 'vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  const h = Math.round(diffMin / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.round(h / 24)
  return `${d} ngày trước`
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<NotificationItem[]>('/instructor/notifications', { limit: 10 }),
    staleTime: 30 * 1000,
  })

  const hasUnread = notifications.some((n) => !n.read)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  function handleClick(n: NotificationItem) {
    setOpen(false)
    if (n.targetPanel) {
      navigate(PANEL_PATH[n.targetPanel])
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-btn bell"
        type="button"
        aria-label="Thông báo"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="bell" size={18} />
        {hasUnread ? <span className="dot" /> : null}
      </button>
      {open ? (
        <div className="popover">
          <div className="popover-head">
            <div className="title">Thông báo</div>
            <button className="icon-btn" type="button" onClick={() => setOpen(false)}>
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className="popover-body">
            {notifications.length === 0 ? (
              <div className="popover-item">
                <div className="body">
                  <div className="text muted">Không có thông báo mới</div>
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`popover-item${n.read ? '' : ' unread'}`}
                  style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                  onClick={() => handleClick(n)}
                >
                  <div className="icon-box">
                    <Icon
                      name={
                        n.category === 'qa'
                          ? 'msg'
                          : n.category === 'schedule'
                          ? 'cal'
                          : n.category === 'feedback'
                          ? 'star'
                          : 'info'
                      }
                      size={14}
                    />
                  </div>
                  <div className="body">
                    <div className="cat">{n.title}</div>
                    <div className="text">{n.text}</div>
                    <div className="time">{timeAgo(n.createdAt)}</div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="popover-footer">Xem tất cả</div>
        </div>
      ) : null}
    </div>
  )
}

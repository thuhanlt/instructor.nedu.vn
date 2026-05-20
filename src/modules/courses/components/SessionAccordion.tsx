import { useEffect, useRef, useState } from 'react'
import { Tag } from '@shared/components/Tag'
import { Button } from '@shared/components/Button'
import { Icon } from '@shared/components/Icon'
import { cn } from '@shared/utils/cn'
import { parseDateStr, formatVNDay } from '@shared/utils/dates'
import { useIncidentStore } from '@modules/incident/stores/useIncidentStore'
import { SessionDetailTab } from './SessionDetailTab'
import { SessionMaterialsTab } from './SessionMaterialsTab'
import { SessionFeedbackTab } from './SessionFeedbackTab'
import type { Program, Session } from '@shared/types/domain'

type TabKey = 'detail' | 'materials' | 'feedback'

interface Props {
  program: Program
  klassLabel: string
  sessions: Session[]
  today: string // YYYY-MM-DD
  initialSessionId?: string
}

function classifySession(date: string, today: string) {
  if (date === today) return { ended: false, isToday: true, upcoming: false }
  if (date < today) return { ended: true, isToday: false, upcoming: false }
  return { ended: false, isToday: false, upcoming: true }
}

export function SessionAccordion({
  program,
  klassLabel,
  sessions,
  today,
  initialSessionId,
}: Props) {
  // Default: open today's session, or initialSessionId
  const defaultOpen =
    initialSessionId ??
    sessions.find((s) => s.date === today)?.id ??
    null
  const [openId, setOpenId] = useState<string | null>(defaultOpen)
  const [tab, setTab] = useState<TabKey>('detail')
  const openIncident = useIncidentStore((s) => s.openModal)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  // Scroll to initial session
  useEffect(() => {
    if (initialSessionId && refs.current[initialSessionId]) {
      refs.current[initialSessionId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [initialSessionId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sessions.map((s, idx) => {
        const { ended, isToday, upcoming } = classifySession(s.date, today)
        const open = openId === s.id
        const date = parseDateStr(s.date)
        const allowFeedback = ended || isToday

        return (
          <div
            key={s.id}
            ref={(el) => {
              refs.current[s.id] = el
            }}
            className="card"
            style={{ padding: 0, overflow: 'hidden' }}
          >
            <button
              type="button"
              onClick={() => {
                if (open) setOpenId(null)
                else {
                  setOpenId(s.id)
                  // default tab: detail for upcoming/today, feedback fine for ended
                  setTab(ended ? 'detail' : 'detail')
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: program.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {s.title} — {formatVNDay(date)}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {s.startTime}–{s.endTime}
                  </span>
                  <Tag variant={s.type === 'online' ? 'online' : 'offline'}>
                    {s.type === 'online' ? 'Online' : 'Offline'}
                  </Tag>
                  {ended ? <Tag variant="ended">Đã kết thúc</Tag> : null}
                  {isToday ? <Tag variant="done">Hôm nay</Tag> : null}
                  {upcoming ? <Tag variant="upcoming">Sắp diễn ra</Tag> : null}
                </div>
              </div>
              {!ended ? (
                <Button
                  variant="warn"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openIncident({
                      sessionId: s.id,
                      sessionLabel: `${s.title} — ${program.name} ${klassLabel}`,
                    })
                  }}
                >
                  Thay đổi lịch
                </Button>
              ) : null}
              <Icon
                name="chev-down"
                size={16}
                style={{
                  transition: 'transform 0.18s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {open ? (
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div className="tabs">
                  <button
                    type="button"
                    className={cn('tab', tab === 'detail' && 'on')}
                    onClick={() => setTab('detail')}
                  >
                    Chi tiết
                  </button>
                  <button
                    type="button"
                    className={cn('tab', tab === 'materials' && 'on')}
                    onClick={() => setTab('materials')}
                  >
                    Tài liệu
                    {s.materials.length > 0 ? (
                      <span
                        style={{
                          marginLeft: 6,
                          background: 'var(--tint)',
                          color: 'var(--blue)',
                          fontSize: 10,
                          borderRadius: 999,
                          padding: '0 6px',
                        }}
                      >
                        {s.materials.length}
                      </span>
                    ) : null}
                  </button>
                  {allowFeedback ? (
                    <button
                      type="button"
                      className={cn('tab', tab === 'feedback' && 'on')}
                      onClick={() => setTab('feedback')}
                    >
                      Phản hồi
                    </button>
                  ) : null}
                </div>

                {tab === 'detail' ? <SessionDetailTab session={s} /> : null}
                {tab === 'materials' ? <SessionMaterialsTab session={s} /> : null}
                {tab === 'feedback' && allowFeedback ? (
                  <SessionFeedbackTab sessionId={s.id} />
                ) : null}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

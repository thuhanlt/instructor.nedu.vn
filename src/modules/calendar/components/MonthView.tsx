import { useMemo } from 'react'
import { Card } from '@shared/components/Card'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { useSessionsRange } from '../hooks/useSessionsRange'
import { toDateStr, addDays } from '@shared/utils/dates'
import { SessionRow } from './SessionRow'

interface Props {
  cursor: Date // any date in month
  today: Date
}

const VI_DOW = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function monthGridStart(cursor: Date): Date {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const dow = first.getDay() // 0 Sun ... 6 Sat
  const diff = dow === 0 ? -6 : 1 - dow
  return addDays(first, diff)
}

export function MonthView({ cursor, today }: Props) {
  const days = useMemo(() => {
    const start = monthGridStart(cursor)
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [cursor])

  const from = toDateStr(days[0])
  const to = toDateStr(days[days.length - 1])
  const { data: sessions = [], isLoading } = useSessionsRange(from, to)

  const todayStr = toDateStr(today)
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, typeof sessions>()
    for (const s of sessions) {
      const arr = map.get(s.date) ?? []
      arr.push(s)
      map.set(s.date, arr)
    }
    return map
  }, [sessions])

  if (isLoading) return <SpinnerOverlay inline label="Đang tải tháng..." />

  const monthSessions = sessions.filter(
    (s) => new Date(s.date).getMonth() === cursor.getMonth() &&
      new Date(s.date).getFullYear() === cursor.getFullYear()
  )

  return (
    <>
      <Card tight>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
            marginBottom: 6,
          }}
        >
          {VI_DOW.map((d) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--muted)',
                padding: '6px 0',
                letterSpacing: 0.4,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
          }}
        >
          {days.map((d) => {
            const inMonth = d.getMonth() === cursor.getMonth()
            const ds = toDateStr(d)
            const isToday = ds === todayStr
            const list = sessionsByDate.get(ds) ?? []
            return (
              <div
                key={ds}
                style={{
                  minHeight: 72,
                  padding: 6,
                  borderRadius: 8,
                  background: isToday ? 'var(--tint)' : '#fff',
                  border: isToday
                    ? '1px solid var(--blue)'
                    : '1px solid var(--border)',
                  opacity: inMonth ? 1 : 0.45,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: isToday ? 700 : 600,
                    color: isToday ? 'var(--blue)' : 'var(--ink2)',
                    marginBottom: 4,
                  }}
                >
                  {d.getDate()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {list.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10.5,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background:
                            s.date < todayStr
                              ? 'var(--faint)'
                              : s.type === 'online'
                              ? 'var(--blue)'
                              : 'var(--amber)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.startTime} {s.programName.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                  {list.length > 3 ? (
                    <div style={{ fontSize: 10, color: 'var(--faint)' }}>
                      +{list.length - 3} buổi
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Buổi học trong tháng</div>
        <Card>
          {monthSessions.length === 0 ? (
            <EmptyState title="Tháng này không có buổi nào" />
          ) : (
            monthSessions.map((s) => (
              <SessionRow key={s.id} session={s} ended={s.date < todayStr} />
            ))
          )}
        </Card>
      </div>
    </>
  )
}

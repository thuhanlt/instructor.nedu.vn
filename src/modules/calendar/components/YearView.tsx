import { useMemo } from 'react'
import { Card } from '@shared/components/Card'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { useSessionsRange } from '../hooks/useSessionsRange'
import { toDateStr } from '@shared/utils/dates'

interface Props {
  year: number
  today: Date
  onMonthClick: (month: number) => void
}

const VI_MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

export function YearView({ year, today, onMonthClick }: Props) {
  const from = `${year}-01-01`
  const to = `${year}-12-31`
  const { data: sessions = [], isLoading } = useSessionsRange(from, to)
  const todayStr = toDateStr(today)

  const byMonth = useMemo(() => {
    const map = new Map<number, typeof sessions>()
    for (const s of sessions) {
      const m = new Date(s.date).getMonth()
      const arr = map.get(m) ?? []
      arr.push(s)
      map.set(m, arr)
    }
    return map
  }, [sessions])

  if (isLoading) return <SpinnerOverlay inline label="Đang tải năm..." />

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}
    >
      {VI_MONTHS.map((label, m) => {
        const list = byMonth.get(m) ?? []
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        return (
          <Card key={m} tight>
            <button
              type="button"
              onClick={() => onMonthClick(m)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{label}</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 3,
                }}
              >
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const dStr = `${year}-${(m + 1).toString().padStart(2, '0')}-${day
                    .toString()
                    .padStart(2, '0')}`
                  const hits = list.filter((s) => s.date === dStr)
                  const isToday = dStr === todayStr
                  const has = hits.length > 0
                  return (
                    <div
                      key={day}
                      title={hits.map((h) => `${h.programName} ${h.startTime}`).join(', ')}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: 3,
                        background: has
                          ? hits[0].type === 'online'
                            ? 'var(--blue)'
                            : 'var(--amber)'
                          : isToday
                          ? 'var(--tint)'
                          : 'var(--bg)',
                        border: isToday ? '1px solid var(--blue)' : '1px solid transparent',
                      }}
                    />
                  )
                })}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--muted)',
                  marginTop: 8,
                }}
              >
                {list.length} buổi dạy
              </div>
            </button>
          </Card>
        )
      })}
    </div>
  )
}

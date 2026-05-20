import { useMemo } from 'react'
import { Card } from '@shared/components/Card'
import { EmptyState } from '@shared/components/EmptyState'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { Icon } from '@shared/components/Icon'
import { useSessionsRange } from '../hooks/useSessionsRange'
import { addDays, toDateStr } from '@shared/utils/dates'
import { SessionRow } from './SessionRow'

interface Props {
  weekStart: Date
  today: Date
}

export function WeekView({ weekStart, today }: Props) {
  const fromTo = useMemo(() => {
    const from = toDateStr(weekStart)
    const to = toDateStr(addDays(weekStart, 6))
    return { from, to }
  }, [weekStart])

  const todayStr = toDateStr(today)
  const { data: sessions = [], isLoading, isError, refetch } = useSessionsRange(fromTo.from, fromTo.to)

  if (isLoading) return <SpinnerOverlay inline label="Đang tải tuần..." />
  if (isError)
    return (
      <Card>
        <EmptyState
          title="Không tải được lịch tuần"
          actionLabel="Thử lại"
          onAction={() => refetch()}
        />
      </Card>
    )

  const ended = sessions.filter((s) => s.date < todayStr)
  const upcoming = sessions.filter((s) => s.date >= todayStr)

  return (
    <>
      {ended.length > 0 ? (
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--muted)',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              paddingBottom: 4,
            }}
          >
            <Icon name="check" size={14} />
            Đã kết thúc
          </div>
          {ended.map((s) => (
            <SessionRow key={s.id} session={s} ended />
          ))}
        </Card>
      ) : null}

      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--blue)',
            fontWeight: 600,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            paddingBottom: 4,
          }}
        >
          <Icon name="clock" size={14} />
          Sắp diễn ra
        </div>
        {upcoming.length === 0 ? (
          <EmptyState title="Tuần này không có buổi sắp tới" />
        ) : (
          upcoming.map((s) => <SessionRow key={s.id} session={s} ended={false} />)
        )}
      </Card>
    </>
  )
}

import { useNavigate } from 'react-router-dom'
import { Tag } from '@shared/components/Tag'
import { Button } from '@shared/components/Button'
import { parseDateStr, dayShort } from '@shared/utils/dates'
import { useIncidentStore } from '@modules/incident/stores/useIncidentStore'
import type { RangeSession } from '../hooks/useSessionsRange'

interface Props {
  session: RangeSession
  ended: boolean
}

export function SessionRow({ session, ended }: Props) {
  const navigate = useNavigate()
  const openIncident = useIncidentStore((s) => s.openModal)
  const d = parseDateStr(session.date)

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '10px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          width: 60,
          textAlign: 'center',
          padding: '6px 8px',
          borderRadius: 8,
          background: ended ? 'var(--bg)' : 'var(--tint)',
          color: ended ? 'var(--muted)' : 'var(--blue)',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700 }}>{dayShort(d)}</div>
        <div style={{ fontSize: 19, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
          {d.getDate()}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>
          {session.startTime}–{session.endTime}{' '}
          <span style={{ fontWeight: 500 }}>
            {session.programName} {session.klassLabel} · {session.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <Tag variant={session.type === 'online' ? 'online' : 'offline'}>
            {session.type === 'online' ? 'Online' : 'Offline'}
          </Tag>
          {ended ? <Tag variant="ended">Đã kết thúc</Tag> : null}
        </div>
      </div>
      <Button
        variant="o"
        size="sm"
        onClick={() =>
          navigate(
            `/courses?program=${session.programId}&klass=${session.klassId}&session=${session.id}`
          )
        }
      >
        Chi tiết
      </Button>
      {!ended ? (
        <Button
          variant="warn"
          size="sm"
          onClick={() =>
            openIncident({
              sessionId: session.id,
              sessionLabel: `${session.title} — ${session.programName} ${session.klassLabel}`,
            })
          }
        >
          Thay đổi lịch
        </Button>
      ) : null}
    </div>
  )
}

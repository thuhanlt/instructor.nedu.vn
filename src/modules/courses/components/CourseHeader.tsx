import { StatBox } from '@shared/components/StatBox'
import { parseDateStr } from '@shared/utils/dates'
import type { ProgramKlassDetail } from '../hooks/useProgramKlassDetail'

interface Props {
  detail: ProgramKlassDetail
}

export function CourseHeader({ detail }: Props) {
  const { program, klass, stats } = detail
  const firstType = klass.sessions[0]?.type ?? 'online'
  const endDate = parseDateStr(klass.endDate)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: program.color,
            marginTop: 8,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            {program.name}{' '}
            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>· {klass.label}</span>
          </h1>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
            {firstType === 'online' ? 'Online' : 'Offline'} · {stats.studentCount} học viên
            {' · Buổi '}
            {stats.sessionsDone} / {stats.sessionsTotal}
            {' · Kết thúc '}
            {endDate.toLocaleDateString('vi')}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <StatBox
          color="blue"
          label="Số học viên"
          value={stats.studentCount}
          caption={firstType === 'online' ? 'Online' : 'Offline'}
        />
        <StatBox
          color="green"
          label="Buổi đã dạy"
          value={`${stats.sessionsDone} / ${stats.sessionsTotal}`}
          caption={
            stats.sessionsDone === stats.sessionsTotal
              ? 'Đã hoàn thành khoá'
              : 'Còn ' + (stats.sessionsTotal - stats.sessionsDone) + ' buổi'
          }
        />
        <StatBox
          color="amber"
          label="Điểm phản hồi"
          value={stats.avgFeedback === 0 ? '—' : stats.avgFeedback.toFixed(1)}
          caption={stats.avgFeedback === 0 ? 'Chưa có phản hồi' : '★★★★★'}
        />
      </div>
    </>
  )
}

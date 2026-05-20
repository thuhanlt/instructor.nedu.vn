import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import { Card } from '@shared/components/Card'
import { StatBox } from '@shared/components/StatBox'
import { Button } from '@shared/components/Button'
import { Tag } from '@shared/components/Tag'
import { Icon } from '@shared/components/Icon'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { useNavigate } from 'react-router-dom'
import { formatVNDay, parseDateStr } from '@shared/utils/dates'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { useIncidentStore } from '@modules/incident/stores/useIncidentStore'
import type { DashboardData } from '@shared/types/domain'

const TODO_ICON = {
  pending_qa: { name: 'msg', bg: '#EBF2FD', color: 'var(--blue)' },
  materials_to_download: { name: 'doc', bg: 'var(--green-bg)', color: 'var(--green)' },
  pinned_qa: { name: 'pin', bg: 'var(--amber-bg)', color: 'var(--amber)' },
  report_incident: { name: 'warn', bg: 'var(--orange-l)', color: 'var(--orange)' },
} as const

export function HomePage() {
  const navigate = useNavigate()
  const lang = usePrefsStore((s) => s.lang)
  const openIncident = useIncidentStore((s) => s.openModal)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home', 'dashboard'],
    queryFn: () => api.get<DashboardData>('/instructor/dashboard'),
  })

  if (isLoading) {
    return <SpinnerOverlay inline label="Đang tải trang chủ..." />
  }
  if (isError || !data) {
    return (
      <EmptyState
        title="Không tải được trang chủ"
        description="Vui lòng kiểm tra kết nối và thử lại."
        actionLabel="Thử lại"
        onAction={() => refetch()}
      />
    )
  }

  const greetDate = formatVNDay(parseDateStr(data.greeting.date), lang)

  return (
    <>
      {/* Greeting */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 24,
            margin: 0,
            color: 'var(--ink)',
          }}
        >
          Xin chào, {data.greeting.name}
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          {greetDate}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <StatBox
          color="blue"
          label="Chương trình đang dạy"
          value={data.stats.activeProgramCount}
          caption="Online và Offline"
          onClick={() => navigate('/courses')}
        />
        <StatBox
          color="green"
          label="Câu hỏi chờ xử lý"
          value={data.stats.pendingQuestionCount}
          caption="Lọc bởi support"
          onClick={() => navigate('/qa')}
        />
        <StatBox
          color="amber"
          label="Điểm phản hồi trung bình"
          value={data.stats.avgFeedbackScore.toFixed(1)}
          caption="★★★★★"
          onClick={() => navigate('/feedback')}
        />
      </div>

      {/* Today session */}
      {data.todaySession ? (
        <div
          style={{
            background: 'var(--navy)',
            color: '#fff',
            borderRadius: 'var(--r)',
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--sh)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, var(--blue), var(--accent))',
            }}
          />
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: 1,
              color: 'var(--accent)',
              fontWeight: 700,
            }}
          >
            BUỔI HỌC HÔM NAY
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 19,
              fontWeight: 600,
              marginTop: 6,
            }}
          >
            {data.todaySession.programName} — {data.todaySession.klassLabel} ·{' '}
            {data.todaySession.title}
          </div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.85 }}>
            {data.todaySession.startTime}–{data.todaySession.endTime} ·{' '}
            {data.todaySession.type === 'online' ? 'Online' : 'Offline'} ·{' '}
            {data.todaySession.studentCount} học viên
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 14,
            }}
          >
            <Button
              variant="p2"
              icon={<Icon name="zoom" size={16} />}
              onClick={() => window.open(data.todaySession?.zoom.url, '_blank')}
            >
              Vào phòng Zoom ngay
            </Button>
            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                lineHeight: 1.6,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <div>Mã phòng: {data.todaySession.zoom.roomId}</div>
              <div>Mật khẩu: {data.todaySession.zoom.password}</div>
            </div>
          </div>
          {data.todaySession.pinnedQuestion ? (
            <div
              style={{
                background: 'rgba(45,106,140,.25)',
                border: '1px solid var(--accent)',
                borderRadius: 8,
                padding: 12,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--accent)',
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                Trả lời đầu giờ — câu hỏi buổi trước
              </div>
              <div style={{ fontStyle: 'italic', marginTop: 6, fontSize: 13.5 }}>
                "{data.todaySession.pinnedQuestion.text}"
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 4 }}>
                — {data.todaySession.pinnedQuestion.studentName}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <Card>
          <EmptyState
            title="Hôm nay không có buổi học"
            description="Nghỉ ngơi và chuẩn bị cho buổi tiếp theo."
          />
        </Card>
      )}

      {/* Todo list */}
      {data.todoList.length > 0 ? (
        <Card>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: 'var(--muted)',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Cần làm hôm nay
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.todoList.map((todo, idx) => {
              const cfg = TODO_ICON[todo.type]
              return (
                <button
                  key={`${todo.type}-${idx}`}
                  type="button"
                  className="todo-row"
                  onClick={() => {
                    if (todo.type === 'pending_qa') navigate('/qa')
                    else if (todo.type === 'materials_to_download' && data.todaySession) {
                      navigate(
                        `/courses?program=${data.todaySession.programId}&klass=${data.todaySession.klassId}&session=${data.todaySession.id}`
                      )
                    } else if (todo.type === 'pinned_qa') navigate('/qa')
                    else if (todo.type === 'report_incident' && data.todaySession) {
                      openIncident({
                        sessionId: data.todaySession.id,
                        sessionLabel: `${data.todaySession.title} — ${data.todaySession.programName} ${data.todaySession.klassLabel}`,
                      })
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: cfg.bg,
                      color: cfg.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={cfg.name as never} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{todo.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {todo.subtitle}
                    </div>
                  </div>
                  {todo.badge ? (
                    <span
                      style={{
                        background:
                          todo.badge.color === 'red'
                            ? 'var(--red)'
                            : todo.badge.color === 'amber'
                            ? 'var(--amber-l)'
                            : 'var(--green-l)',
                        color:
                          todo.badge.color === 'red'
                            ? '#fff'
                            : todo.badge.color === 'amber'
                            ? 'var(--amber)'
                            : 'var(--green)',
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {todo.badge.text}
                    </span>
                  ) : null}
                  <Icon name="chev-right" size={16} className="muted" />
                </button>
              )
            })}
          </div>
        </Card>
      ) : null}

      {/* Active programs */}
      {data.activePrograms.length > 0 ? (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            Chương trình đang dạy
          </div>
          <Card>
            {data.activePrograms.map((p, idx) => (
              <button
                key={`${p.programId}-${p.klassId}`}
                type="button"
                onClick={() => navigate(`/courses?program=${p.programId}&klass=${p.klassId}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: p.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                    {p.programName}{' '}
                    <span className="faint" style={{ fontWeight: 500 }}>
                      · {p.klassLabel}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <Tag variant={p.type === 'online' ? 'online' : 'offline'}>
                      {p.type === 'online' ? 'Online' : 'Offline'}
                    </Tag>
                    {p.upcoming ? <Tag variant="upcoming">Sắp diễn ra</Tag> : null}
                  </div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--faint)',
                      textAlign: 'right',
                      marginBottom: 4,
                    }}
                  >
                    Buổi {p.sessionsDone} / {p.sessionsTotal}
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 999,
                      background: 'var(--bg)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${
                          p.sessionsTotal === 0
                            ? 0
                            : Math.round((p.sessionsDone / p.sessionsTotal) * 100)
                        }%`,
                        background: p.color,
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </Card>
        </div>
      ) : null}

      {/* Upcoming */}
      {data.upcomingSessions.length > 0 ? (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            Buổi học sắp tới
          </div>
          <Card>
            {data.upcomingSessions.map((s, idx) => {
              const d = parseDateStr(s.date)
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '10px 0',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      textAlign: 'center',
                      padding: '6px 8px',
                      borderRadius: 8,
                      background: 'var(--tint)',
                      color: 'var(--blue)',
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700 }}>
                      T{((d.getDay() + 6) % 7) + 2 > 7 ? 'CN' : (d.getDay() + 6) % 7 + 2}
                    </div>
                    <div style={{ fontSize: 19, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                      {d.getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {s.programName} {s.klassLabel} · {s.title}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {s.startTime}–{s.endTime}
                      </span>
                      <Tag variant={s.type === 'online' ? 'online' : 'offline'}>
                        {s.type === 'online' ? 'Online' : 'Offline'}
                      </Tag>
                    </div>
                  </div>
                  <Button
                    variant="o"
                    size="sm"
                    onClick={() =>
                      navigate(`/courses?program=${s.programId}&klass=${s.klassId}`)
                    }
                  >
                    Chi tiết
                  </Button>
                </div>
              )
            })}
          </Card>
        </div>
      ) : null}
    </>
  )
}

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import { Card } from '@shared/components/Card'
import { StatBox } from '@shared/components/StatBox'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { useFeedback, type FeedbackFilter } from '../hooks/useFeedback'
import type { Program } from '@shared/types/domain'

function stars(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

export function FeedbackPage() {
  const [filter, setFilter] = useState<FeedbackFilter>({ program: 'all', klass: 'all' })

  const { data: programs = [] } = useQuery({
    queryKey: ['programs', 'list'],
    queryFn: () => api.get<Program[]>('/instructor/programs'),
    staleTime: 5 * 60 * 1000,
  })

  const klassesForFilter = useMemo(
    () =>
      filter.program === 'all'
        ? programs.flatMap((p) => p.klasses)
        : programs.find((p) => p.id === filter.program)?.klasses ?? [],
    [programs, filter.program]
  )

  const { data, isLoading, isError, refetch } = useFeedback(filter)

  const filterLabel = useMemo(() => {
    const p = programs.find((p) => p.id === filter.program)
    const k = klassesForFilter.find((k) => k.id === filter.klass)
    if (!p && !k) return 'Tất cả chương trình'
    if (p && !k) return p.name
    if (p && k) return `${p.name} — ${k.label}`
    return 'Tất cả chương trình'
  }, [programs, klassesForFilter, filter])

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Phản hồi & Thống kê
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Phản hồi của học viên sau từng buổi học. Bạn không thể chỉnh sửa — chỉ đọc.
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
        }}
      >
        <div className="fg">
          <label className="fl">Chương trình</label>
          <select
            className="fs"
            value={filter.program}
            onChange={(e) =>
              setFilter({ program: e.target.value, klass: 'all' })
            }
          >
            <option value="all">Tất cả</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="fg">
          <label className="fl">Khoá</label>
          <select
            className="fs"
            value={filter.klass}
            onChange={(e) => setFilter({ ...filter, klass: e.target.value })}
          >
            <option value="all">Tất cả</option>
            {klassesForFilter.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <SpinnerOverlay inline label="Đang tải phản hồi..." />
      ) : isError || !data ? (
        <Card>
          <EmptyState
            title="Không tải được phản hồi"
            actionLabel="Thử lại"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
            }}
          >
            <StatBox
              color="blue"
              label="Tổng số buổi đã dạy"
              value={data.stats.sessions}
              caption={filterLabel}
            />
            <StatBox
              color="green"
              label="Tổng số học viên"
              value={data.stats.students}
              caption={filterLabel}
            />
            <StatBox
              color="amber"
              label="Điểm phản hồi trung bình"
              value={data.stats.avgScore === 0 ? '—' : data.stats.avgScore.toFixed(1)}
              caption={data.stats.scoreSub}
            />
          </div>

          <Card>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 8,
                color: 'var(--ink2)',
              }}
            >
              Phản hồi gần đây — {filterLabel}
            </div>
            {data.items.length === 0 ? (
              <EmptyState
                title="Chưa có phản hồi"
                description="Phản hồi sẽ xuất hiện sau buổi học."
              />
            ) : (
              data.items.map((f, idx) => (
                <div
                  key={f.id}
                  style={{
                    padding: '14px 0',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: 1.5 }}
                  >
                    {stars(f.stars)}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      fontSize: 13.5,
                      margin: '6px 0',
                      lineHeight: 1.55,
                    }}
                  >
                    "{f.text}"
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--faint)' }}>
                    {f.studentName} ·{' '}
                    {programs.find((p) => p.id === f.programId)?.name ?? f.programId}{' '}
                    {programs
                      .find((p) => p.id === f.programId)
                      ?.klasses.find((k) => k.id === f.klassId)?.label ?? ''}
                    {' · '}
                    {new Date(f.createdAt).toLocaleDateString('vi')}
                  </div>
                </div>
              ))
            )}
          </Card>
        </>
      )}
    </>
  )
}

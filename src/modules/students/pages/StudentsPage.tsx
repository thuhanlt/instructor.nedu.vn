import { Card } from '@shared/components/Card'
import { Tag } from '@shared/components/Tag'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { useKlassList } from '../hooks/useKlassAnalytics'

// StudentAnalyticsModal (phân tích MBTI/bát tự/cung hoàng đạo/kiểu người) là
// feature LCM-only, data từ portal learn — chưa nối, DORMANT cho golive.
// Xem TODO[LCM] trong useKlassAnalytics.ts. Trang này hiện CHỈ liệt kê lớp +
// đếm học viên (không click vào lớp).
export function StudentsPage() {
  const { data: klasses = [], isLoading, isError, refetch } = useKlassList()

  const total = klasses.reduce((s, k) => s + k.studentCount, 0)

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Học viên
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Phân tích nhóm — không hiển thị thông tin cá nhân.
        </div>
      </div>

      {isLoading ? (
        <SpinnerOverlay inline label="Đang tải lớp..." />
      ) : isError ? (
        <Card>
          <EmptyState
            title="Không tải được danh sách lớp"
            actionLabel="Thử lại"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card>
          {klasses.map((k, idx) => (
            <div
              key={k.klassId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 0',
                borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: k.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {k.programName}{' '}
                  <span style={{ color: 'var(--muted)', fontWeight: 500 }}>· {k.klassLabel}</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <Tag variant={k.type === 'online' ? 'online' : 'offline'}>
                    {k.type === 'online' ? 'Online' : 'Offline'}
                  </Tag>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 24,
                    fontWeight: 600,
                    color: k.color,
                    lineHeight: 1,
                  }}
                >
                  {k.studentCount}
                </div>
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>học viên</div>
              </div>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px dashed var(--border)',
              paddingTop: 14,
              marginTop: 4,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13 }}>Tổng cộng</div>
            <div style={{ fontWeight: 700, color: 'var(--blue)', fontSize: 18 }}>
              {total} học viên
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

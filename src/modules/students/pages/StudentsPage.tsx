import { useState } from 'react'
import { Card } from '@shared/components/Card'
import { Tag } from '@shared/components/Tag'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { Icon } from '@shared/components/Icon'
import { useKlassList, type KlassListItem } from '../hooks/useKlassAnalytics'
import { StudentAnalyticsModal } from '../components/StudentAnalyticsModal'

export function StudentsPage() {
  const [active, setActive] = useState<KlassListItem | null>(null)
  const { data: klasses = [], isLoading, isError, refetch } = useKlassList()

  const total = klasses.reduce((s, k) => s + k.studentCount, 0)

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Học viên
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Phân tích nhóm — không hiển thị thông tin cá nhân. Bấm vào một lớp để xem chi
          tiết.
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
            <button
              key={k.klassId}
              type="button"
              onClick={() => setActive(k)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 0',
                borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
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
              <Icon name="chev-right" size={16} className="muted" />
            </button>
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

      <StudentAnalyticsModal klass={active} onClose={() => setActive(null)} />
    </>
  )
}

import { Modal } from '@shared/components/Modal'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { EmptyState } from '@shared/components/EmptyState'
import { Icon } from '@shared/components/Icon'
import { AnalyticsTable } from './AnalyticsTable'
import { useKlassAnalytics, type KlassListItem } from '../hooks/useKlassAnalytics'

interface Props {
  klass: KlassListItem | null
  onClose: () => void
}

export function StudentAnalyticsModal({ klass, onClose }: Props) {
  const { data, isLoading, isError, refetch } = useKlassAnalytics(klass?.klassId ?? null)

  return (
    <Modal
      open={!!klass}
      onClose={onClose}
      size="lg"
      title={
        klass ? `Học viên — ${klass.programName} ${klass.klassLabel}` : ''
      }
    >
      {isLoading ? (
        <SpinnerOverlay inline label="Đang tải dữ liệu..." />
      ) : isError || !data ? (
        <EmptyState
          title="Không tải được dữ liệu"
          actionLabel="Thử lại"
          onAction={() => refetch()}
        />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                Tổng số học viên
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 36,
                  fontWeight: 600,
                  color: klass?.color,
                  lineHeight: 1,
                }}
              >
                {data.total}
              </div>
            </div>
            <div
              style={{
                width: 1,
                height: 50,
                background: 'var(--border)',
              }}
            />
            <div style={{ display: 'flex', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#3b82f6',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{data.male} Nam</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#ec4899',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{data.female} Nữ</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--tint)',
              border: '1px solid var(--tint-border)',
              borderRadius: 'var(--rs)',
              padding: 12,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              fontSize: 12.5,
            }}
          >
            <Icon name="info" size={16} className="muted" style={{ marginTop: 2, color: 'var(--blue)' }} />
            <div>
              <strong>Mục đích:</strong> Giúp bạn điều chỉnh ví dụ, cách giảng, và bài tập
              cho phù hợp với nhóm học viên này.{' '}
              <strong>Không phải là dữ liệu cá nhân.</strong>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 12,
            }}
          >
            <AnalyticsTable
              title="Kiểu người"
              total={data.total}
              rows={Object.entries(data.kieuNguoi).map(([label, count]) => ({
                label,
                count,
              }))}
            />
            <AnalyticsTable
              title="Bát tự (ngũ hành)"
              total={data.total}
              rows={Object.entries(data.batTu).map(([label, count]) => ({
                label,
                count,
              }))}
            />
            <AnalyticsTable
              title="MBTI"
              total={data.total}
              rows={Object.entries(data.mbti).map(([label, count]) => ({ label, count }))}
            />
            <AnalyticsTable
              title="Cung hoàng đạo"
              total={data.total}
              rows={Object.entries(data.zodiac).map(([label, count]) => ({
                label,
                count,
              }))}
            />
          </div>
        </>
      )}
    </Modal>
  )
}

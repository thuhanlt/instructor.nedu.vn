import { EmptyState } from '@shared/components/EmptyState'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { useSessionFeedback } from '../hooks/useSessionFeedback'

interface Props {
  sessionId: string
}

function stars(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

export function SessionFeedbackTab({ sessionId }: Props) {
  const { data, isLoading, isError, refetch } = useSessionFeedback(sessionId)

  if (isLoading) return <SpinnerOverlay inline label="Đang tải phản hồi..." />
  if (isError || !data)
    return (
      <EmptyState
        title="Không tải được phản hồi"
        actionLabel="Thử lại"
        onAction={() => refetch()}
      />
    )

  if (data.count === 0) {
    return (
      <EmptyState
        title="Chưa có phản hồi"
        description="Phản hồi của học viên sẽ xuất hiện ở đây sau buổi học."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          background: 'var(--tint)',
          borderRadius: 'var(--rs)',
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 30,
              fontWeight: 600,
              color: 'var(--blue)',
              lineHeight: 1,
            }}
          >
            {data.avgScore.toFixed(1)}
          </div>
          <div style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: 2 }}>
            {stars(Math.round(data.avgScore))}
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
          {data.count} phản hồi từ học viên
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.items.map((f, idx) => (
          <div
            key={f.id}
            style={{
              padding: '12px 0',
              borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
            }}
          >
            <div style={{ color: 'var(--amber)', fontSize: 12.5, letterSpacing: 1 }}>
              {stars(f.stars)}
            </div>
            <div
              style={{
                fontStyle: 'italic',
                fontSize: 13.5,
                margin: '6px 0',
              }}
            >
              "{f.text}"
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--faint)' }}>
              {f.studentName} · {new Date(f.createdAt).toLocaleDateString('vi')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

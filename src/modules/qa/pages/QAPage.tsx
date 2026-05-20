import { useMemo, useState } from 'react'
import { StatBox } from '@shared/components/StatBox'
import { Card } from '@shared/components/Card'
import { EmptyState } from '@shared/components/EmptyState'
import { SpinnerOverlay } from '@shared/components/SpinnerOverlay'
import { QAGuideBox } from '../components/QAGuideBox'
import { QAFilterRow } from '../components/QAFilterRow'
import { QACard } from '../components/QACard'
import { useQuestions, type QAFilter } from '../hooks/useQA'

export function QAPage() {
  const [filter, setFilter] = useState<QAFilter>({
    program: 'all',
    klass: 'all',
    state: 'all',
  })

  const { data: questions = [], isLoading, isError, refetch } = useQuestions(filter)

  const counts = useMemo(() => {
    return {
      pending: questions.filter((q) => q.state === 'pending').length,
      pinned: questions.filter((q) => q.state === 'pinned').length,
      answered: questions.filter((q) => q.state === 'answered').length,
    }
  }, [questions])

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, margin: 0 }}>
          Câu hỏi học viên
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Câu hỏi đã được bộ phận hỗ trợ lọc trước khi đẩy tới bạn. Có 3 cách xử lý
          mỗi câu hỏi — xem hướng dẫn bên dưới.
        </div>
      </div>

      <QAGuideBox />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <StatBox color="blue" label="Chờ xử lý" value={counts.pending} />
        <StatBox color="amber" label="Đã ghim đầu giờ" value={counts.pinned} />
        <StatBox color="green" label="Đã gửi học viên" value={counts.answered} />
      </div>

      <QAFilterRow filter={filter} onChange={setFilter} />

      {isLoading ? (
        <SpinnerOverlay inline label="Đang tải câu hỏi..." />
      ) : isError ? (
        <Card>
          <EmptyState
            title="Không tải được câu hỏi"
            actionLabel="Thử lại"
            onAction={() => refetch()}
          />
        </Card>
      ) : questions.length === 0 ? (
        <Card>
          <EmptyState
            title="Không có câu hỏi nào khớp bộ lọc"
            description="Thử đổi bộ lọc khác hoặc đợi câu hỏi mới."
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {questions.map((q) => (
            <QACard key={q.id} question={q} />
          ))}
        </div>
      )}
    </>
  )
}

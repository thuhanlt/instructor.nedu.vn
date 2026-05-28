import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { FeedbackItem } from '@shared/types/domain'

// ─────────────────────────────────────────────────────────────────────────────
// useFeedback — trang "Phản hồi & Thống kê".
// BE: GET /instructor/feedback/summary?programId=&courseRunId=
//     → FeedbackSummaryDto (snake_case). Xem openapi/instructor.yaml.
// FE: cần FeedbackResponse (camelCase) → transform trong queryFn (pattern R3).
//
// Quy ước param: filter.program/klass = 'all' → KHÔNG truyền lên BE (BE cũng
// có safety treat 'all' = undefined, nhưng FE bỏ qua sạch hơn).
// ─────────────────────────────────────────────────────────────────────────────

export interface FeedbackResponse {
  stats: {
    sessions: number
    students: number
    avgScore: number
    scoreSub: string
  }
  items: FeedbackItem[]
}

export interface FeedbackFilter {
  program: string
  klass: string
}

// Shape thật từ BE (xem openapi.yaml → FeedbackSummaryDto)
interface FeedbackSummaryDto {
  stats: {
    sessions: number
    students: number
    avg_score: number
    score_sub: string
  }
  items: Array<{
    feedback_id: string
    session_id: string
    course_run_id: string
    course_id: string
    rating: number
    comment: string
    is_anonymous: boolean
    student_name: string | null
    created_at: string
  }>
}

function toFeedbackResponse(d: FeedbackSummaryDto): FeedbackResponse {
  return {
    stats: {
      sessions: d.stats.sessions,
      students: d.stats.students,
      avgScore: d.stats.avg_score,
      scoreSub: d.stats.score_sub,
    },
    items: d.items.map(
      (i): FeedbackItem => ({
        id: i.feedback_id,
        programId: i.course_id,
        klassId: i.course_run_id,
        sessionId: i.session_id,
        stars: i.rating as 1 | 2 | 3 | 4 | 5, // BE đảm bảo 1..5 (CHECK + filter)
        text: i.comment,
        // is_anonymous: BE đã set student_name=null → hiển thị "Ẩn danh".
        studentName: i.student_name ?? 'Ẩn danh',
        createdAt: i.created_at,
      })
    ),
  }
}

export function useFeedback(filter: FeedbackFilter) {
  return useQuery({
    queryKey: ['feedback', 'summary', filter],
    queryFn: async () => {
      const query: Record<string, string> = {}
      if (filter.program !== 'all') query.programId = filter.program
      if (filter.klass !== 'all') query.courseRunId = filter.klass
      const dto = await api.get<FeedbackSummaryDto>(
        '/instructor/feedback/summary',
        query
      )
      return toFeedbackResponse(dto)
    },
  })
}

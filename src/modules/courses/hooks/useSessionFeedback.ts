import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { FeedbackItem } from '@shared/types/domain'

export interface SessionFeedbackData {
  avgScore: number
  count: number
  items: FeedbackItem[]
}

// Shape thật từ BE GET /instructor/feedback?sessionId=
interface FeedbackDto {
  feedback_id: string
  rating: number | null
  comment: string | null
  is_anonymous: boolean
  student_user_id: string | null
  student_name: string | null
  created_at: string
}

function toItem(sessionId: string, d: FeedbackDto): FeedbackItem {
  return {
    id: d.feedback_id,
    // Feedback theo session đã ở trong ngữ cảnh program/klass (URL) — tab này
    // KHÔNG điều hướng bằng 2 id này nên để ''. ⚠️ FeedbackPage (Nhóm 4) nếu cần
    // điều hướng phải populate programId/klassId (BE chưa trả ở /feedback).
    programId: '',
    klassId: '',
    sessionId,
    stars: ((d.rating ?? 0) as FeedbackItem['stars']),
    text: d.comment ?? '',
    // Ẩn danh → "Ẩn danh"; còn lại hiện tên thật từ BE (fallback "Học viên").
    studentName: d.is_anonymous ? 'Ẩn danh' : (d.student_name ?? 'Học viên'),
    createdAt: d.created_at,
  }
}

export function useSessionFeedback(sessionId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sessions', sessionId, 'feedback'],
    enabled: Boolean(sessionId) && enabled,
    queryFn: async (): Promise<SessionFeedbackData> => {
      const rows = await api.get<FeedbackDto[]>('/instructor/feedback', {
        sessionId: sessionId as string,
      })
      const items = rows.map((r) => toItem(sessionId as string, r))
      const rated = rows.filter((r) => typeof r.rating === 'number')
      const avgScore = rated.length
        ? Math.round((rated.reduce((s, r) => s + (r.rating as number), 0) / rated.length) * 10) / 10
        : 0
      return { avgScore, count: items.length, items }
    },
  })
}

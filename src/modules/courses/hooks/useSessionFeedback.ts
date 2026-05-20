import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { FeedbackItem } from '@shared/types/domain'

export interface SessionFeedbackData {
  avgScore: number
  count: number
  items: FeedbackItem[]
}

export function useSessionFeedback(sessionId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['sessions', sessionId, 'feedback'],
    enabled: Boolean(sessionId) && enabled,
    queryFn: () =>
      api.get<SessionFeedbackData>(`/instructor/sessions/${sessionId}/feedback`),
  })
}

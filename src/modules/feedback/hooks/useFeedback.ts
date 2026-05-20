import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { FeedbackItem } from '@shared/types/domain'

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

export function useFeedback(filter: FeedbackFilter) {
  return useQuery({
    queryKey: ['feedback', filter],
    queryFn: () =>
      api.get<FeedbackResponse>('/instructor/feedback', {
        program: filter.program,
        klass: filter.klass,
      }),
  })
}

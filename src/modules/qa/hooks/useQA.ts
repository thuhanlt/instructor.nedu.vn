import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Question, QuestionState } from '@shared/types/domain'

export interface EnrichedQuestion extends Question {
  programName: string
  klassLabel: string
  sessionTitle: string
  nextSessionTitle: string | null
  daysToNextSession: number
}

export interface QAFilter {
  program: string
  klass: string
  state: 'all' | QuestionState
}

export function useQuestions(filter: QAFilter) {
  return useQuery({
    queryKey: ['qa', 'questions', filter],
    queryFn: () =>
      api.get<EnrichedQuestion[]>('/instructor/questions', {
        program: filter.program,
        klass: filter.klass,
        state: filter.state,
      }),
    staleTime: 15 * 1000,
  })
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['qa', 'questions'] })
  queryClient.invalidateQueries({ queryKey: ['home', 'dashboard'] })
}

export function useReplyQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      api.post<EnrichedQuestion>(`/instructor/questions/${id}/reply`, { reply }),
    onSuccess: () => invalidateAll(qc),
  })
}

export function usePinQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.post<EnrichedQuestion>(`/instructor/questions/${id}/pin`),
    onSuccess: () => invalidateAll(qc),
  })
}

export function usePassToOps() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.post<EnrichedQuestion>(`/instructor/questions/${id}/pass-to-ops`),
    onSuccess: () => invalidateAll(qc),
  })
}

export function useAISuggestReply() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.post<{ reply: string }>(`/instructor/questions/${id}/suggest-reply`, {}),
  })
}

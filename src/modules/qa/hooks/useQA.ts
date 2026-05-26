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

// Shape thật từ BE GET /instructor/qa (xem openapi.yaml → QaQuestionDto)
interface QaQuestionDto {
  question_id: string
  session_id: string
  session_title: string
  course_id: string
  course_name: string
  course_run_id: string
  course_run_label: string
  question_text: string
  status: string
  pinned_at: string | null
  created_at: string
  answer: { answer_id: string; answer_text: string; answered_at: string } | null
}

// BE status → FE state. Status lạ (pending_review/rejected) không map → drop khỏi list
// (instructor chỉ xử lý câu hỏi đã được bộ phận hỗ trợ duyệt).
const STATE_MAP: Record<string, QuestionState> = {
  pending_answer: 'pending',
  pinned: 'pinned',
  answered: 'answered',
  returned: 'passed_to_ops',
}

function toEnrichedQuestion(d: QaQuestionDto): EnrichedQuestion | null {
  const state = STATE_MAP[d.status]
  if (!state) return null
  return {
    id: d.question_id,
    programId: d.course_id,
    klassId: d.course_run_id,
    sessionId: d.session_id,
    text: d.question_text,
    // BE chưa trả tên HV / buổi kế tiếp — để rỗng cho golive.
    studentName: '',
    createdAt: d.created_at,
    state,
    reply: d.answer?.answer_text,
    programName: d.course_name,
    klassLabel: d.course_run_label,
    sessionTitle: d.session_title,
    nextSessionTitle: null,
    daysToNextSession: 0,
  }
}

export function useQuestions(filter: QAFilter) {
  return useQuery({
    queryKey: ['qa', 'questions', filter],
    // BE /qa chỉ lọc theo status; program/klass/state lọc client-side để giữ
    // hợp đồng cũ (hook trả list đã lọc) → QAPage không phải đổi.
    queryFn: async () => {
      const rows = await api.get<QaQuestionDto[]>('/instructor/qa')
      return rows
        .map(toEnrichedQuestion)
        .filter((q): q is EnrichedQuestion => q !== null)
        .filter(
          (q) =>
            (filter.program === 'all' || q.programId === filter.program) &&
            (filter.klass === 'all' || q.klassId === filter.klass) &&
            (filter.state === 'all' || q.state === filter.state),
        )
    },
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
      api.post<{ message: string }>(`/instructor/qa/${id}/answer`, { answer_text: reply }),
    onSuccess: () => invalidateAll(qc),
  })
}

export function usePinQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.post<{ message: string }>(`/instructor/qa/${id}/pin`),
    onSuccess: () => invalidateAll(qc),
  })
}

export function usePassToOps() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.post<{ message: string }>(`/instructor/qa/${id}/return`),
    onSuccess: () => invalidateAll(qc),
  })
}

// AI suggest reply — chưa có BE, golive ẩn nút. Giữ hook lại cho khi build thật.
export function useAISuggestReply() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.post<{ reply: string }>(`/instructor/questions/${id}/suggest-reply`, {}),
  })
}

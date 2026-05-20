import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Klass, Program } from '@shared/types/domain'

export interface ProgramKlassDetail {
  program: Program
  klass: Klass
  stats: {
    studentCount: number
    sessionsDone: number
    sessionsTotal: number
    avgFeedback: number
  }
}

export function useProgramKlassDetail(programId?: string, klassId?: string) {
  return useQuery({
    queryKey: ['programs', programId, 'klasses', klassId],
    enabled: Boolean(programId && klassId),
    queryFn: () =>
      api.get<ProgramKlassDetail>(
        `/instructor/programs/${programId}/klasses/${klassId}`
      ),
  })
}

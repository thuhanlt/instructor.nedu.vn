import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { Session } from '@shared/types/domain'

export interface RangeSession extends Session {
  programName: string
  klassLabel: string
}

export function useSessionsRange(from: string, to: string) {
  return useQuery({
    queryKey: ['calendar', 'sessions', { from, to }],
    queryFn: () => api.get<RangeSession[]>('/instructor/sessions', { from, to }),
    staleTime: 30 * 1000,
  })
}

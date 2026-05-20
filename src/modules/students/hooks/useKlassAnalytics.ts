import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { ClassAnalytics, SessionType } from '@shared/types/domain'

export interface KlassListItem {
  programId: string
  programName: string
  klassId: string
  klassLabel: string
  type: SessionType
  studentCount: number
  color: string
}

export function useKlassList() {
  return useQuery({
    queryKey: ['klasses', 'list'],
    queryFn: () => api.get<KlassListItem[]>('/instructor/klasses'),
  })
}

export function useKlassAnalytics(klassId: string | null) {
  return useQuery({
    queryKey: ['klasses', klassId, 'analytics'],
    enabled: !!klassId,
    queryFn: () => api.get<ClassAnalytics>(`/instructor/klasses/${klassId}/analytics`),
  })
}

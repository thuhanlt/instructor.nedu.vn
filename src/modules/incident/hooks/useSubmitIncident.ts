import { useMutation } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { IncidentReport } from '@shared/types/domain'

export function useSubmitIncident() {
  return useMutation({
    mutationFn: (payload: IncidentReport) =>
      api.post<{ id: string; status: 'received' }>('/instructor/incidents', payload),
  })
}

import { useMutation } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'

interface Payload {
  sessionId: string
  materialId: string
  note: string
}

// BE: POST /instructor/sessions/:sessionId/material-requests  body { material_id, note }
// Instructor góp ý vận hành sửa MỘT tài liệu có sẵn (không upload file — R2 chưa có).
export function useSendMaterialRequest() {
  return useMutation({
    mutationFn: ({ sessionId, materialId, note }: Payload) =>
      api.post<{ message: string }>(
        `/instructor/sessions/${sessionId}/material-requests`,
        { material_id: materialId, note }
      ),
  })
}

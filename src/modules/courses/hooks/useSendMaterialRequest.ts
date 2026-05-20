import { useMutation } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'

interface Payload {
  sessionId: string
  note: string
  files: File[]
}

export function useSendMaterialRequest() {
  return useMutation({
    mutationFn: ({ sessionId, note, files }: Payload) => {
      const form = new FormData()
      form.set('note', note)
      for (const f of files) form.append('files', f)
      return api.postMultipart<{ id: string; status: 'received' }>(
        `/instructor/sessions/${sessionId}/material-requests`,
        form
      )
    },
  })
}

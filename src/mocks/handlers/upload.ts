import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { MOCK_INSTRUCTOR } from '@mocks/data'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

export const uploadHandlers = [
  http.post(`${apiBase}/instructor/profile/avatar`, async ({ request }) => {
    const form = await request.formData()
    const file = form.get('file')
    if (file instanceof File) {
      // Convert to a data URL so the FE can render the preview without a real CDN.
      const buf = await file.arrayBuffer()
      const b64 = btoa(
        new Uint8Array(buf).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      )
      const dataUrl = `data:${file.type || 'image/png'};base64,${b64}`
      MOCK_INSTRUCTOR.avatarUrl = dataUrl
    }
    await delay(450)
    return HttpResponse.json({
      data: { avatarUrl: MOCK_INSTRUCTOR.avatarUrl ?? '' },
    })
  }),
]

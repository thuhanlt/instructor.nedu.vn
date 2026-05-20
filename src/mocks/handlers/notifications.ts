import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { NOTIFICATIONS } from '@mocks/data'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

export const notificationHandlers = [
  http.get(`${apiBase}/instructor/notifications`, async () => {
    await delay(120)
    return HttpResponse.json({ data: NOTIFICATIONS })
  }),
  http.post(`${apiBase}/instructor/notifications/:id/read`, async ({ params }) => {
    const { id } = params as { id: string }
    const item = NOTIFICATIONS.find((n) => n.id === id)
    if (item) item.read = true
    await delay(80)
    return HttpResponse.json({ data: item })
  }),
]

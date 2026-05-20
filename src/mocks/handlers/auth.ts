import { http, HttpResponse, delay } from 'msw'
import { env } from '@shared/config/env'
import { MOCK_USER } from '@mocks/data/instructor'

const apiBase = `${env.apiUrl.replace(/\/$/, '')}/api`

export const authHandlers = [
  http.get(`${apiBase}/auth/me`, async () => {
    await delay(120)
    return HttpResponse.json({ data: MOCK_USER })
  }),
]

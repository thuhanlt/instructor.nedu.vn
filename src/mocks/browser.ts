import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth'
import { instructorHandlers } from './handlers/instructor'
import { notificationHandlers } from './handlers/notifications'
import { sessionHandlers } from './handlers/sessions'
import { incidentHandlers } from './handlers/incidents'
import { programHandlers } from './handlers/programs'
import { qaHandlers } from './handlers/qa'
import { studentHandlers } from './handlers/students'
import { feedbackHandlers } from './handlers/feedback'
import { uploadHandlers } from './handlers/upload'

export const handlers = [
  ...authHandlers,
  ...instructorHandlers,
  ...programHandlers,
  ...qaHandlers,
  ...studentHandlers,
  ...feedbackHandlers,
  ...uploadHandlers,
  ...notificationHandlers,
  ...sessionHandlers,
  ...incidentHandlers,
]

export const worker = setupWorker(...handlers)

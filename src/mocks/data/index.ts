export { MOCK_USER, MOCK_INSTRUCTOR } from './instructor'
export { PROGRAMS, KLASSES, TODAY, getProgramById, getKlassById, getSessionById } from './programs'
export { QUESTIONS } from './questions'
export { FEEDBACK } from './feedback'
export { NOTIFICATIONS } from './notifications'
export { ANALYTICS } from './analytics'

export function useToday(): Date {
  return new Date(2025, 1, 10) // TODAY constant for mock layer
}

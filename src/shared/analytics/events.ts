export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  LOGIN_SUCCESS: 'login_success',
  LOGOUT: 'logout',
  QA_REPLIED: 'qa_replied',
  QA_PINNED: 'qa_pinned',
  QA_PASSED_TO_OPS: 'qa_passed_to_ops',
  AI_SUGGEST_CLICKED: 'ai_suggest_clicked',
  MATERIAL_DOWNLOADED: 'material_downloaded',
  MATERIAL_REQUEST_SENT: 'material_request_sent',
  INCIDENT_REPORTED: 'incident_reported',
  PROFILE_SAVED: 'profile_saved',
  TIMEZONE_CHANGED: 'timezone_changed',
  LANG_CHANGED: 'lang_changed',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

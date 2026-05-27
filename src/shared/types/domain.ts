export type SessionType = 'online' | 'offline'

export interface ZoomInfo {
  roomId: string
  password: string
  url: string
}

export type MaterialFormat = 'DOCX' | 'PDF' | 'PPTX' | 'XLSX' | 'IMG' | 'OTHER'

export interface Material {
  id: string
  name: string
  format: MaterialFormat
  sizeKb: number
  url: string
}

export interface Session {
  id: string
  programId: string
  klassId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  title: string
  type: SessionType
  zoom: ZoomInfo
  materials: Material[]
}

export interface Klass {
  id: string
  programId: string
  label: string
  studentCount: number
  endDate: string
  sessions: Session[]
}

export interface Program {
  id: string
  name: string
  color: string
  klasses: Klass[]
}

export type QuestionState = 'pending' | 'pinned' | 'answered' | 'passed_to_ops'

export interface Question {
  id: string
  programId: string
  klassId: string
  sessionId: string
  text: string
  studentName: string
  createdAt: string
  state: QuestionState
  reply?: string
  pinnedForSessionId?: string
}

export interface FeedbackItem {
  id: string
  programId: string
  klassId: string
  sessionId: string
  stars: 1 | 2 | 3 | 4 | 5
  text: string
  studentName: string
  createdAt: string
}

export interface ClassAnalytics {
  klassId: string
  klassLabel: string
  total: number
  male: number
  female: number
  kieuNguoi: {
    'Người số 1': number
    'Người số 2': number
    'Người số 3': number
    'Người số 4': number
  }
  batTu: { 'THỔ': number; 'HOẢ': number; 'MỘC': number; 'THUỶ': number; 'KIM': number }
  mbti: Record<string, number>
  zodiac: Record<string, number>
}

export interface InstructorProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  joinedYear: number
  experience: string
  bio: string
  tags: string[]
  avatarUrl: string | null
}

export type IncidentReason = 'urgent_task' | 'sick' | 'family' | 'other'
export type IncidentAction = 'reschedule' | 'cancel'

export interface IncidentTimeSlot {
  date: string
  startTime: string
  endTime: string
}

export interface IncidentReport {
  id?: string
  sessionId: string
  reason: IncidentReason
  action: IncidentAction
  proposedSlots: IncidentTimeSlot[]
  note: string
  createdAt?: string
}

export type NotificationCategory = 'qa' | 'schedule' | 'feedback' | 'system'

export type PanelKey =
  | 'home'
  | 'calendar'
  | 'qa'
  | 'students'
  | 'feedback'
  | 'profile'
  | 'courses'

export interface NotificationItem {
  id: string
  category: NotificationCategory
  title: string
  text: string
  createdAt: string
  read: boolean
  targetPanel?: PanelKey
  targetParams?: Record<string, string>
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  // Tất cả role slug của user (từ /auth/me). Cổng instructor yêu cầu 'instructor'.
  roles: string[]
}

export interface TokenPair {
  access_token: string
  refresh_token: string
}

export type TodoType =
  | 'pending_qa'
  | 'materials_to_download'
  | 'pinned_qa'
  | 'report_incident'

export interface DashboardTodo {
  type: TodoType
  title: string
  subtitle: string
  badge?: { text: string; color: 'red' | 'amber' | 'green' }
  targetSessionId?: string
}

export interface DashboardSession extends Session {
  programName: string
  klassLabel: string
  studentCount: number
  pinnedQuestion?: { text: string; studentName: string }
}

export interface DashboardActiveProgram {
  programId: string
  programName: string
  color: string
  klassId: string
  klassLabel: string
  type: SessionType
  upcoming: boolean
  sessionsDone: number
  sessionsTotal: number
}

export interface DashboardUpcomingSession extends Session {
  programName: string
  klassLabel: string
}

export interface DashboardData {
  greeting: { name: string; date: string }
  stats: {
    activeProgramCount: number
    pendingQuestionCount: number
    avgFeedbackScore: number
  }
  todaySession: DashboardSession | null
  todoList: DashboardTodo[]
  activePrograms: DashboardActiveProgram[]
  upcomingSessions: DashboardUpcomingSession[]
}

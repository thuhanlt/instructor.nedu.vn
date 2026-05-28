import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { ClassAnalytics, SessionType } from '@shared/types/domain'

// ─────────────────────────────────────────────────────────────────────────────
// useKlassList — danh sách lớp của instructor (trang Học viên).
// BE: GET /instructor/klasses → KlassDto[] (snake_case).
// FE: cần KlassListItem[] (camelCase) → transform trong queryFn (pattern R3,
// mirror useSessionsRange.ts). Không đổi domain type toàn cục.
// ─────────────────────────────────────────────────────────────────────────────

export interface KlassListItem {
  programId: string
  programName: string
  klassId: string
  klassLabel: string
  type: SessionType
  studentCount: number
  color: string
}

// Shape thật từ BE GET /instructor/klasses (xem openapi.yaml → KlassDto)
interface KlassDto {
  course_run_id: string
  course_run_label: string
  program_id: string
  program_name: string
  type: 'online' | 'offline'
  student_count: number
  color: string
}

function toKlassListItem(d: KlassDto): KlassListItem {
  return {
    programId: d.program_id,
    programName: d.program_name,
    klassId: d.course_run_id,
    klassLabel: d.course_run_label,
    type: d.type === 'offline' ? 'offline' : 'online',
    studentCount: d.student_count,
    color: d.color,
  }
}

export function useKlassList() {
  return useQuery({
    queryKey: ['klasses', 'list'],
    queryFn: async () => {
      const rows = await api.get<KlassDto[]>('/instructor/klasses')
      return rows.map(toKlassListItem)
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// TODO[LCM]: useKlassAnalytics + StudentAnalyticsModal là feature CHỈ DÙNG cho
// chương trình "Là Chính Mình". Data nguồn: portal learn (cross-portal,
// CHƯA có endpoint trên nedu-backend → /instructor/klasses/:id/analytics
// hiện 404). Tạm DORMANT cho golive 2026-05-30: StudentsPage KHÔNG gọi hook
// này, modal KHÔNG render. Code giữ lại nguyên để revive sau golive.
//
// Khi enable lại:
//   1. Gate ở StudentsPage theo programSlug === 'la-chinh-minh' (hoặc programId).
//      Chương trình khác → không hiện modal/click.
//   2. Định nghĩa contract learn → instructor cho group analytics (MBTI,
//      bát tự, cung hoàng đạo, kiểu người) — agree shape với owner learn.
//   3. BE thêm route proxy (vd /instructor/klasses/:id/analytics gọi
//      LearnAnalyticsContract) HOẶC FE gọi thẳng learn API (kèm auth).
// ─────────────────────────────────────────────────────────────────────────────
export function useKlassAnalytics(klassId: string | null) {
  return useQuery({
    queryKey: ['klasses', klassId, 'analytics'],
    enabled: !!klassId,
    queryFn: () => api.get<ClassAnalytics>(`/instructor/klasses/${klassId}/analytics`),
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { InstructorProfile } from '@shared/types/domain'

// ─────────────────────────────────────────────────────────────────────────────
// useProfile — trang Hồ sơ của tôi (R3 Nhóm 5).
// BE: GET /instructor/profile → ProfileResponseDto (snake_case, xem openapi).
// FE: cần InstructorProfile (camelCase) → transform trong queryFn.
//
// FE↔BE mapping:
//   full_name        → name
//   email            → email          (read-only — auth-central identity)
//   phone            → phone          (editable — đẩy về users.phone)
//   role_title       → role           (read-only — vanhanh quản)
//   joined_at (date) → joinedYear     (read-only — derive year, vanhanh quản)
//   experience       → experience     (read-only — vanhanh quản)
//   bio              → bio            (editable)
//   expertise_tags   → tags           (editable)
//   photo_url        → avatarUrl      (R2 upload defer, FE ẩn nút)
// ─────────────────────────────────────────────────────────────────────────────

interface ProfileResponseDto {
  instructor_id: string
  full_name: string
  email: string
  phone: string | null
  role_title: string | null
  joined_at: string | null // YYYY-MM-DD
  experience: string | null
  bio: string | null
  expertise_tags: string[]
  photo_url: string | null
  created_at: string
  updated_at: string
}

function toInstructorProfile(d: ProfileResponseDto): InstructorProfile {
  // Normalize null → empty string để form làm việc với string thuần (UI hiện "—"
  // bằng cách check empty thay vì null). joinedYear: derive từ joined_at YYYY-MM-DD;
  // null hoặc parse fail → 0 (ProfilePage check >0 mới render "Tham gia từ").
  const joinedYear =
    d.joined_at && /^\d{4}-/.test(d.joined_at)
      ? Number(d.joined_at.slice(0, 4))
      : 0
  return {
    id: d.instructor_id,
    name: d.full_name,
    email: d.email,
    phone: d.phone ?? '',
    role: d.role_title ?? '',
    joinedYear,
    experience: d.experience ?? '',
    bio: d.bio ?? '',
    tags: d.expertise_tags ?? [],
    avatarUrl: d.photo_url,
  }
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const dto = await api.get<ProfileResponseDto>('/instructor/profile')
      return toInstructorProfile(dto)
    },
  })
}

// PATCH payload chỉ gồm 3 field instructor tự edit (R3 Nhóm 5). Các field còn
// lại (name/email/role/joinedYear/experience) do vanhanh quản — gửi lên cũng bị
// BE bỏ qua, nhưng FE chủ động strip để đỡ traffic.
interface UpdateProfilePayload {
  phone?: string | null
  bio?: string | null
  expertise_tags?: string[]
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (draft: Partial<InstructorProfile>) => {
      const payload: UpdateProfilePayload = {}
      if (draft.phone !== undefined) {
        // Empty string → null để BE biết user muốn xoá số
        payload.phone = draft.phone === '' ? null : draft.phone
      }
      if (draft.bio !== undefined) payload.bio = draft.bio
      if (draft.tags !== undefined) payload.expertise_tags = draft.tags
      const dto = await api.patch<ProfileResponseDto>(
        '/instructor/profile',
        payload
      )
      return toInstructorProfile(dto)
    },
    onSuccess: (data) => {
      qc.setQueryData(['profile'], data)
      qc.invalidateQueries({ queryKey: ['home', 'dashboard'] })
    },
  })
}

// useUploadAvatar — DORMANT cho golive (R3 Nhóm 5).
// R2 upload chưa build, FE ẩn nút avatar. Code giữ lại để revive sau golive.
// TODO[R2-UPLOAD]: khi R2 sẵn sàng → bật lại nút trong ProfilePage + AvatarUpload.
export function useUploadAvatar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.set('file', file)
      return api.postMultipart<{ avatarUrl: string }>(
        '/instructor/profile/avatar',
        form
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

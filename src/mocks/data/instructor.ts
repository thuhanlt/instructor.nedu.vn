import type { AuthUser, InstructorProfile } from '@shared/types/domain'

export const MOCK_USER: AuthUser = {
  id: 'mock-instructor-1',
  email: 'nhile@guide.vn',
  name: 'NhiLe',
  roles: ['instructor'],
}

// FE-shape (camelCase) — giữ cho upload handler + dashboard greeting backward compat.
export const MOCK_INSTRUCTOR: InstructorProfile = {
  id: 'mock-instructor-1',
  name: 'NhiLe',
  email: 'nhile@guide.vn',
  phone: '+84 090 000 0000',
  role: 'Người Dẫn Đường Chính',
  joinedYear: 2024,
  experience: '5 năm',
  bio: 'Người Dẫn Đường với 5 năm kinh nghiệm trong lĩnh vực Mindfulness và NLP.',
  tags: ['Mindfulness', 'NLP'],
  avatarUrl: null,
}

// BE-shape (snake_case) — match ProfileResponseDto sau R3 Nhóm 5 restructure.
// Profile handler trả constant này; useProfile hook transform về FE camelCase.
// Sửa ở đây = thay đổi data Profile page hiển thị khi MSW mock = ON.
export const MOCK_INSTRUCTOR_PROFILE_DTO = {
  instructor_id: 'mock-instructor-1',
  full_name: 'NhiLe',
  email: 'nhile@guide.vn',
  phone: '+84 090 000 0000' as string | null,
  role_title: 'Người Dẫn Đường Chính' as string | null,
  joined_at: '2024-03-15' as string | null, // ISO YYYY-MM-DD
  experience: '8 năm' as string | null,
  bio: 'Người Dẫn Đường với 8 năm kinh nghiệm trong lĩnh vực Mindfulness và NLP.' as string | null,
  expertise_tags: ['Mindfulness', 'NLP'] as string[],
  photo_url: null as string | null,
  created_at: '2024-03-15T00:00:00.000Z',
  updated_at: '2026-05-27T03:00:00.000Z',
}

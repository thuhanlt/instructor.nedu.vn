import type { AuthUser, InstructorProfile } from '@shared/types/domain'

export const MOCK_USER: AuthUser = {
  id: 'mock-instructor-1',
  email: 'nhile@guide.vn',
  name: 'NhiLe',
  roles: ['instructor'],
}

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

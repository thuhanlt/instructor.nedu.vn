import type { FeedbackItem } from '@shared/types/domain'

export const FEEDBACK: FeedbackItem[] = [
  {
    id: 'f1',
    programId: 'mind',
    klassId: 'mind-k1',
    sessionId: 'mind-k1-s2',
    stars: 5,
    text: 'Buổi học rất hữu ích, cô giảng dễ hiểu và truyền cảm hứng.',
    studentName: 'Ẩn danh',
    createdAt: '2025-02-05T22:10:00+07:00',
  },
  {
    id: 'f2',
    programId: 'mind',
    klassId: 'mind-k1',
    sessionId: 'mind-k1-s2',
    stars: 5,
    text: 'Em rất thích phần ví dụ thực tế, có thể áp dụng ngay.',
    studentName: 'Ẩn danh',
    createdAt: '2025-02-05T22:32:00+07:00',
  },
  {
    id: 'f3',
    programId: 'mind',
    klassId: 'mind-k1',
    sessionId: 'mind-k1-s1',
    stars: 4,
    text: 'Mong buổi sau có thêm bài tập nhóm để chia sẻ với bạn học.',
    studentName: 'Ẩn danh',
    createdAt: '2025-02-02T21:48:00+07:00',
  },
  {
    id: 'f4',
    programId: 'brand',
    klassId: 'brand-k1',
    sessionId: 'brand-k1-s1',
    stars: 5,
    text: 'Cô có giọng kể chuyện rất gần gũi, em theo dõi không thấy chán.',
    studentName: 'Ẩn danh',
    createdAt: '2025-02-04T20:55:00+07:00',
  },
]

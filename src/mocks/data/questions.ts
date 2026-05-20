import type { Question } from '@shared/types/domain'

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    programId: 'mind',
    klassId: 'mind-k1',
    sessionId: 'mind-k1-s2',
    text: 'Em đang stuck giữa hai lựa chọn nghề nghiệp — làm sao biết đâu là giá trị thật của mình?',
    studentName: 'Thảo Nguyên',
    createdAt: '2025-02-08T20:11:00+07:00',
    state: 'pending',
  },
  {
    id: 'q2',
    programId: 'mind',
    klassId: 'mind-k1',
    sessionId: 'mind-k1-s2',
    text: 'Em vẫn chưa rõ cách áp dụng bảng giá trị cốt lõi vào quyết định hằng ngày. Có ví dụ cụ thể không ạ?',
    studentName: 'Ẩn danh',
    createdAt: '2025-02-09T09:42:00+07:00',
    state: 'pinned',
    pinnedForSessionId: 'mind-k1-s3',
  },
  {
    id: 'q3',
    programId: 'mind',
    klassId: 'mind-k1',
    sessionId: 'mind-k1-s1',
    text: 'Cuộc sống có ý nghĩa thật sự là gì ạ?',
    studentName: 'Minh Tâm',
    createdAt: '2025-02-02T21:05:00+07:00',
    state: 'answered',
    reply:
      'Cảm ơn bạn đã đặt câu hỏi. Ý nghĩa cuộc sống trong khung mình đang học là hành trình bạn tự thiết kế cuộc đời theo giá trị cốt lõi của riêng mình — không phải bản sao của ai. Buổi sau mình sẽ làm bài tập map giá trị, bạn để ý nhé.',
  },
  {
    id: 'q4',
    programId: 'brand',
    klassId: 'brand-k1',
    sessionId: 'brand-k1-s1',
    text: 'Em nên bắt đầu xây personal brand từ đâu nếu không có nhiều thời gian?',
    studentName: 'Hữu Phước',
    createdAt: '2025-02-04T08:20:00+07:00',
    state: 'pending',
  },
]

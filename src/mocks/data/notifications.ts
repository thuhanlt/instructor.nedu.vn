import type { NotificationItem } from '@shared/types/domain'

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'qa',
    title: 'Câu hỏi mới',
    text: '2 câu hỏi mới từ học viên Cuộc Sống Của Bạn K1.',
    createdAt: '2025-02-10T07:30:00+07:00',
    read: false,
    targetPanel: 'qa',
  },
  {
    id: 'n2',
    category: 'schedule',
    title: 'Lịch dạy',
    text: 'Buổi 3 — Cuộc Sống Của Bạn K1 bắt đầu lúc 9:00 hôm nay.',
    createdAt: '2025-02-10T06:45:00+07:00',
    read: false,
    targetPanel: 'home',
  },
]

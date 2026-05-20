import type { Klass, Program, Session } from '@shared/types/domain'

export const TODAY = new Date(2025, 1, 10) // Feb 10, 2025 — frozen for mock layer

const zoom = (roomId: string, password: string) => ({
  roomId,
  password,
  url: `https://zoom.us/j/${roomId.replace(/\s/g, '')}`,
})

const docMat = (id: string, name: string, sizeKb = 1800) => ({
  id,
  name,
  format: 'DOCX' as const,
  sizeKb,
  url: `/mock-files/${id}.docx`,
})

const pdfMat = (id: string, name: string, sizeKb = 2400) => ({
  id,
  name,
  format: 'PDF' as const,
  sizeKb,
  url: `/mock-files/${id}.pdf`,
})

function mkSession(
  base: Partial<Session> & {
    id: string
    programId: string
    klassId: string
    date: string
    title: string
  }
): Session {
  return {
    startTime: '09:00',
    endTime: '10:30',
    type: 'online',
    zoom: zoom('123 456 789', 'csb2026'),
    materials: [docMat(`${base.id}-doc`, `Kịch bản ${base.title}`)],
    ...base,
  } as Session
}

// ============================================================
// Cuộc Sống Của Bạn — K1 (active, đang dạy)
// ============================================================
const MIND_K1_SESSIONS: Session[] = [
  mkSession({
    id: 'mind-k1-s1',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-02-01',
    title: 'Buổi 1',
  }),
  mkSession({
    id: 'mind-k1-s2',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-02-05',
    title: 'Buổi 2',
  }),
  mkSession({
    id: 'mind-k1-s3',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-02-10', // TODAY
    title: 'Buổi 3',
    materials: [
      docMat('mind-k1-s3-doc', 'Kịch bản Buổi 3 — Giá trị cốt lõi'),
      pdfMat('mind-k1-s3-slide', 'Slide Buổi 3'),
    ],
  }),
  mkSession({
    id: 'mind-k1-s4',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-02-14',
    title: 'Buổi 4',
  }),
  mkSession({
    id: 'mind-k1-s5',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-02-19',
    title: 'Buổi 5',
  }),
  mkSession({
    id: 'mind-k1-s6',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-02-24',
    title: 'Buổi 6',
  }),
  mkSession({
    id: 'mind-k1-s7',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-03-01',
    title: 'Buổi 7',
  }),
  mkSession({
    id: 'mind-k1-s8',
    programId: 'mind',
    klassId: 'mind-k1',
    date: '2025-03-08',
    title: 'Buổi 8 (kết thúc)',
  }),
]

const MIND_K2_SESSIONS: Session[] = [
  mkSession({
    id: 'mind-k2-s1',
    programId: 'mind',
    klassId: 'mind-k2',
    date: '2025-03-15',
    title: 'Buổi 1',
  }),
  mkSession({
    id: 'mind-k2-s2',
    programId: 'mind',
    klassId: 'mind-k2',
    date: '2025-03-20',
    title: 'Buổi 2',
  }),
]

const BRAND_K1_SESSIONS: Session[] = [
  mkSession({
    id: 'brand-k1-s1',
    programId: 'brand',
    klassId: 'brand-k1',
    date: '2025-02-03',
    title: 'Buổi 1',
    startTime: '19:00',
    endTime: '20:30',
  }),
  mkSession({
    id: 'brand-k1-s2',
    programId: 'brand',
    klassId: 'brand-k1',
    date: '2025-02-08',
    title: 'Buổi 2',
    type: 'offline',
    startTime: '19:00',
    endTime: '20:30',
  }),
  mkSession({
    id: 'brand-k1-s3',
    programId: 'brand',
    klassId: 'brand-k1',
    date: '2025-02-12',
    title: 'Buổi 3',
    startTime: '19:00',
    endTime: '20:30',
  }),
  mkSession({
    id: 'brand-k1-s4',
    programId: 'brand',
    klassId: 'brand-k1',
    date: '2025-02-18',
    title: 'Buổi 4',
    type: 'offline',
    startTime: '19:00',
    endTime: '20:30',
  }),
]

const CHINH_K1_SESSIONS: Session[] = [
  mkSession({
    id: 'chinh-k1-s1',
    programId: 'chinh',
    klassId: 'chinh-k1',
    date: '2025-02-02',
    title: 'Buổi 1',
  }),
  mkSession({
    id: 'chinh-k1-s2',
    programId: 'chinh',
    klassId: 'chinh-k1',
    date: '2025-02-09',
    title: 'Buổi 2',
  }),
  mkSession({
    id: 'chinh-k1-s3',
    programId: 'chinh',
    klassId: 'chinh-k1',
    date: '2025-02-16',
    title: 'Buổi 3',
  }),
]

const CHINH_K2_SESSIONS: Session[] = [
  mkSession({
    id: 'chinh-k2-s1',
    programId: 'chinh',
    klassId: 'chinh-k2',
    date: '2025-02-13',
    title: 'Buổi 1',
    startTime: '20:00',
    endTime: '21:30',
  }),
  mkSession({
    id: 'chinh-k2-s2',
    programId: 'chinh',
    klassId: 'chinh-k2',
    date: '2025-02-20',
    title: 'Buổi 2',
    startTime: '20:00',
    endTime: '21:30',
  }),
]

const SMVH_K1_SESSIONS: Session[] = [
  mkSession({
    id: 'smvh-k1-s1',
    programId: 'smvh',
    klassId: 'smvh-k1',
    date: '2025-03-22',
    title: 'Buổi 1',
    type: 'offline',
  }),
]

export const KLASSES: Klass[] = [
  {
    id: 'mind-k1',
    programId: 'mind',
    label: 'Khoá 1',
    studentCount: 20,
    endDate: '2025-03-08',
    sessions: MIND_K1_SESSIONS,
  },
  {
    id: 'mind-k2',
    programId: 'mind',
    label: 'Khoá 2',
    studentCount: 18,
    endDate: '2025-04-30',
    sessions: MIND_K2_SESSIONS,
  },
  {
    id: 'brand-k1',
    programId: 'brand',
    label: 'Khoá 1',
    studentCount: 16,
    endDate: '2025-03-12',
    sessions: BRAND_K1_SESSIONS,
  },
  {
    id: 'chinh-k1',
    programId: 'chinh',
    label: 'Khoá 1',
    studentCount: 22,
    endDate: '2025-03-10',
    sessions: CHINH_K1_SESSIONS,
  },
  {
    id: 'chinh-k2',
    programId: 'chinh',
    label: 'Khoá 2',
    studentCount: 24,
    endDate: '2025-04-02',
    sessions: CHINH_K2_SESSIONS,
  },
  {
    id: 'smvh-k1',
    programId: 'smvh',
    label: 'Khoá 1',
    studentCount: 12,
    endDate: '2025-05-15',
    sessions: SMVH_K1_SESSIONS,
  },
]

export const PROGRAMS: Program[] = [
  {
    id: 'mind',
    name: 'Cuộc Sống Của Bạn',
    color: '#2D6A8C',
    klasses: KLASSES.filter((k) => k.programId === 'mind'),
  },
  {
    id: 'brand',
    name: 'Thương Hiệu Của Bạn',
    color: '#0891B2',
    klasses: KLASSES.filter((k) => k.programId === 'brand'),
  },
  {
    id: 'chinh',
    name: 'Là Chính Mình',
    color: '#B45309',
    klasses: KLASSES.filter((k) => k.programId === 'chinh'),
  },
  {
    id: 'smvh',
    name: 'Sức Mạnh Vô Hạn',
    color: '#15803D',
    klasses: KLASSES.filter((k) => k.programId === 'smvh'),
  },
]

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id)
}

export function getKlassById(id: string): Klass | undefined {
  return KLASSES.find((k) => k.id === id)
}

export function getSessionById(id: string): Session | undefined {
  for (const k of KLASSES) {
    const s = k.sessions.find((s) => s.id === id)
    if (s) return s
  }
  return undefined
}

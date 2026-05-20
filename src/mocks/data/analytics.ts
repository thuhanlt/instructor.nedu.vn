import type { ClassAnalytics } from '@shared/types/domain'

function pick<T extends string>(map: Record<T, number>): Record<T, number> {
  return map
}

export const ANALYTICS: Record<string, ClassAnalytics> = {
  'mind-k1': {
    klassId: 'mind-k1',
    klassLabel: 'Cuộc Sống K1',
    total: 20,
    male: 12,
    female: 8,
    kieuNguoi: pick({
      'Người số 1': 6,
      'Người số 2': 5,
      'Người số 3': 4,
      'Người số 4': 5,
    }),
    batTu: { 'THỔ': 5, 'HOẢ': 4, 'MỘC': 5, 'THUỶ': 3, 'KIM': 3 },
    mbti: { INFJ: 4, ENFP: 3, INFP: 3, INTJ: 3, ISTJ: 3, Khác: 4 },
    zodiac: { 'Bạch Dương': 4, 'Kim Ngưu': 3, 'Song Tử': 3, 'Cự Giải': 3, 'Sư Tử': 3, Khác: 4 },
  },
  'mind-k2': {
    klassId: 'mind-k2',
    klassLabel: 'Cuộc Sống K2',
    total: 18,
    male: 10,
    female: 8,
    kieuNguoi: pick({
      'Người số 1': 5,
      'Người số 2': 4,
      'Người số 3': 5,
      'Người số 4': 4,
    }),
    batTu: { 'THỔ': 4, 'HOẢ': 3, 'MỘC': 4, 'THUỶ': 4, 'KIM': 3 },
    mbti: { ENFP: 4, INFJ: 3, ISTJ: 3, ENTP: 3, INFP: 2, Khác: 3 },
    zodiac: { 'Xử Nữ': 4, 'Thiên Bình': 3, 'Bọ Cạp': 3, 'Nhân Mã': 3, 'Ma Kết': 2, Khác: 3 },
  },
  'brand-k1': {
    klassId: 'brand-k1',
    klassLabel: 'Thương Hiệu K1',
    total: 16,
    male: 7,
    female: 9,
    kieuNguoi: pick({
      'Người số 1': 4,
      'Người số 2': 5,
      'Người số 3': 3,
      'Người số 4': 4,
    }),
    batTu: { 'THỔ': 3, 'HOẢ': 4, 'MỘC': 3, 'THUỶ': 3, 'KIM': 3 },
    mbti: { ENFP: 4, ENFJ: 3, INFJ: 3, INTJ: 2, ENTP: 2, Khác: 2 },
    zodiac: { 'Bạch Dương': 3, 'Sư Tử': 3, 'Nhân Mã': 3, 'Song Ngư': 3, 'Kim Ngưu': 2, Khác: 2 },
  },
  'chinh-k1': {
    klassId: 'chinh-k1',
    klassLabel: 'Là Chính Mình K1',
    total: 22,
    male: 11,
    female: 11,
    kieuNguoi: pick({
      'Người số 1': 6,
      'Người số 2': 5,
      'Người số 3': 5,
      'Người số 4': 6,
    }),
    batTu: { 'THỔ': 5, 'HOẢ': 5, 'MỘC': 4, 'THUỶ': 4, 'KIM': 4 },
    mbti: { INFJ: 5, ENFP: 4, INFP: 4, ISTJ: 3, INTJ: 3, Khác: 3 },
    zodiac: { 'Cự Giải': 4, 'Song Tử': 4, 'Xử Nữ': 4, 'Bọ Cạp': 4, 'Kim Ngưu': 3, Khác: 3 },
  },
  'chinh-k2': {
    klassId: 'chinh-k2',
    klassLabel: 'Là Chính Mình K2',
    total: 24,
    male: 13,
    female: 11,
    kieuNguoi: pick({
      'Người số 1': 7,
      'Người số 2': 6,
      'Người số 3': 5,
      'Người số 4': 6,
    }),
    batTu: { 'THỔ': 5, 'HOẢ': 5, 'MỘC': 5, 'THUỶ': 5, 'KIM': 4 },
    mbti: { ENFP: 5, INFJ: 4, INTJ: 4, ISTJ: 4, ENTP: 3, Khác: 4 },
    zodiac: { 'Thiên Bình': 5, 'Sư Tử': 4, 'Nhân Mã': 4, 'Bảo Bình': 4, 'Ma Kết': 3, Khác: 4 },
  },
  'smvh-k1': {
    klassId: 'smvh-k1',
    klassLabel: 'Sức Mạnh Vô Hạn K1',
    total: 12,
    male: 5,
    female: 7,
    kieuNguoi: pick({
      'Người số 1': 3,
      'Người số 2': 3,
      'Người số 3': 3,
      'Người số 4': 3,
    }),
    batTu: { 'THỔ': 3, 'HOẢ': 3, 'MỘC': 2, 'THUỶ': 2, 'KIM': 2 },
    mbti: { INFJ: 3, ENFJ: 2, INTJ: 2, ISFJ: 2, ENFP: 2, Khác: 1 },
    zodiac: { 'Bọ Cạp': 3, 'Xử Nữ': 2, 'Kim Ngưu': 2, 'Cự Giải': 2, 'Song Ngư': 2, Khác: 1 },
  },
}

# nedu-instructor

Portal Người Dẫn Đường · N·Education · NhiLe Holdings
Domain: `instructor.nedu.vn`

---

## Bắt đầu (cho non-tech)

1. Cài Node 20+ (https://nodejs.org). Sau khi cài, mở terminal kiểm tra:
   ```
   node --version
   npm --version
   ```
2. Cài dependencies (chạy 1 lần khi clone repo về):
   ```
   npm install
   ```
3. Generate Mock Service Worker (chạy 1 lần):
   ```
   npm run msw:init
   ```
4. Chạy dev server:
   ```
   npm run dev
   ```
   Mở trình duyệt: http://localhost:5173 — đăng nhập với Google (ở chế độ mock sẽ tự pass qua, không cần Google thật).

5. Build production:
   ```
   npm run build
   ```
   Output ở `dist/`.

---

## Cấu trúc thư mục

```
src/
├── main.tsx               # Bootstrap: enableMocking → analytics → render
├── App.tsx                # Auth initialize wrapper
├── index.css              # Tailwind v4 + design tokens
├── routes/                # AppRouter + ProtectedRoute
├── modules/
│   ├── auth/              # Login, AuthCallback, useAuthStore
│   ├── home/              # Trang chủ (Sprint 1-2)
│   ├── calendar/          # Lịch dạy (Sprint 2)
│   ├── courses/           # Chương trình & buổi học (Sprint 3)
│   ├── qa/                # Câu hỏi học viên + AI (Sprint 4)
│   ├── students/          # Phân tích học viên (Sprint 5)
│   ├── feedback/          # Phản hồi (Sprint 5)
│   └── profile/           # Hồ sơ + Múi giờ (Sprint 6)
├── shared/
│   ├── config/            # env, api-client, auth-central-client, token-storage, query-client
│   ├── types/             # API + domain types
│   ├── stores/            # usePrefsStore (timezone, lang, sidebar)
│   ├── i18n/              # vi + en + useT()
│   ├── timezone/          # 16 tz options + TimezoneClock
│   ├── analytics/         # GA4 + Clarity, gated by hostname
│   ├── components/        # Reusable: Button, Tag, Card, StatBox, Modal, Toast, Icon, ...
│   ├── components/Layout/ # AppLayout + Topbar + Sidebar + UserMenu
│   └── utils/             # dates, cn, notify
└── mocks/
    ├── browser.ts         # MSW worker
    ├── init.ts            # enableMocking()
    ├── handlers/          # /auth, /instructor, /notifications, ...
    └── data/              # seed data (programs, sessions, questions, ...)
```

---

## Environment variables

Copy `.env.example` → `.env` rồi chỉnh:

| Variable                  | Mục đích                                     |
| ------------------------- | -------------------------------------------- |
| `VITE_API_URL`            | Backend api.nedu.vn — `http://localhost:8080` khi dev |
| `VITE_AUTH_CENTRAL_URL`   | NLH auth-central — `http://localhost:4000` khi dev    |
| `VITE_ENABLE_MOCKING`     | `true` (vibe code) / `false` (real BE)       |
| `VITE_GA4_ID`             | Google Analytics — để trống khi dev          |
| `VITE_CLARITY_ID`         | Microsoft Clarity — để trống khi dev         |

---

## Sprints (theo CLAUDE.md)

- ✅ **Sprint 1** — Foundation + Auth + Layout + skeleton pages
- ✅ **Sprint 2** — Home Dashboard + Calendar (Tuần/Tháng/Năm) + IncidentModal
- ✅ **Sprint 3** — Programs / Sessions / Materials (Zoom dark block + download tracking + request form)
- ✅ **Sprint 4** — Q&A + AI Suggest ⭐ (4 actions, deadline hint, AI gradient button)
- ✅ **Sprint 5** — Students Analytics (4 hệ analytics modal) + Feedback panel với filter
- ✅ **Sprint 6** — Profile (avatar upload, edit mode, 16 timezone selector) + Analytics events wire

**39 user stories live trên mock layer.** Đổi `VITE_ENABLE_MOCKING=false` + trỏ `VITE_API_URL` sang BE thật để chạy với api.nedu.vn.

---

## Deploy

- **Vercel** (preview, mock=true): connect repo, set 5 env vars, auto-build.
- **Cloudflare Workers** (production, mock=false):
  ```
  npm run build
  npm run deploy:cf
  ```

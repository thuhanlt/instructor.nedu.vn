import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@shared/config/query-client'
import { AppLayout } from '@shared/components/Layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { ToastContainer } from '@shared/components/Toast'
import { RouteTracker } from '@shared/analytics'

import { LoginPage } from '@modules/auth/pages/LoginPage'
import { AuthCallbackPage } from '@modules/auth/pages/AuthCallbackPage'
import { HomePage } from '@modules/home/pages/HomePage'
import { CalendarPage } from '@modules/calendar/pages/CalendarPage'
import { CoursesPage } from '@modules/courses/pages/CoursesPage'
import { QAPage } from '@modules/qa/pages/QAPage'
import { StudentsPage } from '@modules/students/pages/StudentsPage'
import { FeedbackPage } from '@modules/feedback/pages/FeedbackPage'
import { ProfilePage } from '@modules/profile/pages/ProfilePage'

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteTracker />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth-callback" element={<AuthCallbackPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/qa" element={<QAPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

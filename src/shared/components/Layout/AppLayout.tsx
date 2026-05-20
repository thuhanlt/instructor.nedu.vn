import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { usePrefsStore } from '@shared/stores/usePrefsStore'
import { cn } from '@shared/utils/cn'
import { IncidentModal } from '@modules/incident/components/IncidentModal'

export function AppLayout() {
  const sidebarOpen = usePrefsStore((s) => s.sidebarOpen)
  return (
    <>
      <Topbar />
      <Sidebar />
      <main className={cn('main', !sidebarOpen && 'full')}>
        <div className="panel">
          <Outlet />
        </div>
      </main>
      <IncidentModal />
    </>
  )
}

import { useEffect } from 'react'
import { AppRouter } from './routes'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'

export function App() {
  const initialize = useAuthStore((s) => s.initialize)
  useEffect(() => {
    initialize()
  }, [initialize])
  return <AppRouter />
}

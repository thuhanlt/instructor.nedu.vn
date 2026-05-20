import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackGA4PageView } from './ga4'

export function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    trackGA4PageView(location.pathname + location.search, document.title)
  }, [location.pathname, location.search])
  return null
}

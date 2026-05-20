import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { enableMocking } from './mocks/init'
import { analytics } from './shared/analytics'
import { env } from './shared/config/env'
import './index.css'

async function bootstrap() {
  // eslint-disable-next-line no-console
  console.info(
    `[nedu-instructor] mode=${env.enableMocking ? 'MOCK' : 'LIVE'} · api=${env.apiUrl}`
  )
  await enableMocking()
  analytics.init()

  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap()

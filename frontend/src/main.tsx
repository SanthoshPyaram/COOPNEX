import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Auto-reload on deployment chunk update to avoid 404 on stale bundle references
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error detected, reloading page to fetch latest assets...', event)
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


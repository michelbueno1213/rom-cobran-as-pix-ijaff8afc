/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

import pb from './lib/pocketbase/client'

// Exporta a instância do PocketBase para a janela global
// permitindo que a SPA em JS puro (public/*.js) consuma o mesmo client autenticado
;(window as unknown as { pb: typeof pb; VITE_POCKETBASE_URL: string }).pb = pb
;(window as unknown as { pb: typeof pb; VITE_POCKETBASE_URL: string }).VITE_POCKETBASE_URL =
  import.meta.env.VITE_POCKETBASE_URL

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(<App />)
}

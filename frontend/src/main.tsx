import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FileShareApp from './all.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FileShareApp />
  </StrictMode>,
)

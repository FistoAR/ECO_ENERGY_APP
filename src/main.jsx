import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ExpoProvider } from './context/ExpoContext';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpoProvider>
      <App />
    </ExpoProvider>
  </StrictMode>,
)

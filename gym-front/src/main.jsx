import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { CookiesProvider } from 'react-cookie';
import App from './app/app.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  // </StrictMode>
)

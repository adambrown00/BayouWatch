import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App'
import 'leaflet/dist/leaflet.css';


const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

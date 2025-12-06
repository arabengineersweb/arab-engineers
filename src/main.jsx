import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init({ 
  duration: 500, 
  once: true,
  offset: 50,
  delay: 0,
  easing: 'ease-out'
})

createRoot(document.getElementById('root')).render(<App />)

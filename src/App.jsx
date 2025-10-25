import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import { getStyle } from './utils/styleManager'

export default function App(){
  const [lang, setLang] = useState('en')

  // apply rtl when Arabic selected
  useEffect(()=>{
    if(lang === 'ar'){
      document.documentElement.lang = 'ar'
      document.documentElement.dir = 'rtl'
      document.body.classList.add('rtl')
    } else {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
      document.body.classList.remove('rtl')
    }
  },[lang])

  // apply primary color as css var
  useEffect(()=>{
    const primary = getStyle('primaryColor')
    document.documentElement.style.setProperty('--primary', primary)
  },[])

  return (
    <Router>
      <div className="min-h-screen">
        <Header lang={lang} setLang={setLang} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage lang={lang} />} />
            <Route path="/about" element={<AboutPage lang={lang} />} />
            <Route path="/services" element={<ServicesPage lang={lang} />} />
            <Route path="/contact" element={<ContactPage lang={lang} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

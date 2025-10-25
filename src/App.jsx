import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import { getStyle } from './utils/styleManager'
import { adminUtils } from './utils/adminUtils'

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

  // Apply admin styles if available
  useEffect(() => {
    const adminStyles = adminUtils.loadStyles()
    if (adminStyles) {
      adminUtils.applyStyles(adminStyles)
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Admin route with unique, hard-to-guess URL */}
          <Route path="/admin-panel-7x9k2m8n" element={<AdminPage />} />
          
          {/* Public routes */}
          <Route path="/" element={
            <>
              <Header lang={lang} setLang={setLang} />
              <main>
                <HomePage lang={lang} />
              </main>
                  <Footer lang={lang} />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header lang={lang} setLang={setLang} />
              <main>
                <AboutPage lang={lang} />
              </main>
                  <Footer lang={lang} />
            </>
          } />
          <Route path="/services" element={
            <>
              <Header lang={lang} setLang={setLang} />
              <main>
                <ServicesPage lang={lang} />
              </main>
                  <Footer lang={lang} />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Header lang={lang} setLang={setLang} />
              <main>
                <ContactPage lang={lang} />
              </main>
                  <Footer lang={lang} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

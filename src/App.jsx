import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import PWASPage from './pages/PWASPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'
import { getStyle } from './utils/styleManager'
import { adminUtils } from './utils/adminUtils'

export default function App(){
  // Load language from localStorage or default to 'en'
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('preferredLanguage')
    return savedLang || 'en'
  })

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', lang)
  }, [lang])

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

  // Apply colors as CSS vars - set defaults first, then admin overrides
  useEffect(()=>{
    // Always set default colors from styles.json first
    const defaultPrimary = '#d66020'
    const defaultSecondary = '#f8eae1'
    const defaultAccent = '#a84a18'
    const defaultTertiary = '#f78c63'
    
    // Check for admin overrides
    let adminStyles = adminUtils.loadStyles()
    
    // If admin styles exist but use old colors, clear them
    if (adminStyles && (adminStyles.primaryColor === '#004C97' || adminStyles.primaryColor === '#c428f0')) {
      localStorage.removeItem('adminStyles')
      adminStyles = null
    }
    
    if (adminStyles && adminStyles.primaryColor) {
      // Use admin styles if they exist
      adminUtils.applyStyles(adminStyles)
    } else {
      // Use the default colors and sizes from styles.json
      const primary = getStyle('primaryColor')
      const secondary = getStyle('secondaryColor')
      const accent = getStyle('accentColor') || defaultAccent
      const tertiary = getStyle('tertiaryColor') || defaultTertiary
      const headingSize = getStyle('headingSize') || '2.5'
      const textSize = getStyle('textSize') || '1.1'
      const fontFamily = getStyle('fontFamily') || 'Poppins, sans-serif'
      
      document.documentElement.style.setProperty('--primary', primary)
      document.documentElement.style.setProperty('--secondary', secondary)
      document.documentElement.style.setProperty('--accent', accent)
      document.documentElement.style.setProperty('--tertiary', tertiary)
      document.documentElement.style.setProperty('--heading-size', `${headingSize}rem`)
      document.documentElement.style.setProperty('--text-size', `${textSize}rem`)
      document.documentElement.style.setProperty('--font-family', fontFamily)
    }
    
    // Always ensure heading-size and text-size are set even if admin styles don't include them
    if (!document.documentElement.style.getPropertyValue('--heading-size')) {
      const headingSize = getStyle('headingSize') || '2.5'
      document.documentElement.style.setProperty('--heading-size', `${headingSize}rem`)
    }
    if (!document.documentElement.style.getPropertyValue('--text-size')) {
      const textSize = getStyle('textSize') || '1.1'
      document.documentElement.style.setProperty('--text-size', `${textSize}rem`)
    }
  },[])

  return (
    <Router>
      <div className="min-h-screen overflow-x-hidden w-full">
        <Routes>
          {/* Admin route with unique, hard-to-guess URL */}
          <Route path="/admin-panel-arabengksa2024" element={<AdminPage />} />
          
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
          <Route path="/pwas" element={
            <>
              <Header lang={lang} setLang={setLang} />
              <main>
                <PWASPage lang={lang} />
              </main>
                  <Footer lang={lang} />
            </>
          } />
          
          {/* 404 Error Page - Catch all unmatched routes */}
          <Route path="*" element={
            <>
              <Header lang={lang} setLang={setLang} />
              <main>
                <NotFoundPage lang={lang} setLang={setLang} />
              </main>
              <Footer lang={lang} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

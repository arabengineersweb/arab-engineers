import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
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
    <div className="min-h-screen">
      <Header lang={lang} setLang={setLang} />
      <main className="pt-16">
        <Hero lang={lang} />
        <About lang={lang} />
        <ContactForm lang={lang} />
      </main>
      <Footer />
    </div>
  )
}

import React, { useState, useEffect } from 'react'

export default function Header({lang, setLang}){
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <header className={`w-full py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="logo" className="h-12 w-12 object-contain"/>
        <div className="text-xl font-bold" style={{color: '#004C97'}}>Arab Engineers</div>
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className="hover:text-blue-700 transition-colors duration-300 font-medium"
          >
            {lang === 'en' ? 'Home' : 'الرئيسية'}
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="hover:text-blue-700 transition-colors duration-300 font-medium"
          >
            {lang === 'en' ? 'About' : 'من نحن'}
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="hover:text-blue-700 transition-colors duration-300 font-medium"
          >
            {lang === 'en' ? 'Contact' : 'تواصل معنا'}
          </button>
        </nav>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} 
            className="px-4 py-2 border-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={{
              borderColor: '#004C97',
              color: '#004C97',
              backgroundColor: lang === 'ar' ? '#004C97' : 'transparent',
              color: lang === 'ar' ? 'white' : '#004C97'
            }}
          >
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

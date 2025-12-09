import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function Header({lang, setLang}){
  const primary = getStyle('primaryColor')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('header')) {
        setIsMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleNavClick = () => {
    scrollToTop()
    closeMobileMenu()
  }
  
  return (
    <header className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-md shadow-lg' 
        : 'shadow-sm'
    }`} style={{
      backgroundColor: isScrolled ? 'rgba(248, 234, 225, 0.95)' : '#f8eae1'
    }}>
      {/* Mobile layout - original (logo left, menu right) */}
      <div className="md:hidden flex items-center justify-between w-full">
        <Link to="/" onClick={scrollToTop} className="flex items-center">
          <img 
            src={getContent('images', lang)?.logo || '/assets/logo.png'} 
            alt="logo" 
            className="h-20 w-20 object-contain"
          />
        </Link>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} 
            className="px-4 py-2 border-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={{
              borderColor: primary,
              backgroundColor: lang === 'ar' ? primary : 'transparent',
              color: lang === 'ar' ? 'white' : primary
            }}
          >
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            style={{color: primary}}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Desktop layout - centered */}
      <div className="hidden md:flex max-w-7xl mx-auto items-center justify-center relative">
        {/* Language button - positioned on the right */}
        <div className="absolute right-0 flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} 
            className="px-4 py-2 border-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={{
              borderColor: primary,
              backgroundColor: lang === 'ar' ? primary : 'transparent',
              color: lang === 'ar' ? 'white' : primary
            }}
          >
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
        </div>
        
        {/* Centered logo and navigation - side by side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center">
            <img 
              src={getContent('images', lang)?.logo || '/assets/logo.png'} 
              alt="logo" 
              className="h-20 w-20 object-contain"
            />
          </Link>
          
          {/* Navigation */}
          <nav className="flex gap-8">
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="transition-colors duration-300 font-medium"
              style={{
                color: isActive('/') ? primary : '#a84a18'
              }}
              onMouseEnter={(e) => e.target.style.color = primary}
              onMouseLeave={(e) => e.target.style.color = isActive('/') ? primary : '#a84a18'}
            >
              {lang === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <Link 
              to="/about" 
              onClick={scrollToTop}
              className="transition-colors duration-300 font-medium"
              style={{
                color: isActive('/about') ? primary : '#a84a18'
              }}
              onMouseEnter={(e) => e.target.style.color = primary}
              onMouseLeave={(e) => e.target.style.color = isActive('/about') ? primary : '#a84a18'}
            >
              {lang === 'en' ? 'About' : 'من نحن'}
            </Link>
            <Link 
              to="/pwas" 
              onClick={scrollToTop}
              className="transition-colors duration-300 font-medium"
              style={{
                color: isActive('/pwas') ? primary : '#a84a18'
              }}
              onMouseEnter={(e) => e.target.style.color = primary}
              onMouseLeave={(e) => e.target.style.color = isActive('/pwas') ? primary : '#a84a18'}
            >
              {lang === 'en' ? 'PWAS' : 'PWAS'}
            </Link>
            <Link 
              to="/services" 
              onClick={scrollToTop}
              className="transition-colors duration-300 font-medium"
              style={{
                color: isActive('/services') ? primary : '#a84a18'
              }}
              onMouseEnter={(e) => e.target.style.color = primary}
              onMouseLeave={(e) => e.target.style.color = isActive('/services') ? primary : '#a84a18'}
            >
              {lang === 'en' ? 'Services' : 'الخدمات'}
            </Link>
            <Link 
              to="/contact" 
              onClick={scrollToTop}
              className="transition-colors duration-300 font-medium"
              style={{
                color: isActive('/contact') ? primary : '#a84a18'
              }}
              onMouseEnter={(e) => e.target.style.color = primary}
              onMouseLeave={(e) => e.target.style.color = isActive('/contact') ? primary : '#a84a18'}
            >
              {lang === 'en' ? 'Contact' : 'تواصل معنا'}
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 shadow-lg border-t border-gray-200 z-40" style={{backgroundColor: '#f8eae1'}}>
          <nav className="px-6 py-4 space-y-4">
            <Link 
              to="/" 
              onClick={handleNavClick}
              className="block py-2 transition-colors duration-300 font-medium"
              style={{
                color: isActive('/') ? primary : '#a84a18'
              }}
            >
              {lang === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <Link 
              to="/about" 
              onClick={handleNavClick}
              className="block py-2 transition-colors duration-300 font-medium"
              style={{
                color: isActive('/about') ? primary : '#a84a18'
              }}
            >
              {lang === 'en' ? 'About' : 'من نحن'}
            </Link>
            <Link 
              to="/pwas" 
              onClick={handleNavClick}
              className="block py-2 transition-colors duration-300 font-medium"
              style={{
                color: isActive('/pwas') ? primary : '#a84a18'
              }}
            >
              {lang === 'en' ? 'PWAS' : 'PWAS'}
            </Link>
            <Link 
              to="/services" 
              onClick={handleNavClick}
              className="block py-2 transition-colors duration-300 font-medium"
              style={{
                color: isActive('/services') ? primary : '#a84a18'
              }}
            >
              {lang === 'en' ? 'Services' : 'الخدمات'}
            </Link>
            <Link 
              to="/contact" 
              onClick={handleNavClick}
              className="block py-2 transition-colors duration-300 font-medium"
              style={{
                color: isActive('/contact') ? primary : '#a84a18'
              }}
            >
              {lang === 'en' ? 'Contact' : 'تواصل معنا'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

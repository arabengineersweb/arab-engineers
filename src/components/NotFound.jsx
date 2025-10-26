import React from 'react'
import { Link } from 'react-router-dom'
import { getStyle } from '../utils/styleManager'
import { getContent } from '../utils/contentLoader'

export default function NotFound({ lang = 'en' }) {
  const primary = getStyle('primaryColor')
  
  const notFoundContent = {
    en: {
      title: "404",
      heading: "Page Not Found",
      description: "Sorry, the page you are looking for doesn't exist or has been moved.",
      buttonText: "Go Back Home",
      altText: "404 Error Illustration"
    },
    ar: {
      title: "404",
      heading: "الصفحة غير موجودة",
      description: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      buttonText: "العودة إلى الرئيسية",
      altText: "رسم توضيحي لخطأ 404"
    }
  }
  
  const content = notFoundContent[lang] || notFoundContent.en
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8" data-aos="fade-up">
          <div className="relative inline-block">
            {/* Large 404 text with gradient */}
            <h1 
              className="text-9xl font-bold opacity-20"
              style={{ 
                background: `linear-gradient(135deg, ${primary}, #0066cc)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {content.title}
            </h1>
            
            {/* Error illustration icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{backgroundColor: primary}}>
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {content.heading}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{backgroundColor: primary}}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {content.buttonText}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 hover:bg-gray-50"
            style={{borderColor: primary, color: primary}}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {lang === 'en' ? 'Go Back' : 'العودة'}
          </button>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200" data-aos="fade-up" data-aos-delay="300">
          <p className="text-gray-600 mb-4">
            {lang === 'en' ? 'Or you can try:' : 'أو يمكنك تجربة:'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="text-sm font-medium transition-colors duration-300"
              style={{color: primary}}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {lang === 'en' ? 'About Us' : 'من نحن'}
            </Link>
            <Link
              to="/services"
              className="text-sm font-medium transition-colors duration-300"
              style={{color: primary}}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {lang === 'en' ? 'Services' : 'الخدمات'}
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors duration-300"
              style={{color: primary}}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {lang === 'en' ? 'Contact' : 'تواصل معنا'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


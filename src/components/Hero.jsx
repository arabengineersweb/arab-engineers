import React from 'react'
import { Link } from 'react-router-dom'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function Hero({lang}){
  const hero = getContent('hero', lang)
  const primary = getStyle('primaryColor')
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div data-aos="fade-up" className="space-y-8">
            <div className="space-y-6">
              <h1 className="font-bold leading-tight" style={{
                color: primary, 
                // Slightly larger on mobile with a higher minimum,
                // while keeping the same max desktop size
                fontSize: 'clamp(2.3rem, 6vw, var(--heading-size))'
              }}>
                {hero.title}
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-lg" style={{fontSize: 'var(--text-size)'}}>
                {hero.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/services"
                className="px-8 py-4 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-center" 
                style={{backgroundColor: primary}}
              >
                {hero.buttonText}
              </Link>
              <Link 
                to="/about"
                className="px-8 py-4 border-2 font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 text-center" 
                style={{borderColor: primary, color: primary}}
              >
                {lang === 'en' ? 'Learn More' : 'اعرف المزيد'}
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: primary}}>4</div>
                <div className="text-sm text-gray-600">{lang === 'en' ? 'PWAS Systems' : 'أنظمة PWAS'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: primary}}>40m</div>
                <div className="text-sm text-gray-600">{lang === 'en' ? 'Detection Range' : 'نطاق الكشف'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: primary}}>360°</div>
                <div className="text-sm text-gray-600">{lang === 'en' ? 'Coverage' : 'التغطية'}</div>
              </div>
            </div>
          </div>
          
          {/* Right image */}
          <div data-aos="fade-left" className="relative">
            <div className="relative z-10">
              <img 
                src={hero.image} 
                alt="hero" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: primary}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{lang === 'en' ? 'Safety First' : 'السلامة أولاً'}</div>
                    <div className="text-sm text-gray-600">{lang === 'en' ? 'Industrial Excellence' : 'التميز الصناعي'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

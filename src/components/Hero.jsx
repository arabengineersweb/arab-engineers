import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'
import { adminUtils } from '../utils/adminUtils'

export default function Hero({lang}){
  const hero = getContent('hero', lang)
  const primary = getStyle('primaryColor')
  
  // Get additional hero images from admin content
  const adminContent = adminUtils.loadContent()
  const heroBackground = adminContent?.[lang]?.hero?.backgroundImage || '/assets/hero-background.jpg'
  const engineerHero = adminContent?.[lang]?.hero?.engineerImage || '/assets/engineer-hero.jpg'

  // Preload hero images for faster loading
  useEffect(() => {
    // Preload background image
    const bgImg = new Image()
    bgImg.src = heroBackground
    
    // Preload main hero image
    if (hero.image && !hero.image.startsWith('data:')) {
      const img = new Image()
      img.src = hero.image
    }
    
    // Preload small hexagon image
    const smallImg = new Image()
    smallImg.src = engineerHero
  }, [hero.image, heroBackground, engineerHero])
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{
      backgroundColor: '#f8eae1',
      backgroundImage: `url(${heroBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Background color overlay with low transparency */}
      <div className="absolute inset-0" style={{
        backgroundColor: 'rgba(248, 234, 225, 0.85)'
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-12 z-10">
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
          
          {/* Right image with hexagon design */}
          <div data-aos="fade-left" data-aos-duration="400" className="relative">
            <div className="relative z-10">
              {/* Main hexagon container */}
              <div className="relative" style={{width: '100%', paddingTop: '90%'}}>
                {/* Hexagon shape */}
                <div 
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    background: `linear-gradient(135deg, ${primary} 0%, #a84a18 100%)`,
                    boxShadow: '0 20px 60px rgba(214, 96, 32, 0.3)',
                    transform: 'rotate(-5deg)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <div className="absolute inset-2" style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    backgroundImage: `url(${hero.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '0',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}></div>
                </div>
                
                {/* Smaller hexagon overlay */}
                <div 
                  className="absolute"
                  style={{
                    bottom: '-10%',
                    right: '-5%',
                    width: '40%',
                    paddingTop: '40%',
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    background: `linear-gradient(135deg, #f78c63 0%, #e67a50 100%)`,
                    boxShadow: '0 15px 40px rgba(247, 140, 99, 0.4)',
                    transform: 'rotate(15deg)',
                    zIndex: 5,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <div className="absolute inset-2" style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    backgroundImage: `url(${engineerHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '0',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}></div>
                </div>
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg z-20" style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: `linear-gradient(135deg, ${primary}, #653686)`
                  }}>
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

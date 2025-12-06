import React, { useEffect } from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'
import { adminUtils } from '../utils/adminUtils'

export default function About({lang}){
  const about = getContent('about', lang)
  const primary = getStyle('primaryColor')
  
  const features = about.features || []
  const stats = about.stats || []
  
  // Get additional about images from admin content
  const adminContent = adminUtils.loadContent()
  const engineerAbout = adminContent?.[lang]?.about?.engineerImage || '/assets/engineer-about.jpg'
  
  // Preload about images for faster loading
  useEffect(() => {
    // Preload main about image
    if (about.image && !about.image.startsWith('data:')) {
      const img = new Image()
      img.src = about.image
    }
    
    // Preload small hexagon image
    const smallImg = new Image()
    smallImg.src = engineerAbout
  }, [about.image, engineerAbout])
  
  return (
    <section id="about" className="pt-32 py-12 relative overflow-hidden" style={{backgroundColor: 'white'}}>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="font-bold mb-6" style={{
            color: primary, 
            // Increase minimum size so headings are larger on small screens
            fontSize: 'clamp(2rem, 5vw, var(--heading-size))'
          }}>
            {about.title}
          </h2>
          <p className="text-gray-600 max-w-5xl mx-auto leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
            {about.text}
          </p>
        </div>
        
        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-12">
          {/* Image with hexagon design */}
          <div data-aos="fade-right" className="relative">
            <div className="relative z-10">
              {/* Main hexagon container */}
              <div className="relative" style={{width: '100%', paddingTop: '85%'}}>
                {/* Large hexagon */}
                <div 
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    background: `linear-gradient(135deg, ${primary} 0%, #a84a18 100%)`,
                    boxShadow: '0 20px 60px rgba(214, 96, 32, 0.3)',
                    transform: 'rotate(5deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <div className="absolute inset-2" style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    backgroundImage: `url(${about.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '0'
                  }}></div>
                </div>
                
                {/* Smaller hexagon overlay */}
                <div 
                  className="absolute"
                  style={{
                    bottom: '-8%',
                    left: '-5%',
                    width: '35%',
                    paddingTop: '35%',
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    background: `linear-gradient(135deg, #f78c63 0%, #e67a50 100%)`,
                    boxShadow: '0 15px 40px rgba(247, 140, 99, 0.4)',
                    transform: 'rotate(-20deg)',
                    zIndex: 5
                  }}
                >
                  <div className="absolute inset-2" style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    backgroundImage: `url(${engineerAbout})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '0'
                  }}></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{
                  background: `linear-gradient(135deg, ${primary}, #a84a18)`,
                  opacity: 0.2,
                  filter: 'blur(25px)',
                  zIndex: 1
                }}></div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg z-20" style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{
                    background: `linear-gradient(135deg, ${primary}, #a84a18)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>15+</div>
                  <div className="text-sm text-gray-600">{lang === 'en' ? 'Years' : 'سنة'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div data-aos="fade-left" className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--secondary)'}}>
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12" data-aos="fade-up">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl" style={{backgroundColor: 'var(--secondary)'}}>
              <div className="text-4xl font-bold mb-2" style={{color: primary}}>{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

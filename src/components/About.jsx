import React from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function About({lang}){
  const about = getContent('about', lang)
  const primary = getStyle('primaryColor')
  
  const features = [
    {
      icon: "🏗️",
      title: lang === 'en' ? 'Construction Excellence' : 'التميز في البناء',
      description: lang === 'en' ? 'Delivering high-quality construction projects with precision and innovation.' : 'نقدم مشاريع بناء عالية الجودة بدقة وابتكار.'
    },
    {
      icon: "⚡",
      title: lang === 'en' ? 'Innovation Focus' : 'التركيز على الابتكار',
      description: lang === 'en' ? 'Leveraging cutting-edge technology and modern engineering solutions.' : 'نستفيد من أحدث التقنيات والحلول الهندسية الحديثة.'
    },
    {
      icon: "🤝",
      title: lang === 'en' ? 'Client Partnership' : 'شراكة العملاء',
      description: lang === 'en' ? 'Building lasting relationships through transparent communication and trust.' : 'نبني علاقات دائمة من خلال التواصل الشفاف والثقة.'
    }
  ]
  
  return (
    <section id="about" className="pt-32 py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5" style={{backgroundColor: primary}}></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-5" style={{backgroundColor: primary}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{color: primary}}>
            {about.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {about.text}
          </p>
        </div>
        
        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <div data-aos="fade-right" className="relative">
            <div className="relative z-10">
              <img 
                src={about.image} 
                alt="about" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{color: primary}}>15+</div>
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
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl bg-gray-50 group-hover:scale-110 transition-transform duration-300">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8" data-aos="fade-up">
          <div className="text-center p-6 bg-gray-50 rounded-2xl">
            <div className="text-4xl font-bold mb-2" style={{color: primary}}>500+</div>
            <div className="text-gray-600">{lang === 'en' ? 'Projects Completed' : 'مشروع مكتمل'}</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-2xl">
            <div className="text-4xl font-bold mb-2" style={{color: primary}}>50+</div>
            <div className="text-gray-600">{lang === 'en' ? 'Expert Engineers' : 'مهندس خبير'}</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-2xl">
            <div className="text-4xl font-bold mb-2" style={{color: primary}}>100%</div>
            <div className="text-gray-600">{lang === 'en' ? 'Client Satisfaction' : 'رضا العملاء'}</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-2xl">
            <div className="text-4xl font-bold mb-2" style={{color: primary}}>24/7</div>
            <div className="text-gray-600">{lang === 'en' ? 'Support' : 'دعم'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

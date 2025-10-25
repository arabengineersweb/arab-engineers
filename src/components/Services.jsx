import React, { useState } from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function Services({lang}){
  const servicesData = getContent('services', lang)
  const primary = getStyle('primaryColor')
  const [selectedService, setSelectedService] = useState(null)
  
  return (
    <section id="services" className="pt-32 py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-5" style={{backgroundColor: primary}}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-5" style={{backgroundColor: primary}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="font-bold mb-6" style={{color: primary, fontSize: 'var(--heading-size)'}}>
            {servicesData.title}
          </h2>
          <p className="text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
            {servicesData.subtitle}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto" style={{fontSize: 'var(--text-size)'}}>
            {servicesData.description}
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {servicesData.services.map((service, index) => (
            <div 
              key={service.id}
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              {/* Features list */}
              <div className={`transition-all duration-300 ${selectedService === service.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-gray-800">
                    {lang === 'en' ? 'Key Features:' : 'الميزات الرئيسية:'}
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: primary}}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Click indicator */}
              <div className="text-center mt-4">
                <span className="text-sm text-gray-400">
                  {selectedService === service.id 
                    ? (lang === 'en' ? 'Click to collapse' : 'انقر للطي')
                    : (lang === 'en' ? 'Click to expand' : 'انقر للتوسيع')
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Process Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl" data-aos="fade-up">
          <div className="text-center mb-12">
            <h3 className="font-bold mb-4" style={{color: primary, fontSize: 'var(--heading-size)'}}>
              {servicesData.process?.title || (lang === 'en' ? 'Our Process' : 'عملنا')}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{fontSize: 'var(--text-size)'}}>
              {servicesData.process?.description || (lang === 'en' 
                ? 'We follow a systematic approach to deliver exceptional results for every project.'
                : 'نتبع نهجًا منهجيًا لتقديم نتائج استثنائية لكل مشروع.'
              )}
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {(servicesData.process?.steps || [
              {
                step: lang === 'en' ? '01' : '٠١',
                title: lang === 'en' ? 'Consultation' : 'الاستشارة',
                description: lang === 'en' ? 'Understanding your needs and project requirements' : 'فهم احتياجاتك ومتطلبات المشروع'
              },
              {
                step: lang === 'en' ? '02' : '٠٢',
                title: lang === 'en' ? 'Planning' : 'التخطيط',
                description: lang === 'en' ? 'Detailed project planning and strategy development' : 'التخطيط التفصيلي للمشروع وتطوير الاستراتيجية'
              },
              {
                step: lang === 'en' ? '03' : '٠٣',
                title: lang === 'en' ? 'Execution' : 'التنفيذ',
                description: lang === 'en' ? 'Professional implementation with quality control' : 'التنفيذ المهني مع ضبط الجودة'
              },
              {
                step: lang === 'en' ? '04' : '٠٤',
                title: lang === 'en' ? 'Support' : 'الدعم',
                description: lang === 'en' ? 'Ongoing maintenance and support services' : 'خدمات الصيانة والدعم المستمر'
              }
            ]).map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{backgroundColor: primary}}>
                  {process.step}
                </div>
                <h4 className="font-semibold mb-2 text-gray-900" style={{fontSize: 'var(--text-size)'}}>
                  {process.title}
                </h4>
                <p className="text-gray-600 leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16" data-aos="fade-up">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{color: primary}}>
              {lang === 'en' ? 'Ready to Start Your Project?' : 'مستعد لبدء مشروعك؟'}
            </h3>
            <p className="text-gray-600 mb-6">
              {lang === 'en' 
                ? 'Contact us today for a free consultation and let us bring your vision to life.'
                : 'تواصل معنا اليوم للحصول على استشارة مجانية ودعنا نحقق رؤيتك.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                style={{backgroundColor: primary}}
              >
                {lang === 'en' ? 'Get Free Consultation' : 'احصل على استشارة مجانية'}
              </button>
              <button 
                className="px-8 py-4 border-2 font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105" 
                style={{borderColor: primary, color: primary}}
              >
                {lang === 'en' ? 'View Our Portfolio' : 'عرض أعمالنا'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

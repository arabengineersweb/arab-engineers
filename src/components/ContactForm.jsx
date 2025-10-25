import React, { useState } from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function ContactForm({lang}){
  const contact = getContent('contact', lang)
  const primary = getStyle('primaryColor')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  return (
    <section id="contact" className="pt-32 py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-5" style={{backgroundColor: primary}}></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-5" style={{backgroundColor: primary}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6" style={{color: primary}}>
            {contact.title}
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {contact.description}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div data-aos="fade-right" className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="text-2xl font-semibold mb-6" style={{color: primary}}>
                {lang === 'en' ? 'Get in Touch' : 'تواصل معنا'}
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: primary}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">{lang === 'en' ? 'Email' : 'البريد الإلكتروني'}</h5>
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: primary}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">{lang === 'en' ? 'Phone' : 'الهاتف'}</h5>
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: primary}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">{lang === 'en' ? 'Address' : 'العنوان'}</h5>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="text-xl font-semibold mb-4" style={{color: primary}}>
                {lang === 'en' ? 'Why Choose Us?' : 'لماذا تختارنا؟'}
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: primary}}></div>
                  {lang === 'en' ? '15+ years of engineering excellence' : '15+ سنة من التميز الهندسي'}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: primary}}></div>
                  {lang === 'en' ? 'Cutting-edge technology solutions' : 'حلول تقنية متطورة'}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: primary}}></div>
                  {lang === 'en' ? '24/7 customer support' : 'دعم العملاء على مدار الساعة'}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: primary}}></div>
                  {lang === 'en' ? '100% client satisfaction guarantee' : 'ضمان رضا العملاء 100%'}
                </li>
              </ul>
            </div>
          </div>
          
          {/* Contact Form */}
          <div data-aos="fade-left" className="bg-white p-8 rounded-2xl shadow-lg">
            <h4 className="text-2xl font-semibold mb-6" style={{color: primary}}>
              {lang === 'en' ? 'Send us a Message' : 'أرسل لنا رسالة'}
            </h4>
            
            <form action="https://formspree.io/f/your-form-id" method="POST" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'en' ? 'Your Name' : 'اسمك'}
                </label>
                <input 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={lang === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'} 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address" 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'en' ? 'Message' : 'الرسالة'}
                </label>
                <textarea 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={lang === 'en' ? 'Tell us about your project or inquiry...' : 'أخبرنا عن مشروعك أو استفسارك...'} 
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none" 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full px-8 py-4 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                style={{backgroundColor: primary}}
              >
                {lang === 'en' ? 'Send Message' : 'إرسال الرسالة'}
              </button>
          </form>
          </div>
        </div>
      </div>
    </section>
  )
}

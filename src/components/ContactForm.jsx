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
    <section id="contact" className="pt-32 py-12 relative overflow-hidden" style={{backgroundColor: 'white'}}>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-up">
          <h3 className="font-bold mb-6" style={{
            color: primary, 
            // Larger on mobile via increased minimum
            fontSize: 'clamp(2rem, 5vw, var(--heading-size))'
          }}>
            {contact.title}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
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
                    <h5 className="font-semibold text-gray-900 mb-1" style={{fontSize: 'var(--text-size)'}}>{lang === 'en' ? 'Email' : 'البريد الإلكتروني'}</h5>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                      style={{fontSize: 'var(--text-size)'}}
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: primary}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1" style={{fontSize: 'var(--text-size)'}}>{lang === 'en' ? 'Phone' : 'الهاتف'}</h5>
                    <a 
                      href={`tel:${contact.phone?.replace(/\s/g, '') || ''}`}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                      style={{fontSize: 'var(--text-size)'}}
                    >
                      {contact.phone}
                    </a>
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
                    <h5 className="font-semibold text-gray-900 mb-1" style={{fontSize: 'var(--text-size)'}}>{lang === 'en' ? 'Address' : 'العنوان'}</h5>
                    <p className="text-gray-600" style={{fontSize: 'var(--text-size)'}}>{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="text-xl font-semibold mb-4" style={{color: primary}}>
                {contact.whyChooseUs?.title || (lang === 'en' ? 'Why Choose Us?' : 'لماذا تختارنا؟')}
              </h4>
              <ul className="space-y-3 text-gray-600" style={{fontSize: 'var(--text-size)'}}>
                {(contact.whyChooseUs?.benefits || []).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: primary}}></div>
                    {benefit}
                  </li>
                ))}
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
                  className="w-full p-4 border border-gray-300 rounded-xl transition-all duration-300 focus:outline-none"
                  style={{
                    '--tw-ring-color': 'var(--primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(214, 96, 32, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = ''
                  }} 
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
                  className="w-full p-4 border border-gray-300 rounded-xl transition-all duration-300 focus:outline-none"
                  style={{
                    '--tw-ring-color': 'var(--primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(214, 96, 32, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = ''
                  }} 
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
                  className="w-full p-4 border border-gray-300 rounded-xl transition-all duration-300 resize-none focus:outline-none"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(214, 96, 32, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = ''
                  }} 
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

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getStyle } from '../utils/styleManager'
import { getContent } from '../utils/contentLoader'

export default function Footer({ lang = 'en' }){ 
  const primary = getStyle('primaryColor')
  const footer = getContent('footer', lang)
  const location = useLocation()
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleLinkClick = (targetUrl) => (e) => {
    if (location.pathname === targetUrl) {
      // If already on the target page, prevent navigation and just scroll to top
      e.preventDefault()
      scrollToTop()
    }
    // If on a different page, let the Link navigate (Header will handle scroll on route change)
  }
  
  return (
    <footer className="py-16 bg-gray-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link to="/" onClick={handleLinkClick('/')} className="flex items-center gap-3 mb-6">
              <img 
                src={getContent('images', lang)?.logo || '/assets/logo.png'} 
                alt="logo" 
                className="h-12 w-12 object-contain"
              />
              <div className="text-2xl font-bold">Arab Engineers</div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              {footer.companyDescription}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{footer.quickLinks?.title || 'Quick Links'}</h3>
            <ul className="space-y-3">
              {footer.quickLinks?.links?.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    onClick={handleLinkClick(link.url)}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{footer.contactInfo?.title || 'Contact Info'}</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{footer.contactInfo?.address || 'Eastern Region – Al Ahsa – Mubarez – 6856, Kingdom of Saudi Arabia'}</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href={`tel:${(footer.contactInfo?.phone || '+966 50 900 9509').replace(/\s/g, '')}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {footer.contactInfo?.phone || '+966 50 900 9509'}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href={`mailto:${footer.contactInfo?.email || 'sales@arabengksa.com'}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {footer.contactInfo?.email || 'sales@arabengksa.com'}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {footer.bottomBar?.copyright?.replace('{year}', new Date().getFullYear()) || `© ${new Date().getFullYear()} Arab Engineers — All rights reserved.`}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              {footer.bottomBar?.privacyPolicy || 'Privacy Policy'}
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              {footer.bottomBar?.termsOfService || 'Terms of Service'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

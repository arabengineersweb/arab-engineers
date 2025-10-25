import React from 'react'

export default function Header({lang, setLang}){
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="logo" className="h-10 w-10 object-contain"/>
        <div className="text-lg font-semibold">Arab Engineers</div>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-6">
          <a href="#home" className="hover:text-blue-700">Home</a>
          <a href="#about" className="hover:text-blue-700">About</a>
          <a href="#services" className="hover:text-blue-700">Services</a>
          <a href="#contact" className="hover:text-blue-700">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en') } className="px-3 py-1 border rounded">
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  )
}

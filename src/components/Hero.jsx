import React from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function Hero({lang}){
  const hero = getContent('hero', lang)
  const primary = getStyle('primaryColor')
  return (
    <section id="home" className="pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 md:flex md:items-center md:gap-8">
        <div data-aos="fade-up" className="md:w-1/2">
          <h1 className="font-bold" style={{fontSize: getStyle('headingSize'), color: primary}}>{hero.title}</h1>
          <p className="mt-4" style={{fontSize: getStyle('textSize')}}>{hero.subtitle}</p>
          <button className="mt-6 px-6 py-2 text-white rounded" style={{backgroundColor: primary}}>{hero.buttonText}</button>
        </div>
        <div data-aos="fade-left" className="md:w-1/2 mt-8 md:mt-0">
          <img src={hero.image} alt="hero" className="w-full rounded shadow-lg"/>
        </div>
      </div>
    </section>
  )
}

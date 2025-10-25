import React from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'

export default function About({lang}){
  const about = getContent('about', lang)
  return (
    <section id="about" className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center" data-aos="fade-up">
        <h2 className="font-semibold text-2xl mb-4">{about.title}</h2>
        <p className="mb-6">{about.text}</p>
        <img src={about.image} alt="about" className="mx-auto rounded-lg" />
      </div>
    </section>
  )
}

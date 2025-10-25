import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import ContactForm from '../components/ContactForm'

export default function HomePage({lang}) {
  return (
    <>
      <Hero lang={lang} />
      <About lang={lang} />
      <Services lang={lang} />
      <ContactForm lang={lang} />
    </>
  )
}

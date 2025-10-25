import React from 'react'
import About from '../components/About'
import Services from '../components/Services'
import ContactForm from '../components/ContactForm'

export default function AboutPage({lang}) {
  return (
    <>
      <About lang={lang} />
      <Services lang={lang} />
      <ContactForm lang={lang} />
    </>
  )
}

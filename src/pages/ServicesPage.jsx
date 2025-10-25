import React from 'react'
import Services from '../components/Services'
import ContactForm from '../components/ContactForm'

export default function ServicesPage({lang}) {
  return (
    <>
      <Services lang={lang} />
      <ContactForm lang={lang} />
    </>
  )
}

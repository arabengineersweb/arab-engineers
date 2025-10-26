import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import NotFound from '../components/NotFound'

export default function NotFoundPage({ lang, setLang }) {
  return (
    <>
      <Header lang={lang} setLang={setLang} />
      <main>
        <NotFound lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}


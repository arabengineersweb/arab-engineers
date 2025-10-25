import React from 'react'
import { getContent } from '../utils/contentLoader'

export default function ContactForm({lang}){
  const contact = getContent('contact', lang)
  return (
    <section id="contact" className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6" data-aos="fade-up">
        <h3 className="text-2xl font-semibold mb-2 text-center">{contact.title}</h3>
        <p className="text-center mb-6">{contact.description}</p>
        <div className="bg-white p-6 rounded shadow">
          <form action="https://formspree.io/f/your-form-id" method="POST" className="space-y-4">
            <input name="name" placeholder={lang==='en'? 'Your Name':'اسمك'} className="w-full p-3 border rounded" required />
            <input name="email" placeholder="Email" type="email" className="w-full p-3 border rounded" required />
            <textarea name="message" placeholder={lang==='en'? 'Message':'رسالتك'} className="w-full p-3 border rounded" required />
            <button type="submit" className="px-6 py-2 bg-blue-800 text-white rounded">Send</button>
          </form>
          <div className="mt-6 text-sm">
            <strong>{contact.email}</strong> • {contact.phone}
            <div>{contact.address}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

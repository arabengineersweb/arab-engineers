import React from 'react'

export default function Footer(){ 
  return (
    <footer className="py-8 bg-white mt-12 border-t">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm">
        © {new Date().getFullYear()} Arab Engineers — All rights reserved.
      </div>
    </footer>
  )
}

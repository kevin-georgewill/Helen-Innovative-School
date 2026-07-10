'use client'

import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Testimonials', href: '/#testimonials' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-his-navy/95 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo variant="light" />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/90 hover:text-white text-sm font-medium transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-his-navy border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/80 hover:text-white text-sm font-medium py-1 transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-white/80 py-2 text-center"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="bg-his-green hover:bg-his-green-hover text-white text-sm font-semibold px-6 py-2.5 rounded-full text-center transition-colors duration-150"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
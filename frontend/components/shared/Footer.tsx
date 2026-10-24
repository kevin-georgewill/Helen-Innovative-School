import Link from 'next/link'
import Logo from './Logo'
import {
  MessageCircle,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'
import {
  SiFacebook,
  SiInstagram,
  SiX,
} from '@icons-pack/react-simple-icons'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/dashboard/community' },
  { label: 'Blog', href: '/blog' },
  { label: 'Explore Courses', href: '/courses' },
  { label: 'Log in', href: '/login' },
]

const supportLinks = [
  { label: 'Faculties', href: '/faculties' },
  { label: 'Apply Now', href: '/register' },
  { label: 'Help Centre', href: '/help' },
  { label: 'Verify Certificates', href: '/verify' },
]

const locations = [
  'Lagos, Nigeria',
  'Nairobi, Kenya',
  'Accra, Ghana',
  'Johannesburg, South Africa',
]

const whatsappLink = 'https://wa.me/2347033977294'

// Replace these with the official profile URLs.
const socialLinks = [
  {
    label: 'Facebook',
    href: 'YOUR_FACEBOOK_URL',
    icon: SiFacebook,
  },
  {
    label: 'Instagram',
    href: 'YOUR_INSTAGRAM_URL',
    icon: SiInstagram,
  },
  {
    label: 'X',
    href: 'YOUR_X_URL',
    icon: SiX,
  },
]

export default function Footer() {
  return (
    <footer className="bg-his-navy">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand and WhatsApp */}
          <div>
            <Logo variant="light" className="mb-4" />

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
              Where Every Profession Meets Innovation. Empowering learners
              with future-ready skills through technology-driven education.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" />
              Chat with Us
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-sm font-semibold tracking-wide text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 text-sm font-semibold tracking-wide text-white">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations and Socials */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <MapPin className="h-4 w-4 text-his-green" />
              Our Locations
            </h4>

            <ul className="space-y-3">
              {locations.map((location) => (
                <li key={location} className="text-sm text-slate-400">
                  {location}
                </li>
              ))}
            </ul>

            <h4 className="mb-4 mt-8 text-sm font-semibold tracking-wide text-white">
              Follow Us
            </h4>

            <div className="flex items-center gap-3">
  {socialLinks.map(({ label, href, icon: Icon }) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-his-green hover:text-white"
    >
      <Icon className="h-5 w-5" />
    </a>
  ))}
</div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Helen Innovative School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
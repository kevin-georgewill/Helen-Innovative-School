import Link from 'next/link'
import Logo from './Logo'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/dashboard/community' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Explore Courses', href: '/courses' },
  { label: 'Log in', href: '/login' },
]

const supportLinks = [
  { label: 'Faculties', href: '/faculties' },
  { label: 'Apply now', href: '/register' },
  { label: 'Help Center', href: '/help' },
  { label: 'Verify Certificates', href: '/verify' },
]

export default function Footer() {
  return (
    <footer className="bg-his-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo variant="light" className="mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Where Every Profession Meets Innovation. Africa&apos;s leading
              technology driven educational institution.
            </p>
            {/* Newsletter */}
            <div className="flex items-center max-w-xs">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm px-4 py-3 rounded-l-xl outline-none focus:border-his-green transition-colors"
                suppressHydrationWarning
              />
              <button className="bg-his-green hover:bg-his-green-hover text-white text-sm font-semibold px-5 py-3 rounded-r-xl transition-colors duration-150 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Helen Innovative School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import Logo from './Logo'

// Placeholder for routes that are scaffolded but not yet implemented, so the
// production build has a valid default export for every page. Replace with the
// real page when the feature is built.
export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-his-muted flex flex-col items-center justify-center px-6 text-center">
      <Logo variant="dark" className="mb-8" />
      <h1 className="text-3xl font-bold text-his-navy mb-3">Coming soon</h1>
      <p className="text-slate-500 max-w-md mb-8">
        This part of the Helen Innovative School platform is being built. Check back shortly.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition"
      >
        Back to home
      </Link>
    </main>
  )
}

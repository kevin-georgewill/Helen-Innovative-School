'use client'

// Register page — /register
// Form: full name, email, password, confirm password → POST /api/v1/auth/register (via useRegister).
// Registration always creates a `student`; the returned token is stored and we redirect to /dashboard.

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRegister } from '@/lib/queries/auth'
import { dashboardPathForRole } from '@/lib/auth'
import AuthBrandPanel from '@/components/shared/AuthBrandPanel'
import Logo from '@/components/shared/Logo'

export default function RegisterPage() {
  const router = useRouter()
  const register = useRegister()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.')
      return
    }

    try {
      const profile = await register.mutateAsync({ full_name: fullName, email, password })
      router.replace(dashboardPathForRole(profile.role))
    } catch {
      // Error surfaced below via register.error
    }
  }

  const error = localError ?? (register.isError ? register.error.message : null)

  return (
    <main className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-his-muted">
        <div className="w-full max-w-md">
          <Logo variant="dark" className="lg:hidden mb-8" />

          <h1 className="text-3xl font-bold text-his-navy mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Start learning across 11 technology faculties today.</p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-his-border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-his-blue focus:outline-none focus:ring-2 focus:ring-his-blue/20 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-his-border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-his-blue focus:outline-none focus:ring-2 focus:ring-his-blue/20 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-semibold text-his-blue hover:text-his-blue-light"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-his-border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-his-blue focus:outline-none focus:ring-2 focus:ring-his-blue/20 transition"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-his-border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-his-blue focus:outline-none focus:ring-2 focus:ring-his-blue/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {register.isPending ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-his-blue hover:text-his-blue-light">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

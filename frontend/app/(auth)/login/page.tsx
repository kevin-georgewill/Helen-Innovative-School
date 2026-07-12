'use client'

// Login page — /login
// Form: email + password → POST /api/v1/auth/login (via useLogin).
// On success the token + user are stored, then we redirect by role.

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLogin } from '@/lib/queries/auth'
import { dashboardPathForRole } from '@/lib/auth'
import AuthBrandPanel from '@/components/shared/AuthBrandPanel'
import Logo from '@/components/shared/Logo'

export default function LoginPage() {
  const router = useRouter()
  const login = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const profile = await login.mutateAsync({ email, password })
      router.replace(dashboardPathForRole(profile.role))
    } catch {
      // Error surfaced below via login.error
    }
  }

  return (
    <main className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-his-muted">
        <div className="w-full max-w-md">
          <Logo variant="dark" className="lg:hidden mb-8" />

          <h1 className="text-3xl font-bold text-his-navy mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Log in to continue your learning journey.</p>

          {login.isError && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {login.error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="flex items-center gap-3">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-his-blue hover:text-his-blue-light"
                  >
                    Forgot password?
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-xs font-semibold text-his-blue hover:text-his-blue-light"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-his-border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-his-blue focus:outline-none focus:ring-2 focus:ring-his-blue/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {login.isPending ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-his-blue hover:text-his-blue-light">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

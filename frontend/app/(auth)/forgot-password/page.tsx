'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useForgotPassword } from '@/lib/queries/auth'
import AuthBrandPanel from '@/components/shared/AuthBrandPanel'
import Logo from '@/components/shared/Logo'

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword()
  const [email, setEmail] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await forgot.mutateAsync(email)
    } catch {
      // error surfaced via forgot.error below
    }
  }

  if (forgot.isSuccess) {
    return (
      <main className="min-h-screen flex">
        <AuthBrandPanel />

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-his-muted">
          <div className="w-full max-w-md text-center">
            <Logo variant="dark" className="lg:hidden mb-8 mx-auto" />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-his-navy mb-3">Check your email</h1>
            <p className="text-slate-500 mb-2">
              We sent a password reset link to
            </p>
            <p className="font-semibold text-his-navy mb-8">{email}</p>
            <p className="text-sm text-slate-400 mb-8">
              The link expires in 1 hour. If you don&apos;t see it, check your spam folder.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition-all duration-200"
            >
              Back to log in
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-his-muted">
        <div className="w-full max-w-md">
          <Logo variant="dark" className="lg:hidden mb-8" />

          <h1 className="text-3xl font-bold text-his-navy mb-2">Forgot your password?</h1>
          <p className="text-slate-500 mb-8">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {forgot.isError && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {forgot.error.message}
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

            <button
              type="submit"
              disabled={forgot.isPending}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {forgot.isPending ? 'Sending…' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Remembered it?{' '}
            <Link href="/login" className="font-semibold text-his-blue hover:text-his-blue-light">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

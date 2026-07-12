'use client'

import { useState, useEffect, type FormEvent, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthBrandPanel from '@/components/shared/AuthBrandPanel'
import Logo from '@/components/shared/Logo'

type Stage = 'loading' | 'form' | 'success' | 'invalid'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [stage, setStage] = useState<Stage>('loading')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    let settled = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        settled = true
        setStage('form')
      }
    })

    const code = searchParams.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (!settled && exchangeError) {
          setStage('invalid')
        }
        // on success, onAuthStateChange fires SIGNED_IN which sets stage to 'form'
      })
    } else {
      // Implicit flow — give Supabase a moment to process the URL hash
      const timer = setTimeout(() => {
        if (!settled) setStage('invalid')
      }, 1500)
      return () => {
        clearTimeout(timer)
        subscription.unsubscribe()
      }
    }

    return () => subscription.unsubscribe()
  }, [searchParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setIsPending(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setIsPending(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    await supabase.auth.signOut()
    setStage('success')
    setTimeout(() => router.replace('/login'), 3000)
  }

  return (
    <main className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-his-muted">
        <div className="w-full max-w-md">
          <Logo variant="dark" className="lg:hidden mb-8" />

          {stage === 'loading' && (
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-his-navy/20 border-t-his-navy rounded-full animate-spin mb-4" />
              <p className="text-slate-500">Verifying reset link…</p>
            </div>
          )}

          {stage === 'invalid' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-his-navy mb-3">Link invalid or expired</h1>
              <p className="text-slate-500 mb-8">
                This password reset link has expired or already been used. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center px-6 py-3 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition-all duration-200"
              >
                Request new link
              </Link>
            </div>
          )}

          {stage === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-his-navy mb-3">Password updated</h1>
              <p className="text-slate-500">Redirecting you to log in…</p>
            </div>
          )}

          {stage === 'form' && (
            <>
              <h1 className="text-3xl font-bold text-his-navy mb-2">Set new password</h1>
              <p className="text-slate-500 mb-8">Choose a strong password for your account.</p>

              {error && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      New password
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
                    Confirm new password
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
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}

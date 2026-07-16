// Supabase Auth helpers.
// Per the HIS architecture (CLAUDE.md), the frontend talks to Supabase ONLY for auth —
// sign in, get session, sign out — to obtain the JWT. Every other call goes through the
// backend REST API, which validates that JWT. The user's role lives in the `profiles`
// table and is read via the backend `GET /auth/me` (see `useMe`), not from Supabase.

import { supabase } from './supabase'
import type { UserRole } from '../types'

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const forgotPassword = (email: string) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

export const getToken = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

// Where each role lands after authenticating.
export const dashboardPathForRole = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'instructor':
      return '/instructor'
    default:
      return '/dashboard'
  }
}

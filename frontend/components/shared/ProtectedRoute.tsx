'use client'

// Wraps pages that require authentication.
// Loads the profile via the backend (GET /auth/me, authenticated with the Supabase JWT).
// No session / 401 → redirect to /login. Optional `role` mismatch → redirect to the
// user's own dashboard.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/lib/queries/auth'
import { dashboardPathForRole } from '@/lib/auth'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  role?: UserRole | UserRole[]
  children: React.ReactNode
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const router = useRouter()
  const { data: profile, isLoading, isError } = useMe()

  const allowed = role ? (Array.isArray(role) ? role : [role]) : null
  const roleOk = !allowed || (profile ? allowed.includes(profile.role) : false)

  useEffect(() => {
    if (isLoading) return
    if (isError || !profile) {
      router.replace('/login')
      return
    }
    if (!roleOk) {
      router.replace(dashboardPathForRole(profile.role))
    }
  }, [isLoading, isError, profile, roleOk, router])

  if (isLoading || isError || !profile || !roleOk) return null

  return <>{children}</>
}

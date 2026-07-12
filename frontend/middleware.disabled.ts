import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Guest-only routes: once authenticated, a user is sent to their dashboard and can't
// land back on the marketing homepage / auth pages until they log out.
const GUEST_ONLY_PATHS = ['/', '/login', '/register']

const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/admin/dashboard',
  instructor: '/instructor/dashboard',
  student: '/dashboard',
}

// Look up the user's role from the backend (role lives in the `profiles` table) so we can
// redirect straight to the correct dashboard. Falls back to the student dashboard.
async function dashboardForToken(token: string | undefined): Promise<string> {
  if (!token) return '/dashboard'
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return '/dashboard'
    const body = await res.json()
    return ROLE_DASHBOARD[body?.data?.role] ?? '/dashboard'
  } catch {
    return '/dashboard'
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && GUEST_ONLY_PATHS.includes(request.nextUrl.pathname)) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const url = request.nextUrl.clone()
    url.pathname = await dashboardForToken(session?.access_token)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/', '/login', '/register'],
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import { signIn, signOut, forgotPassword } from '../auth'
import type { Profile } from '../../types'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.me(),
    retry: false,
  })
}

// Registration creates the Supabase auth user + profile row server-side (backend owns the
// DB), then we sign in via Supabase to establish the managed session, and load the profile.
export function useRegister() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (body: {
      email: string
      password: string
      full_name: string
      role: 'student' | 'instructor'

      professional_title?: string
      expertise?: string
      years_of_experience?: number
      bio?: string
      linkedin?: string
      website?: string
    }) => {
      await authApi.register(body)

      const { error } = await signIn(body.email, body.password)

      if (error) {
        throw new Error(error.message)
      }

      return authApi.me()
    },

    onSuccess: (profile) => {
      qc.setQueryData(authKeys.me, profile)
    },
  })
}

// Login: sign in via Supabase (per CLAUDE.md the frontend uses Supabase for auth), then
// load the profile from the backend so we know the user's role.
export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const { error } = await signIn(body.email, body.password)
      if (error) throw new Error(error.message)
      return authApi.me()
    },
    onSuccess: (profile) => qc.setQueryData(authKeys.me, profile),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => signOut(),
    onSettled: () => qc.clear(),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await forgotPassword(email)
      if (error) throw new Error(error.message)
    },
  })
}

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'bio' | 'phone'>>) =>
      authApi.updateMe(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  })
}

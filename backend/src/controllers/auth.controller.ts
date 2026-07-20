import { Request, Response } from 'express'
import { z } from 'zod'
import { supabase, createAuthClient } from '../services/supabase'

export const registerSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),

  full_name: z.string().min(1),

  role: z.enum(['student', 'instructor']).default('student'),

  professional_title: z.string().optional(),

  expertise: z.string().optional(),

  years_of_experience: z.number().optional(),

  bio: z.string().optional(),

  linkedin: z.string().optional(),

  website: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const updateMeSchema = z.object({
  full_name: z.string().min(1).optional(),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
})

export const register = async (req: Request, res: Response) => {
  try {
    console.log('========== REGISTER START ==========')
    console.log('Request body:', req.body)

    const {
  email,
  password,
  full_name,
  role,

  professional_title,
  expertise,
  years_of_experience,
  bio,
  linkedin,
  website,
} = req.body

    console.log('Creating auth user...')

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    console.log('Auth user result:', {
      user: authData?.user?.id,
      error: authError,
    })

    if (authError) {
      return res.status(500).json({
        error: authError.message,
      })
    }

    console.log('Creating profile...')

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name,
        role,
      })
      if (role === 'instructor') {
  const { error: instructorError } = await supabase
    .from('instructor_profiles')
    .insert({
      id: authData.user.id,

      professional_title,
      expertise,
      years_of_experience,
      bio,
      linkedin,
      website,

      status: 'approved',
    })

  if (instructorError) {
    await supabase.auth.admin.deleteUser(authData.user.id)

    return res.status(500).json({
      error: 'Failed to create instructor profile',
    })
  }
}

    console.log('Profile result:', profileError)

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id)

      return res.status(500).json({
        error: profileError.message,
      })
    }

    console.log('Signing in...')

    const authClient = createAuthClient()

    const { data: sessionData, error: signInError } =
      await authClient.auth.signInWithPassword({
        email,
        password,
      })

    console.log('Sign in result:', {
      session: !!sessionData.session,
      error: signInError,
    })

    if (signInError || !sessionData.session) {
      return res.status(500).json({
        error:
          signInError?.message ??
          'Account created but could not generate token',
      })
    }

    console.log('========== REGISTER SUCCESS ==========')

    return res.status(201).json({
      data: {
        token: sessionData.session.access_token,
      },
      message: 'Registration successful',
    })
  } catch (err) {
    console.error('========== REGISTER FAILED ==========')
    console.error(err)

    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const { data, error } = await createAuthClient().auth.signInWithPassword({ email, password })
  if (error || !data.session) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, avatar_url')
    .eq('id', data.user.id)
    .single()

  return res.status(200).json({
    data: {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role ?? 'student',
        full_name: profile?.full_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
      },
    },
    message: 'Login successful',
  })
}

export const logout = async (req: Request, res: Response) => {
  const token = req.headers.authorization!.split(' ')[1]
  await supabase.auth.admin.signOut(token, 'local')
  return res.status(200).json({ data: null, message: 'Logged out successfully' })
}

export const me = async (req: Request, res: Response) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, avatar_url, bio, phone, created_at')
    .eq('id', req.user!.id)
    .single()

  if (error || !profile) {
    return res.status(401).json({ error: 'User not found' })
  }

  return res.status(200).json({
    data: { ...profile, email: req.user!.email },
    message: 'OK',
  })
}

export const updateMe = async (req: Request, res: Response) => {
  const updates = req.body

  if (Object.keys(updates).length === 0) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, phone, updated_at')
      .eq('id', req.user!.id)
      .single()
    return res.status(200).json({ data: profile, message: 'Profile updated' })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.user!.id)
    .select('id, full_name, avatar_url, bio, phone, updated_at')
    .single()

  if (error || !data) {
    return res.status(500).json({ error: 'Failed to update profile' })
  }

  return res.status(200).json({ data, message: 'Profile updated' })
}

import { Request, Response, NextFunction } from 'express'
import { supabase } from '../services/supabase'
import { UserRole } from '../types'

const VALID_ROLES: readonly UserRole[] = ['student', 'instructor', 'admin']

function isValidRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (VALID_ROLES as string[]).includes(value)
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired token' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (!profile) return res.status(401).json({ error: 'User profile not found' })

  if (!isValidRole(profile.role)) {
    return res.status(403).json({ error: 'Account has an unrecognised role' })
  }

  req.user = { id: data.user.id, email: data.user.email!, role: profile.role }
  next()
}

export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }

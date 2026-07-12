export type UserRole = 'student' | 'instructor' | 'admin'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

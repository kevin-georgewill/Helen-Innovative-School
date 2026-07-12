import { Router } from 'express'
import { authenticateUser } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import {
  register, registerSchema,
  login, loginSchema,
  logout,
  me,
  updateMe, updateMeSchema,
} from '../controllers/auth.controller'

const router = Router()

router.post('/register', validateRequest(registerSchema), register)
router.post('/login', validateRequest(loginSchema), login)
router.post('/logout', authenticateUser, logout)
router.get('/me', authenticateUser, me)
router.patch('/me', authenticateUser, validateRequest(updateMeSchema), updateMe)

export default router

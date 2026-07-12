import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { enroll, myEnrollments, courseStudents, enrollSchema } from '../controllers/enrollments.controller'

const router = Router()

router.post('/', authenticateUser, requireRole('student'), validateRequest(enrollSchema), enroll)
router.get('/me', authenticateUser, myEnrollments)
router.get('/:courseId/students', authenticateUser, requireRole('instructor', 'admin'), courseStudents)

export default router

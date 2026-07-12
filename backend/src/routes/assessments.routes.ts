import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { upload } from '../middleware/upload'
import { getForCourse, create, submit, uploadAssignment, results, createAssessmentSchema } from '../controllers/assessments.controller'

const router = Router()

router.get('/:courseId', authenticateUser, getForCourse)
router.post('/', authenticateUser, requireRole('instructor', 'admin'), validateRequest(createAssessmentSchema), create)
router.post('/:id/submit', authenticateUser, requireRole('student'), submit)
router.post('/:id/upload', authenticateUser, requireRole('student'), upload.single('file'), uploadAssignment)
router.get('/:id/results', authenticateUser, requireRole('instructor', 'admin'), results)

export default router

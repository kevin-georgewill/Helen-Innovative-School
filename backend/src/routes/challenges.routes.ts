import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { upload } from '../middleware/upload'
import { list, getOne, create, submit, submissions, createChallengeSchema, submitChallengeSchema } from '../controllers/challenges.controller'

const router = Router()

router.get('/', list)
router.get('/:id', getOne)
router.post('/', authenticateUser, requireRole('admin'), validateRequest(createChallengeSchema), create)
router.post('/:id/submit', authenticateUser, upload.single('file'), validateRequest(submitChallengeSchema), submit)
router.get('/:id/submissions', authenticateUser, requireRole('admin'), submissions)

export default router

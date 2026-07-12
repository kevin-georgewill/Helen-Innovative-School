import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { upload } from '../middleware/upload'
import { update, updateLessonSchema, remove } from '../controllers/lessons.controller'

const router = Router()

router.patch('/:id', authenticateUser, requireRole('instructor', 'admin'), upload.single('file'), validateRequest(updateLessonSchema), update)
router.delete('/:id', authenticateUser, requireRole('instructor', 'admin'), remove)

export default router

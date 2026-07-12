import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { upload } from '../middleware/upload'
import {
  update, updateModuleSchema,
  deleteModule,
  addLesson, addLessonSchema,
} from '../controllers/modules.controller'

const router = Router()

router.patch('/:id', authenticateUser, requireRole('instructor', 'admin'), validateRequest(updateModuleSchema), update)
router.delete('/:id', authenticateUser, requireRole('instructor', 'admin'), deleteModule)
router.post('/:id/lessons', authenticateUser, requireRole('instructor', 'admin'), upload.single('file'), validateRequest(addLessonSchema), addLesson)

export default router

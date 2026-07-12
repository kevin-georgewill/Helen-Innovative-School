import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import {
  list,
  getOne,
  create, createCourseSchema,
  update, updateCourseSchema,
  remove,
  addModule, addModuleSchema,
} from '../controllers/courses.controller'

const router = Router()

router.get('/', list)
router.get('/:slug', getOne)
router.post('/', authenticateUser, requireRole('instructor', 'admin'), validateRequest(createCourseSchema), create)
router.patch('/:id', authenticateUser, requireRole('instructor', 'admin'), validateRequest(updateCourseSchema), update)
router.delete('/:id', authenticateUser, requireRole('admin'), remove)
router.post('/:id/modules', authenticateUser, requireRole('instructor', 'admin'), validateRequest(addModuleSchema), addModule)

export default router

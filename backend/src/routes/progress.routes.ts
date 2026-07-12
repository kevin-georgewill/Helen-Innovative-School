import { Router } from 'express'
import { authenticateUser } from '../middleware/auth'
import { markComplete, getCourseProgress } from '../controllers/progress.controller'

const router = Router()

router.post('/:lessonId', authenticateUser, markComplete)
router.get('/:courseId', authenticateUser, getCourseProgress)

export default router

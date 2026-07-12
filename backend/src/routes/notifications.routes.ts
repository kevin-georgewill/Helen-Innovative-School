import { Router } from 'express'
import { authenticateUser } from '../middleware/auth'
import { list, markRead, markAllRead, remove } from '../controllers/notifications.controller'

const router = Router()

router.get('/me', authenticateUser, list)
router.patch('/read-all', authenticateUser, markAllRead)
router.patch('/:id/read', authenticateUser, markRead)
router.delete('/:id', authenticateUser, remove)

export default router

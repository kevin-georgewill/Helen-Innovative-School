import { Router } from 'express'
import { authenticateUser } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import { listPosts, createPost, createReply, deletePost, createPostSchema, createReplySchema } from '../controllers/community.controller'

const router = Router()

router.get('/', listPosts)
router.post('/', authenticateUser, validateRequest(createPostSchema), createPost)
router.post('/:postId/replies', authenticateUser, validateRequest(createReplySchema), createReply)
router.delete('/:postId', authenticateUser, deletePost)

export default router

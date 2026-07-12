import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { myCertificates, verify, generate } from '../controllers/certificates.controller'

const router = Router()

router.get('/me', authenticateUser, myCertificates)
router.get('/verify/:certificateNo', verify)
router.post('/generate/:enrollmentId', authenticateUser, requireRole('admin'), generate)

export default router

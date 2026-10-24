
import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validate'
import {
  initiateCoursePayment,
  initiateCoursePaymentSchema,
  verifyCoursePayment,
  verifyCoursePaymentSchema,
  listSupportedMarkets,
  listCoursePrices,
} from '../controllers/payments.controller'

const router = Router()

router.get('/markets', listSupportedMarkets)
router.get('/prices', listCoursePrices)

router.post(
  '/paystack/initiate',
  authenticateUser,
  requireRole('student'),
  validateRequest(initiateCoursePaymentSchema),
  initiateCoursePayment
)

router.post(
  '/paystack/verify',
  authenticateUser,
  requireRole('student'),
  validateRequest(verifyCoursePaymentSchema),
  verifyCoursePayment
)

export default router

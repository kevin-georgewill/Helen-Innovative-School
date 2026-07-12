import { Router } from 'express'
import authRoutes from './auth.routes'
import facultiesRoutes from './faculties.routes'
import coursesRoutes from './courses.routes'
import modulesRoutes from './modules.routes'
import lessonsRoutes from './lessons.routes'
import enrollmentsRoutes from './enrollments.routes'
import progressRoutes from './progress.routes'
import assessmentsRoutes from './assessments.routes'
import certificatesRoutes from './certificates.routes'
import eventsRoutes from './events.routes'
import communityRoutes from './community.routes'
import challengesRoutes from './challenges.routes'
import blogRoutes from './blog.routes'
import notificationsRoutes from './notifications.routes'
import paymentsRoutes from './payments.routes'
import adminRoutes from './admin.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/faculties', facultiesRoutes)
router.use('/courses', coursesRoutes)
router.use('/modules', modulesRoutes)
router.use('/lessons', lessonsRoutes)
router.use('/enrollments', enrollmentsRoutes)
router.use('/progress', progressRoutes)
router.use('/assessments', assessmentsRoutes)
router.use('/certificates', certificatesRoutes)
router.use('/events', eventsRoutes)
router.use('/community', communityRoutes)
router.use('/challenges', challengesRoutes)
router.use('/blog', blogRoutes)
router.use('/notifications', notificationsRoutes)
router.use('/payments', paymentsRoutes)
router.use('/admin', adminRoutes)

export default router

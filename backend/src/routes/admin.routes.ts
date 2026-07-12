import { Router } from 'express'
import { authenticateUser, requireRole } from '../middleware/auth'

// All routes require [admin] — enforced here at the router level
const router = Router()
router.use(authenticateUser, requireRole('admin'))

// GET    /api/v1/admin/stats                      — platform stats: total students, revenue, enrollments, active courses
// GET    /api/v1/admin/students                   — list all students with enrollment counts
// PATCH  /api/v1/admin/students/:id/suspend       — suspend a student account
// DELETE /api/v1/admin/students/:id               — permanently remove a student account and their data
// GET    /api/v1/admin/courses                    — list all courses with publish status and enrollment counts
// PATCH  /api/v1/admin/courses/:id/publish        — toggle is_published on a course (publish or unpublish)
// DELETE /api/v1/admin/courses/:id                — archive / permanently delete a course
// POST   /api/v1/admin/certificates/:id/approve   — approve pending certificate and trigger PDF + QR generation

export default router

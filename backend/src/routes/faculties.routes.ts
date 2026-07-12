import { Router } from 'express'

// GET    /api/v1/faculties          — list all faculties
// GET    /api/v1/faculties/:slug    — single faculty + its courses
// POST   /api/v1/faculties          — create faculty [admin]
// PATCH  /api/v1/faculties/:id      — update faculty [admin]
// DELETE /api/v1/faculties/:id      — delete faculty [admin]

export default Router()
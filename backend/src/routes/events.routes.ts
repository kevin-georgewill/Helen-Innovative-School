import { Router } from 'express'

// GET  /api/v1/events            — list all events
// GET  /api/v1/events/:id        — event detail
// POST /api/v1/events            — create event [admin]
// POST /api/v1/events/:id/register — register for an event [auth]

export default Router()
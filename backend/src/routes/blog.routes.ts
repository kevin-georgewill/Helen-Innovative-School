import { Router } from 'express'

// GET   /api/v1/blog          — list published posts
// GET   /api/v1/blog/:slug    — single post
// POST  /api/v1/blog          — create post [instructor | admin]
// PATCH /api/v1/blog/:id      — update post [instructor | admin]

export default Router()
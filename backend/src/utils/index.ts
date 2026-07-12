import { Request, Response } from 'express'

export const notImplemented = (_req: Request, res: Response) =>
  res.status(501).json({ error: 'Not implemented' })

import { Request, Response, NextFunction } from 'express'

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  const status: number = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
}

export default errorHandler

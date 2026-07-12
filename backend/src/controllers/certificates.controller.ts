import { Request, Response } from 'express'
import { supabase } from '../services/supabase'

export const myCertificates = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      id, certificate_no, qr_code_url, issued_at,
      course:courses(id, title, slug)
    `)
    .eq('student_id', req.user!.id)
    .order('issued_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

export const verify = async (req: Request, res: Response) => {
  const { certificateNo } = req.params

  const { data, error } = await supabase
    .from('certificates')
    .select(`
      id, certificate_no, qr_code_url, issued_at,
      student:profiles!student_id(id, full_name),
      course:courses(id, title)
    `)
    .eq('certificate_no', certificateNo)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Certificate not found' })

  return res.json({ data, message: 'OK' })
}

export const generate = async (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'Certificate generation not yet implemented' })
}

import { Request, Response } from 'express'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { supabase } from '../services/supabase'

export const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
})

export const submitChallengeSchema = z.object({
  content_type: z.enum(['text', 'pdf', 'video']),
  description: z.string().optional(),
  video_url: z.string().url().optional(),
})

export const list = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('innovation_challenges')
    .select('id, title, description, deadline, created_at')
    .order('deadline', { ascending: true, nullsFirst: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('innovation_challenges')
    .select('id, title, description, deadline, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Challenge not found' })

  return res.json({ data, message: 'OK' })
}

export const create = async (req: Request, res: Response) => {
  const { title, description, deadline } = req.body

  const { data, error } = await supabase
    .from('innovation_challenges')
    .insert({ title, description: description ?? null, deadline: deadline ?? null })
    .select('id, title, description, deadline, created_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Challenge created' })
}

export const submit = async (req: Request, res: Response) => {
  const { id: challengeId } = req.params
  const { content_type, description, video_url } = req.body
  const student_id = req.user!.id

  const { data: challenge } = await supabase
    .from('innovation_challenges')
    .select('id')
    .eq('id', challengeId)
    .single()

  if (!challenge) return res.status(404).json({ error: 'Challenge not found' })

  let contentUrl: string | null = null

  if (content_type === 'pdf') {
    if (!req.file) return res.status(422).json({ error: 'A PDF file is required' })

    const ext = (req.file.originalname.split('.').pop() ?? 'pdf').toLowerCase()
    const fileId = randomUUID()
    const storagePath = `${challengeId}/${student_id}/${fileId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('challenge-submissions')
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype })

    if (uploadError) return res.status(500).json({ error: 'File upload failed' })

    contentUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/challenge-submissions/${storagePath}`
  } else if (content_type === 'video') {
    if (!video_url) return res.status(422).json({ error: 'video_url is required' })
    contentUrl = video_url
  }

  const { data, error } = await supabase
    .from('challenge_submissions')
    .insert({
      challenge_id: challengeId,
      student_id,
      content_type,
      content_url: contentUrl,
      description: description ?? null,
    })
    .select('id, challenge_id, student_id, content_type, content_url, description, submitted_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Submission received' })
}

export const submissions = async (req: Request, res: Response) => {
  const { id: challengeId } = req.params

  const { data, error } = await supabase
    .from('challenge_submissions')
    .select(`
      id, content_type, content_url, description, submitted_at,
      student:profiles!student_id(id, full_name, avatar_url)
    `)
    .eq('challenge_id', challengeId)
    .order('submitted_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

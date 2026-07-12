import { Request, Response } from 'express'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { supabase } from '../services/supabase'

export const createAssessmentSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1),
  pass_score: z.number().int().min(0).max(100).default(70),
  questions: z.array(z.object({
    question_text: z.string().min(1),
    position: z.number().int().nonnegative().optional(),
    options: z.array(z.object({
      text: z.string().min(1),
      is_correct: z.boolean(),
    })).min(2),
  })).min(1),
})

export const getForCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params

  const { data: assessment, error } = await supabase
    .from('assessments')
    .select(`
      id, course_id, title, pass_score, created_at,
      questions(id, question_text, options, position)
    `)
    .eq('course_id', courseId)
    .single()

  if (error || !assessment) return res.status(404).json({ error: 'Assessment not found' })

  const sorted = {
    ...assessment,
    questions: ((assessment as any).questions ?? []).sort(
      (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)
    ),
  }

  return res.json({ data: sorted, message: 'OK' })
}

export const create = async (req: Request, res: Response) => {
  const { course_id, title, pass_score, questions } = req.body

  const { data: assessment, error: aError } = await supabase
    .from('assessments')
    .insert({ course_id, title, pass_score })
    .select('id, course_id, title, pass_score, created_at')
    .single()

  if (aError) return res.status(500).json({ error: aError.message })

  const questionRows = (questions as any[]).map((q, i) => ({
    assessment_id: assessment.id,
    question_text: q.question_text,
    options: q.options,
    position: q.position ?? i,
  }))

  const { error: qError } = await supabase.from('questions').insert(questionRows)
  if (qError) return res.status(500).json({ error: qError.message })

  return res.status(201).json({ data: assessment, message: 'Assessment created' })
}

export const submit = async (req: Request, res: Response) => {
  const { id: assessmentId } = req.params
  const { answers } = req.body as { answers: Record<string, number> }
  const student_id = req.user!.id

  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, pass_score, questions(id, options)')
    .eq('id', assessmentId)
    .single()

  if (!assessment) return res.status(404).json({ error: 'Assessment not found' })

  const questions: { id: string; options: { text: string; is_correct: boolean }[] }[] =
    (assessment as any).questions ?? []

  const total = questions.length
  let correct = 0

  for (const q of questions) {
    const studentAnswer = answers[q.id]
    if (studentAnswer === undefined) continue
    const correctIdx = q.options.findIndex((o) => o.is_correct)
    if (studentAnswer === correctIdx) correct++
  }

  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = score >= (assessment as any).pass_score

  const { error } = await supabase.from('submissions').insert({
    student_id,
    assessment_id: assessmentId,
    answers,
    score,
    passed,
  })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: { score, passed }, message: 'Assessment submitted' })
}

export const uploadAssignment = async (req: Request, res: Response) => {
  const { id: assessmentId } = req.params
  const student_id = req.user!.id

  if (!req.file) return res.status(422).json({ error: 'File is required' })

  const ext = (req.file.originalname.split('.').pop() ?? 'bin').toLowerCase()
  const fileId = randomUUID()
  const storagePath = `${assessmentId}/${student_id}/${fileId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('assignments')
    .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype })

  if (uploadError) return res.status(500).json({ error: 'File upload failed' })

  const contentUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/assignments/${storagePath}`

  const { data, error } = await supabase
    .from('submissions')
    .insert({ student_id, assessment_id: assessmentId, content_url: contentUrl })
    .select('id, student_id, assessment_id, submitted_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Assignment uploaded' })
}

export const results = async (req: Request, res: Response) => {
  const { id: assessmentId } = req.params

  const { data, error } = await supabase
    .from('submissions')
    .select(`
      id, answers, score, passed, submitted_at,
      student:profiles!student_id(id, full_name, avatar_url)
    `)
    .eq('assessment_id', assessmentId)
    .order('submitted_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

import { Request, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'

export const enrollSchema = z.object({
  course_id: z.string().uuid(),
  payment_ref: z.string().optional(),
})

export const enroll = async (req: Request, res: Response) => {
  const { course_id, payment_ref } = req.body
  const student_id = req.user!.id

  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', student_id)
    .eq('course_id', course_id)
    .single()

  if (existing) return res.status(409).json({ error: 'Already enrolled in this course' })

  const { data: course } = await supabase
    .from('courses')
    .select('id, price')
    .eq('id', course_id)
    .eq('is_published', true)
    .single()

  if (!course) return res.status(404).json({ error: 'Course not found' })

  const status = course.price === 0 ? 'active' : 'pending'

  const { data, error } = await supabase
    .from('enrollments')
    .insert({ student_id, course_id, payment_ref: payment_ref ?? null, status })
    .select('id, student_id, course_id, status, enrolled_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Enrolled successfully' })
}

export const myEnrollments = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, course_id, status, payment_ref, enrolled_at,
      course:courses(id, title, slug, thumbnail_url, level, program_type, duration)
    `)
    .eq('student_id', req.user!.id)
    .order('enrolled_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

export const courseStudents = async (req: Request, res: Response) => {
  const { courseId } = req.params

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, status, enrolled_at,
      student:profiles!student_id(id, full_name, email, avatar_url)
    `)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

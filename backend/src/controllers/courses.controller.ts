import { Request, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'

export const createCourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  faculty_id: z.string().uuid(),
  price: z.number().nonnegative().default(0),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  program_type: z.enum(['express', 'certificate', 'diploma']).default('express'),
  duration: z.string().optional(),
  thumbnail_url: z.string().optional(),
})

export const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  program_type: z.enum(['express', 'certificate', 'diploma']).optional(),
  duration: z.string().optional(),
  thumbnail_url: z.string().optional(),
  is_published: z.boolean().optional(),
})

export const addModuleSchema = z.object({
  title: z.string().min(1),
  position: z.number().int().nonnegative().default(0),
})

export const list = async (req: Request, res: Response) => {
  const { faculty, level, program_type } = req.query as Record<string, string>

  let query = supabase
    .from('courses')
    .select(`
      id, title, slug, description, thumbnail_url, price, level, program_type, duration, is_published, created_at,
      faculty:faculties(id, name, slug),
      instructor:profiles!instructor_id(id, full_name, avatar_url)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (level) query = query.eq('level', level)
  if (program_type) query = query.eq('program_type', program_type)

  if (faculty) {
    const { data: fac } = await supabase
      .from('faculties')
      .select('id')
      .eq('slug', faculty)
      .single()
    if (!fac) return res.json({ data: [], message: 'OK' })
    query = query.eq('faculty_id', fac.id)
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

export const getOne = async (req: Request, res: Response) => {
  const { slug } = req.params

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id, title, slug, description, thumbnail_url, price, level, program_type, duration, is_published, created_at,
      faculty:faculties(id, name, slug),
      instructor:profiles!instructor_id(id, full_name, avatar_url, bio),
      modules(
        id, title, position, created_at,
        lessons(id, title, content_type, content_url, content_text, duration_min, position, is_free_preview, created_at)
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !course) return res.status(404).json({ error: 'Course not found' })

  const sorted = {
    ...course,
    modules: ((course as any).modules ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((mod: any) => ({
        ...mod,
        lessons: (mod.lessons ?? []).sort((a: any, b: any) => a.position - b.position),
      })),
  }

  return res.json({ data: sorted, message: 'OK' })
}

export const create = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('courses')
    .insert({ ...req.body, instructor_id: req.user!.id, is_published: false })
    .select('id, title, slug, instructor_id, is_published, created_at')
    .single()

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'A course with this slug already exists' })
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({ data, message: 'Course created' })
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params

  if (req.user!.role === 'instructor') {
    const { data: existing } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single()
    if (!existing) return res.status(404).json({ error: 'Course not found' })
    if (existing.instructor_id !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  }

  const { data, error } = await supabase
    .from('courses')
    .update(req.body)
    .eq('id', id)
    .select('id, title, slug, is_published, updated_at')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Course not found' })
    return res.status(500).json({ error: error.message })
  }

  return res.json({ data, message: 'Course updated' })
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await supabase
    .from('courses')
    .update({ is_published: false })
    .eq('id', id)

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Course not found' })
    return res.status(500).json({ error: error.message })
  }

  return res.json({ data: null, message: 'Course archived' })
}

export const addModule = async (req: Request, res: Response) => {
  const { id: courseId } = req.params
  const { title, position } = req.body

  const { data: course } = await supabase
    .from('courses')
    .select('instructor_id')
    .eq('id', courseId)
    .single()

  if (!course) return res.status(404).json({ error: 'Course not found' })
  if (req.user!.role === 'instructor' && course.instructor_id !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { data, error } = await supabase
    .from('modules')
    .insert({ course_id: courseId, title, position })
    .select('id, course_id, title, position, created_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Module added' })
}
export const dashboard = async (req: Request, res: Response) => {
  const instructorId = req.user!.id;

  // Instructor Profile
  const { data: instructor, error: instructorError } = await supabase
    .from("profiles")
    .select(`
      full_name,
      avatar_url,
      instructor_profiles (
        professional_title,
        expertise,
        years_of_experience
      )
    `)
    .eq("id", instructorId)
    .single();

  if (instructorError) {
    return res.status(500).json({
      error: instructorError.message,
    });
  }

  // Courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id")
    .eq("instructor_id", instructorId);

  // Students
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, courses!inner(instructor_id)")
    .eq("courses.instructor_id", instructorId);

  return res.json({
    data: {
      instructor,

      stats: {
        total_courses: courses?.length ?? 0,
        total_students: enrollments?.length ?? 0,
        pending_assignments: 0,
        upcoming_classes: 0,
      },

      notifications: [],

      recent_activities: [],
    },
  });
};

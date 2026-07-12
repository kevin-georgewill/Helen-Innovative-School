import { Request, Response } from 'express'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { supabase } from '../services/supabase'

export const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  position: z.number().int().nonnegative().optional(),
})

export const addLessonSchema = z.object({
  title: z.string().min(1),
  content_type: z.enum(['video', 'pdf', 'text']),
  position: z.coerce.number().int().nonnegative().default(0),
  duration_min: z.coerce.number().int().nonnegative().optional(),
  is_free_preview: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean()
  ).default(false),
  content_text: z.string().optional(),
})

async function getModuleWithCourse(moduleId: string) {
  return supabase
    .from('modules')
    .select('id, course_id, courses!inner(instructor_id)')
    .eq('id', moduleId)
    .single()
}

function canModify(req: Request, instructorId: string) {
  return req.user!.role !== 'instructor' || req.user!.id === instructorId
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params

  const { data: mod } = await getModuleWithCourse(id)
  if (!mod) return res.status(404).json({ error: 'Module not found' })

  if (!canModify(req, (mod as any).courses.instructor_id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { data, error } = await supabase
    .from('modules')
    .update(req.body)
    .eq('id', id)
    .select('id, title, position')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'Module updated' })
}

export const deleteModule = async (req: Request, res: Response) => {
  const { id } = req.params

  const { data: mod } = await getModuleWithCourse(id)
  if (!mod) return res.status(404).json({ error: 'Module not found' })

  if (!canModify(req, (mod as any).courses.instructor_id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: null, message: 'Module deleted' })
}

export const addLesson = async (req: Request, res: Response) => {
  const { id: moduleId } = req.params
  const { title, content_type, position, duration_min, is_free_preview, content_text } = req.body

  const { data: mod } = await getModuleWithCourse(moduleId)
  if (!mod) return res.status(404).json({ error: 'Module not found' })

  if (!canModify(req, (mod as any).courses.instructor_id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  let contentUrl: string | null = null

  if (content_type === 'video' || content_type === 'pdf') {
    if (!req.file) return res.status(422).json({ error: 'A file is required for video/pdf lessons' })

    const ext = (req.file.originalname.split('.').pop() ?? 'bin').toLowerCase()
    const lessonId = randomUUID()
    const storagePath = `${mod.course_id}/${lessonId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('lessons')
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype })

    if (uploadError) return res.status(500).json({ error: `File upload failed: ${uploadError.message}` })

    contentUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/lessons/${storagePath}`

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        id: lessonId,
        module_id: moduleId,
        course_id: mod.course_id,
        title,
        content_type,
        content_url: contentUrl,
        duration_min: duration_min ?? null,
        position,
        is_free_preview,
      })
      .select('id, module_id, course_id, title, content_type, content_url, duration_min, position, is_free_preview, created_at')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ data, message: 'Lesson added' })
  }

  // text lesson
  if (!content_text) return res.status(422).json({ error: 'content_text is required for text lessons' })

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      course_id: mod.course_id,
      title,
      content_type: 'text',
      content_text,
      duration_min: duration_min ?? null,
      position,
      is_free_preview,
    })
    .select('id, module_id, course_id, title, content_type, content_text, duration_min, position, is_free_preview, created_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json({ data, message: 'Lesson added' })
}

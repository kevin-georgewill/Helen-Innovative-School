import { Request, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'

export const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  position: z.coerce.number().int().nonnegative().optional(),
  duration_min: z.coerce.number().int().nonnegative().optional(),
  is_free_preview: z.preprocess((v) => v === 'true' || v === true, z.boolean()).optional(),
  content_text: z.string().optional(),
})

async function getLessonWithCourse(lessonId: string) {
  return supabase
    .from('lessons')
    .select('id, course_id, content_url, courses!inner(instructor_id)')
    .eq('id', lessonId)
    .single()
}

function canModify(req: Request, instructorId: string) {
  return req.user!.role !== 'instructor' || req.user!.id === instructorId
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params

  const { data: lesson } = await getLessonWithCourse(id)
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' })

  if (!canModify(req, (lesson as any).courses.instructor_id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const updates: Record<string, unknown> = { ...req.body }

  if (req.file && lesson.content_url) {
    const storagePath = lesson.content_url.split('/object/public/lessons/')[1]
    if (storagePath) {
      const { error: uploadError } = await supabase.storage
        .from('lessons')
        .update(storagePath, req.file.buffer, { contentType: req.file.mimetype })

      if (uploadError) return res.status(500).json({ error: 'File upload failed' })
      updates.content_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/lessons/${storagePath}`
    }
  }

  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select('id, title, duration_min, position, is_free_preview')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'Lesson updated' })
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params

  const { data: lesson } = await getLessonWithCourse(id)
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' })

  if (!canModify(req, (lesson as any).courses.instructor_id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (lesson.content_url) {
    const storagePath = lesson.content_url.split('/object/public/lessons/')[1]
    if (storagePath) {
      await supabase.storage.from('lessons').remove([storagePath])
    }
  }

  const { error } = await supabase.from('lessons').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: null, message: 'Lesson deleted' })
}

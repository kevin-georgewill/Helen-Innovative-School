import { Request, Response } from 'express'
import { supabase } from '../services/supabase'

export const markComplete = async (req: Request, res: Response) => {
  const { lessonId } = req.params
  const student_id = req.user!.id

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('id', lessonId)
    .single()

  if (!lesson) return res.status(404).json({ error: 'Lesson not found' })

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(
      { student_id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
      { onConflict: 'student_id,lesson_id' }
    )
    .select('id, student_id, lesson_id, completed, completed_at')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'Lesson marked complete' })
}

export const getCourseProgress = async (req: Request, res: Response) => {
  const { courseId } = req.params
  const student_id = req.user!.id

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  if (lessonsError) return res.status(500).json({ error: lessonsError.message })

  if (!lessons || lessons.length === 0) {
    return res.json({ data: { completed: 0, total: 0, lessons: [] }, message: 'OK' })
  }

  const lessonIds = lessons.map((l) => l.id)

  const { data: progressRows, error } = await supabase
    .from('lesson_progress')
    .select('id, lesson_id, completed, completed_at')
    .eq('student_id', student_id)
    .in('lesson_id', lessonIds)

  if (error) return res.status(500).json({ error: error.message })

  const completedCount = (progressRows ?? []).filter((p) => p.completed).length

  return res.json({
    data: { completed: completedCount, total: lessons.length, lessons: progressRows ?? [] },
    message: 'OK',
  })
}

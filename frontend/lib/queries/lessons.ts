import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonsApi } from '../api'
import type { Lesson } from '../../types'

export function useUpdateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      courseSlug,
      ...body
    }: { id: string; courseSlug?: string } & Partial<Pick<Lesson, 'title' | 'position' | 'duration_min'>>) =>
      lessonsApi.update(id, body),
    onSuccess: (_data, { courseSlug }) => {
      if (courseSlug) qc.invalidateQueries({ queryKey: ['courses', courseSlug] })
    },
  })
}

export function useDeleteLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; courseSlug?: string }) => lessonsApi.remove(id),
    onSuccess: (_data, { courseSlug }) => {
      if (courseSlug) qc.invalidateQueries({ queryKey: ['courses', courseSlug] })
    },
  })
}

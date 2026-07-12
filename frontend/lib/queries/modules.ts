import { useMutation, useQueryClient } from '@tanstack/react-query'
import { modulesApi } from '../api'

export function useUpdateModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, courseSlug, ...body }: { id: string; courseSlug?: string; title?: string; position?: number }) =>
      modulesApi.update(id, body),
    onSuccess: (_data, { courseSlug }) => {
      if (courseSlug) qc.invalidateQueries({ queryKey: ['courses', courseSlug] })
    },
  })
}

export function useDeleteModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; courseSlug?: string }) => modulesApi.remove(id),
    onSuccess: (_data, { courseSlug }) => {
      if (courseSlug) qc.invalidateQueries({ queryKey: ['courses', courseSlug] })
    },
  })
}

export function useAddLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ moduleId, formData }: { moduleId: string; courseSlug?: string; formData: FormData }) =>
      modulesApi.addLesson(moduleId, formData),
    onSuccess: (_data, { courseSlug }) => {
      if (courseSlug) qc.invalidateQueries({ queryKey: ['courses', courseSlug] })
    },
  })
}

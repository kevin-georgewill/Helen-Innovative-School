import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi } from '../api'
import type { Course, Module } from '../../types'

export const courseKeys = {
  all: ['courses'] as const,
  list: (params?: { faculty?: string; level?: string; program_type?: string }) =>
    ['courses', 'list', params] as const,
  detail: (slug: string) => ['courses', slug] as const,
}

export function useCourses(params?: { faculty?: string; level?: string; program_type?: string }) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => coursesApi.list(params),
  })
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => coursesApi.get(slug),
    enabled: !!slug,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Course>) => coursesApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Course>) =>
      coursesApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: courseKeys.all })
      qc.invalidateQueries({ queryKey: ['courses', id] })
    },
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => coursesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  })
}

export function useAddModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, ...body }: { courseId: string } & Pick<Module, 'title' | 'position'>) =>
      coursesApi.addModule(courseId, body),
    onSuccess: (_data, { courseId }) =>
      qc.invalidateQueries({ queryKey: ['courses', courseId] }),
  })
}

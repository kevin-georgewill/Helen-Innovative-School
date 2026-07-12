import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { facultiesApi } from '../api'
import type { Faculty } from '../../types'

export const facultyKeys = {
  all: ['faculties'] as const,
  detail: (slug: string) => ['faculties', slug] as const,
}

export function useFaculties() {
  return useQuery({
    queryKey: facultyKeys.all,
    queryFn: () => facultiesApi.list(),
  })
}

export function useFaculty(slug: string) {
  return useQuery({
    queryKey: facultyKeys.detail(slug),
    queryFn: () => facultiesApi.get(slug),
    enabled: !!slug,
  })
}

export function useCreateFaculty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Pick<Faculty, 'name' | 'slug' | 'description' | 'icon'>) =>
      facultiesApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: facultyKeys.all }),
  })
}

export function useUpdateFaculty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Pick<Faculty, 'name' | 'description' | 'icon'>>) =>
      facultiesApi.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: facultyKeys.all }),
  })
}

export function useDeleteFaculty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => facultiesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: facultyKeys.all }),
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogApi } from '../api'
import type { BlogPost } from '../../types'

export const blogKeys = {
  all: ['blog'] as const,
  detail: (slug: string) => ['blog', slug] as const,
}

export function useBlogPosts() {
  return useQuery({
    queryKey: blogKeys.all,
    queryFn: () => blogApi.list(),
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogApi.get(slug),
    enabled: !!slug,
  })
}

export function useCreateBlogPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<BlogPost>) => blogApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  })
}

export function useUpdateBlogPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<BlogPost>) =>
      blogApi.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  })
}

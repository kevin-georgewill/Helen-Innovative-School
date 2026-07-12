import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '../api'

export const communityKeys = {
  posts: (courseId?: string) => ['community', 'posts', courseId ?? 'all'] as const,
}

// refetchInterval keeps posts fresh without a WebSocket
export function useCommunityPosts(courseId?: string) {
  return useQuery({
    queryKey: communityKeys.posts(courseId),
    queryFn: () => communityApi.list(courseId),
    refetchInterval: 30_000,
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { title?: string; body: string; course_id?: string }) =>
      communityApi.create(body),
    onSuccess: (_data, { course_id }) =>
      qc.invalidateQueries({ queryKey: communityKeys.posts(course_id) }),
  })
}

export function useReply() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; courseId?: string; body: string }) =>
      communityApi.reply(postId, { body }),
    onSuccess: (_data, { courseId }) =>
      qc.invalidateQueries({ queryKey: communityKeys.posts(courseId) }),
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId }: { postId: string; courseId?: string }) =>
      communityApi.remove(postId),
    onSuccess: (_data, { courseId }) =>
      qc.invalidateQueries({ queryKey: communityKeys.posts(courseId) }),
  })
}

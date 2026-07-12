import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { progressApi } from '../api'

export const progressKeys = {
  course: (courseId: string) => ['progress', courseId] as const,
}

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: progressKeys.course(courseId),
    queryFn: () => progressApi.forCourse(courseId),
    enabled: !!courseId,
  })
}

export function useMarkComplete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId }: { lessonId: string; courseId: string }) =>
      progressApi.markComplete(lessonId),
    onSuccess: (_data, { courseId }) =>
      qc.invalidateQueries({ queryKey: progressKeys.course(courseId) }),
  })
}

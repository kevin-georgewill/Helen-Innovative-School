import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentsApi } from '../api'

export const enrollmentKeys = {
  mine: ['enrollments', 'me'] as const,
  students: (courseId: string) => ['enrollments', 'students', courseId] as const,
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: enrollmentKeys.mine,
    queryFn: () => enrollmentsApi.mine(),
  })
}

export function useCourseStudents(courseId: string) {
  return useQuery({
    queryKey: enrollmentKeys.students(courseId),
    queryFn: () => enrollmentsApi.students(courseId),
    enabled: !!courseId,
  })
}

export function useEnroll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => enrollmentsApi.enroll(courseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.mine }),
  })
}

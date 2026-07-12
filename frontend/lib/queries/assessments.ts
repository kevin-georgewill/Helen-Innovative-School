import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentsApi } from '../api'

export const assessmentKeys = {
  forCourse: (courseId: string) => ['assessments', 'course', courseId] as const,
  results: (id: string) => ['assessments', 'results', id] as const,
}

export function useAssessment(courseId: string) {
  return useQuery({
    queryKey: assessmentKeys.forCourse(courseId),
    queryFn: () => assessmentsApi.getForCourse(courseId),
    enabled: !!courseId,
  })
}

export function useAssessmentResults(id: string) {
  return useQuery({
    queryKey: assessmentKeys.results(id),
    queryFn: () => assessmentsApi.results(id),
    enabled: !!id,
  })
}

export function useCreateAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      course_id: string
      title: string
      pass_score?: number
      questions: unknown[]
    }) => assessmentsApi.create(body),
    onSuccess: (_data, { course_id }) =>
      qc.invalidateQueries({ queryKey: assessmentKeys.forCourse(course_id) }),
  })
}

export function useSubmitAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: Record<string, number> }) =>
      assessmentsApi.submit(id, answers),
    onSuccess: (_data, { id }) =>
      qc.invalidateQueries({ queryKey: assessmentKeys.results(id) }),
  })
}

export function useUploadAssignment() {
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      assessmentsApi.uploadAssignment(id, formData),
  })
}

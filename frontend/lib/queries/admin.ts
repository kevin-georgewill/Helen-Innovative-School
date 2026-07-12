import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api'

export const adminKeys = {
  stats: ['admin', 'stats'] as const,
  students: ['admin', 'students'] as const,
  courses: ['admin', 'courses'] as const,
}

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: () => adminApi.stats(),
  })
}

export function useAdminStudents() {
  return useQuery({
    queryKey: adminKeys.students,
    queryFn: () => adminApi.listStudents(),
  })
}

export function useAdminCourses() {
  return useQuery({
    queryKey: adminKeys.courses,
    queryFn: () => adminApi.listCourses(),
  })
}

export function useSuspendStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.suspendStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.students }),
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteStudent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.students })
      qc.invalidateQueries({ queryKey: adminKeys.stats })
    },
  })
}

export function usePublishCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      adminApi.publishCourse(id, publish),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.courses })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useAdminDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.courses })
      qc.invalidateQueries({ queryKey: ['courses'] })
      qc.invalidateQueries({ queryKey: adminKeys.stats })
    },
  })
}

export function useApproveCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (enrollmentId: string) => adminApi.approveCertificate(enrollmentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.stats }),
  })
}

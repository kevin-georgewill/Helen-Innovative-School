import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { challengesApi } from '../api'
import type { InnovationChallenge } from '../../types'

export const challengeKeys = {
  all: ['challenges'] as const,
  detail: (id: string) => ['challenges', id] as const,
  submissions: (id: string) => ['challenges', id, 'submissions'] as const,
}

export function useChallenges() {
  return useQuery({
    queryKey: challengeKeys.all,
    queryFn: () => challengesApi.list(),
  })
}

export function useChallenge(id: string) {
  return useQuery({
    queryKey: challengeKeys.detail(id),
    queryFn: () => challengesApi.get(id),
    enabled: !!id,
  })
}

export function useChallengeSubmissions(id: string) {
  return useQuery({
    queryKey: challengeKeys.submissions(id),
    queryFn: () => challengesApi.submissions(id),
    enabled: !!id,
  })
}

export function useCreateChallenge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<InnovationChallenge>) => challengesApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: challengeKeys.all }),
  })
}

export function useSubmitChallenge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      challengesApi.submit(id, formData),
    onSuccess: (_data, { id }) =>
      qc.invalidateQueries({ queryKey: challengeKeys.submissions(id) }),
  })
}

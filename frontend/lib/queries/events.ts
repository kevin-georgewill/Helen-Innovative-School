import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api'
import type { Event } from '../../types'

export const eventKeys = {
  all: ['events'] as const,
  detail: (id: string) => ['events', id] as const,
}

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: () => eventsApi.list(),
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Event>) => eventsApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  })
}

export function useRegisterForEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => eventsApi.register(id),
    onSuccess: (_data, id) => qc.invalidateQueries({ queryKey: eventKeys.detail(id) }),
  })
}

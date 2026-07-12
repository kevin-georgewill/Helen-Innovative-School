import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { certificatesApi } from '../api'

export const certificateKeys = {
  mine: ['certificates', 'me'] as const,
  verify: (certificateNo: string) => ['certificates', 'verify', certificateNo] as const,
}

export function useMyCertificates() {
  return useQuery({
    queryKey: certificateKeys.mine,
    queryFn: () => certificatesApi.mine(),
  })
}

export function useVerifyCertificate(certificateNo: string) {
  return useQuery({
    queryKey: certificateKeys.verify(certificateNo),
    queryFn: () => certificatesApi.verify(certificateNo),
    enabled: !!certificateNo,
    staleTime: Infinity,
  })
}

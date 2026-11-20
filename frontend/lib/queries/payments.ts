import { useMutation } from '@tanstack/react-query'
import { paymentsApi } from '../api'


export function usePaystackInitiate() {
  return useMutation({
    mutationFn: ({
      courseId,
      market,
    }: {
      courseId: string
      market: string
    }) => paymentsApi.paystackInitiate(courseId, market),
  })
}
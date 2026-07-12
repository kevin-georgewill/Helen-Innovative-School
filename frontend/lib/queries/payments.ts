import { useMutation } from '@tanstack/react-query'
import { paymentsApi } from '../api'

export function usePaystackInitiate() {
  return useMutation({
    mutationFn: (courseId: string) => paymentsApi.paystackInitiate(courseId),
  })
}

export function useStripeInitiate() {
  return useMutation({
    mutationFn: (courseId: string) => paymentsApi.stripeInitiate(courseId),
  })
}

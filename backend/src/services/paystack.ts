
const PAYSTACK_API = 'https://api.paystack.co'

type PaystackTransaction = {
  status: string
  reference: string
  amount: number
  currency: string
  id: number
  gateway_response?: string
}

async function paystackRequest<T>(
  path: string,
  options?: {
    method?: 'GET' | 'POST'
    body?: Record<string, unknown>
  }
): Promise<T> {
  const secret = process.env.PAYSTACK_SECRET_KEY

  if (!secret) {
    throw new Error('Paystack is not configured')
  }

  const response = await fetch(`${PAYSTACK_API}${path}`, {
    method: options?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  })

  const result = await response.json() as {
    status: boolean
    message?: string
    data: T
  }

  if (!response.ok || !result.status) {
    throw new Error(result.message || 'Paystack request failed')
  }

  return result.data
}

export async function initializeTransaction(input: {
  email: string
  amount: number
  currency: string
  reference: string
  callbackUrl: string
  metadata: Record<string, string>
}) {
  if (!Number.isSafeInteger(input.amount) || input.amount <= 0) {
    throw new Error('Invalid payment amount')
  }

  return paystackRequest<{
    authorization_url: string
    access_code: string
    reference: string
  }>('/transaction/initialize', {
    method: 'POST',
    body: {
      email: input.email,
      amount: input.amount,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    },
  })
}

export async function verifyTransaction(reference: string) {
  return paystackRequest<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  )
}

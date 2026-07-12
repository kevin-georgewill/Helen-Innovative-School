import { Router } from 'express'

// POST /api/v1/payments/paystack/initiate   — start a Paystack transaction [auth]
// POST /api/v1/payments/paystack/verify     — Paystack webhook: verify + activate enrollment
// POST /api/v1/payments/stripe/initiate     — create Stripe PaymentIntent [auth]
// POST /api/v1/payments/stripe/webhook      — Stripe webhook: confirm payment + activate enrollment
//   note: stripe/webhook uses express.raw body parser (not express.json)

export default Router()

import { randomUUID } from 'node:crypto'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'
import {
  initializeTransaction,
  verifyTransaction,
} from '../services/paystack'

export const initiateCoursePaymentSchema = z.object({
  course_id: z.string().uuid(),
  market: z.string().regex(/^[A-Z]{2}$/),
})

export const verifyCoursePaymentSchema = z.object({
  reference: z.string().min(10).max(100),
})

function marketCurrencies(): Map<string, string> {
  const value = process.env.PAYSTACK_MARKET_CURRENCIES ?? ''
  const markets = new Map<string, string>()

  for (const item of value.split(',')) {
    const [market, currency] = item.trim().split(':')

    if (
      market && currency &&
      /^[A-Z]{2}$/.test(market) &&
      /^[A-Z]{3}$/.test(currency)
    ) {
      markets.set(market, currency)
    }
  }

  return markets
}

function getUser(req: Request) {
  return (req as Request & {
    user?: { id: string; email?: string; role: string }
  }).user
}

export async function initiateCoursePayment(
  req: Request,
  res: Response
) {
  try {
    const user = getUser(req)
    if (!user?.id || !user.email) {
      return res.status(401).json({ error: 'Authenticated email required' })
    }

    const { course_id, market } = initiateCoursePaymentSchema.parse(req.body)
    const currency = marketCurrencies().get(market)

    if (!currency) {
      return res.status(400).json({
        error: 'This market is not currently enabled for checkout',
      })
    }

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, is_published')
      .eq('id', course_id)
      .eq('is_published', true)
      .maybeSingle()

    if (courseError) throw courseError

    if (!course) {
      return res.status(404).json({ error: 'Published course not found' })
    }

    const { data: existing, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('student_id', user.id)
      .eq('course_id', course_id)
      .maybeSingle()

    if (enrollmentError) throw enrollmentError

    if (existing?.status === 'active' || existing?.status === 'completed') {
      return res.status(409).json({
        error: 'You already have access to this course',
      })
    }

    const { data: price, error: priceError } = await supabase
      .from('course_prices')
      .select('id, amount_minor, currency')
      .eq('course_id', course_id)
      .eq('market', market)
      .eq('currency', currency)
      .eq('is_active', true)
      .maybeSingle()

    if (priceError) throw priceError

    if (!price) {
      return res.status(400).json({
        error: 'No approved price is available for this course and market',
      })
    }

    const amount = Number(price.amount_minor)

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new Error('Configured course price is invalid')
    }

    const reference = `his_${randomUUID().replace(/-/g, '')}`
    const frontendUrl = process.env.FRONTEND_URL

    if (!frontendUrl) {
      throw new Error('FRONTEND_URL is not configured')
    }

    const { error: insertError } = await supabase
      .from('payment_transactions')
      .insert({
        student_id: user.id,
        course_id,
        course_price_id: price.id,
        provider: 'paystack',
        reference,
        amount_minor: amount,
        currency: price.currency,
        status: 'pending',
      })

    if (insertError) throw insertError

    try {
      const transaction = await initializeTransaction({
        email: user.email,
        amount,
        currency: price.currency,
        reference,
        callbackUrl: `${frontendUrl.replace(/\/$/, '')}/payment/verify`,
        metadata: {
          student_id: user.id,
          course_id,
          market,
        },
      })

      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          authorization_url: transaction.authorization_url,
          updated_at: new Date().toISOString(),
        })
        .eq('reference', reference)
        .eq('student_id', user.id)

      if (updateError) throw updateError

      return res.status(200).json({
        data: {
          pay_url: transaction.authorization_url,
          reference,
        },
      })
    } catch (error) {
      // A network error can happen after Paystack has accepted the
      // transaction. Leave the record pending for reconciliation.
      console.error('Paystack initialization failed:', error)
      return res.status(502).json({
        error: 'Could not initialize payment. Please retry or contact support.',
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payment request' })
    }

    console.error('Course payment initiation failed:', error)
    return res.status(500).json({ error: 'Could not initiate payment' })
  }
}

export async function verifyCoursePayment(
  req: Request,
  res: Response
) {
  try {
    const user = getUser(req)
    if (!user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { reference } = verifyCoursePaymentSchema.parse(req.body)

    const { data: payment, error: paymentError } = await supabase
      .from('payment_transactions')
      .select(
        'id, student_id, course_id, reference, amount_minor, currency, status'
      )
      .eq('reference', reference)
      .eq('student_id', user.id)
      .maybeSingle()

    if (paymentError) throw paymentError

    if (!payment) {
      return res.status(404).json({ error: 'Payment reference not found' })
    }

    if (payment.status === 'paid') {
      return res.status(200).json({ data: { status: 'paid' } })
    }

    if (payment.status !== 'pending') {
      return res.status(409).json({ error: 'Payment is not pending' })
    }

    const verified = await verifyTransaction(reference)

    if (
      verified.status !== 'success' ||
      verified.reference !== payment.reference ||
      verified.amount !== Number(payment.amount_minor) ||
      verified.currency !== payment.currency
    ) {
      return res.status(409).json({
        error: 'Payment has not been verified successfully',
      })
    }

    const safeProviderResponse = {
      status: verified.status,
      reference: verified.reference,
      amount: verified.amount,
      currency: verified.currency,
      gateway_response: verified.gateway_response,
    }

    const { data: enrollmentId, error: completionError } = await supabase
      .rpc('complete_course_payment', {
        p_reference: payment.reference,
        p_provider_transaction_id: String(verified.id),
        p_provider_response: safeProviderResponse,
      })

    if (completionError) throw completionError

    return res.status(200).json({
      data: {
        status: 'paid',
        enrollment_id: enrollmentId,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payment reference' })
    }

    console.error('Course payment verification failed:', error)
    return res.status(500).json({ error: 'Could not verify payment' })
  }
}

const MARKET_NAMES: Record<string, string> = {
  NG: 'Nigeria',
  GH: 'Ghana',
  KE: 'Kenya',
  ZA: 'South Africa',
}

export async function listSupportedMarkets(
  _req: Request,
  res: Response
) {
  const markets = Array.from(marketCurrencies().entries()).map(
    ([market, currency]) => ({
      market,
      currency,
      country: MARKET_NAMES[market] ?? market,
    })
  )

  return res.status(200).json({ data: markets })
}

export async function listCoursePrices(
  req: Request,
  res: Response
) {
  try {
    const market = typeof req.query.market === 'string'
      ? req.query.market
      : ''

    if (!/^[A-Z]{2}$/.test(market)) {
      return res.status(400).json({ error: 'Select a valid market' })
    }

    const currency = marketCurrencies().get(market)

    if (!currency) {
      return res.status(400).json({
        error: 'This market is not currently available',
      })
    }

    const { data, error } = await supabase
      .from('course_prices')
      .select(`
        id,
        course_id,
        market,
        currency,
        amount_minor,
        course:courses!inner(
          id,
          title,
          slug,
          description,
          thumbnail_url,
          program_type,
          level,
          duration,
          is_published
        )
      `)
      .eq('market', market)
      .eq('currency', currency)
      .eq('is_active', true)
      .eq('course.is_published', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ data: data ?? [] })
  } catch (error) {
    console.error('Course pricing lookup failed:', error)
    return res.status(500).json({
      error: 'Could not load course prices',
    })
  }
}

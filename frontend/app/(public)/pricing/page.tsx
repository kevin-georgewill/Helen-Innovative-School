
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { paymentsApi, pricingApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type { CoursePrice, PricingMarket } from '@/lib/api'

export default function PricingPage() {
  const router = useRouter()

  const [markets, setMarkets] = useState<PricingMarket[]>([])
  const [market, setMarket] = useState('')
  const [prices, setPrices] = useState<CoursePrice[]>([])
  const [loadingMarkets, setLoadingMarkets] = useState(true)
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [checkingOut, setCheckingOut] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    pricingApi.markets()
      .then((result) => {
        if (cancelled) return
        setMarkets(result)
        if (result.length) setMarket(result[0].market)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load available countries. Please try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMarkets(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!market) {
      setPrices([])
      return
    }

    let cancelled = false
    setLoadingPrices(true)
    setError('')

    pricingApi.prices(market)
      .then((result) => {
        if (!cancelled) setPrices(result)
      })
      .catch(() => {
        if (!cancelled) {
          setPrices([])
          setError('Unable to load prices for this country.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPrices(false)
      })

    return () => {
      cancelled = true
    }
  }, [market])

  const selectedMarket = markets.find((item) => item.market === market)

  const formatPrice = (amountMinor: number | string, currency: string) => {
    const amount = Number(amountMinor) / 100

    if (!Number.isFinite(amount)) return 'Price unavailable'

    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  async function checkout(courseId: string) {
    setError('')
    setCheckingOut(courseId)

    try {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        router.push('/login')
        return
      }

      const result = await paymentsApi.paystackInitiate(courseId, market)

      if (!result.pay_url) {
        throw new Error('The payment provider did not return a checkout URL.')
      }

      window.location.assign(result.pay_url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not start checkout. Please try again.'
      )
    } finally {
      setCheckingOut('')
    }
  }

  return (
    <div className="min-h-screen bg-his-muted">
      <section className="bg-his-navy py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-200">
            Learn with HIS
          </p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">
            Find your next course
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/70">
            Explore technology-powered programs and securely enroll
            in a course that fits your professional goals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-his-border bg-white p-5 md:flex md:items-end md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold text-his-navy">
              Course pricing
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Prices depend on the market selected below.
            </p>
          </div>

          <div className="w-full md:max-w-xs">
            <label
              htmlFor="market"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Select your country
            </label>

            <select
              id="market"
              value={market}
              onChange={(event) => setMarket(event.target.value)}
              disabled={loadingMarkets || markets.length === 0 || !!checkingOut}
              className="w-full rounded-xl border border-his-border bg-white px-4 py-3 text-slate-800 outline-none focus:border-his-blue"
            >
              {loadingMarkets && <option value="">Loading countries...</option>}

              {!loadingMarkets && markets.length === 0 && (
                <option value="">No countries configured</option>
              )}

              {markets.map((item) => (
                <option key={item.market} value={item.market}>
                  {item.country} ({item.currency})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loadingPrices && (
          <div className="py-16 text-center text-slate-500">
            Loading available courses and prices...
          </div>
        )}

        {!loadingPrices && !error && prices.length === 0 && !loadingMarkets && (
          <div className="rounded-2xl border border-dashed border-his-border bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-his-navy">
              No priced courses available yet
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
              There are no active course prices configured for{' '}
              {selectedMarket?.country ?? 'this country'} yet.
              Please check back later or contact HIS for enrollment information.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex rounded-full border border-his-border px-5 py-3 text-sm font-semibold text-his-navy hover:border-his-blue"
            >
              Browse all courses
            </Link>
          </div>
        )}

        {!loadingPrices && prices.length > 0 && (
          <>
            <p className="mb-5 text-sm text-slate-500">
              {prices.length} course{prices.length === 1 ? '' : 's'} available
              {selectedMarket ? ` in ${selectedMarket.country}` : ''}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prices.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-his-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="h-44 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100">
                    {item.course.thumbnail_url ? (
                      <img
                        src={item.course.thumbnail_url}
                        alt={item.course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl font-black text-his-blue/30">
                        HIS
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-his-blue">
                      {item.course.program_type}
                    </p>

                    <h3 className="mb-2 text-lg font-bold leading-snug text-his-navy">
                      {item.course.title}
                    </h3>

                    {item.course.description && (
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
                        {item.course.description}
                      </p>
                    )}

                    <div className="mt-auto border-t border-his-border pt-4">
                      <p className="mb-4 text-2xl font-black text-his-navy">
                        {formatPrice(item.amount_minor, item.currency)}
                      </p>

                      <button
                        type="button"
                        onClick={() => checkout(item.course_id)}
                        disabled={!!checkingOut}
                        className="w-full rounded-xl bg-his-navy px-5 py-3 font-semibold text-white transition hover:bg-his-blue disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {checkingOut === item.course_id
                          ? 'Preparing checkout...'
                          : 'Enroll and pay'}
                      </button>

                      <p className="mt-3 text-center text-xs text-slate-400">
                        Secure checkout powered by Paystack
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

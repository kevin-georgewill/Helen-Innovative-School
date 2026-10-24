
'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { paymentsApi } from '@/lib/api'

function PaymentVerificationContent() {
  const searchParams = useSearchParams()
  const reference =
    searchParams.get('reference') ?? searchParams.get('trxref')

  const processedReference = useRef('')
  const [status, setStatus] = useState<
    'checking' | 'success' | 'error'
  >('checking')
  const [message, setMessage] = useState('Verifying your payment securely...')

  useEffect(() => {
    if (!reference || processedReference.current === reference) {
      if (!reference) {
        setStatus('error')
        setMessage('No payment reference was provided.')
      }
      return
    }

    processedReference.current = reference
    let cancelled = false

    paymentsApi.paystackVerify(reference)
      .then((result) => {
        if (cancelled) return

        if (result.status === 'paid') {
          setStatus('success')
          setMessage('Your payment has been verified and your enrollment is active.')
        } else {
          setStatus('error')
          setMessage('We could not confirm this payment yet.')
        }
      })
      .catch(() => {
        if (cancelled) return

        setStatus('error')
        setMessage(
          'We could not verify your payment right now. If you were charged, please contact HIS support before attempting to pay again.'
        )
      })

    return () => {
      cancelled = true
    }
  }, [reference])

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-2xl items-center px-4 py-16">
      <div className="w-full rounded-2xl border border-his-border bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          {status === 'checking' ? '…' : status === 'success' ? '✓' : '!'}
        </div>

        <h1 className="text-2xl font-black text-his-navy">
          {status === 'checking'
            ? 'Checking your payment'
            : status === 'success'
              ? 'Payment successful'
              : 'Payment not confirmed'}
        </h1>

        <p role="status" className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
          {message}
        </p>

        {status === 'success' && (
          <Link
            href="/dashboard/my-courses"
            className="mt-7 inline-flex rounded-xl bg-his-navy px-6 py-3 font-semibold text-white hover:bg-his-blue"
          >
            Go to my courses
          </Link>
        )}

        {status === 'error' && (
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                processedReference.current = ''
                setStatus('checking')
                setMessage('Retrying payment verification...')
                window.location.reload()
              }}
              className="rounded-xl bg-his-navy px-6 py-3 font-semibold text-white hover:bg-his-blue"
            >
              Retry verification
            </button>

            <Link
              href="/pricing"
              className="rounded-xl border border-his-border px-6 py-3 font-semibold text-his-navy hover:border-his-blue"
            >
              Back to pricing
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default function PaymentVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-500">
          Loading payment verification...
        </div>
      }
    >
      <PaymentVerificationContent />
    </Suspense>
  )
}

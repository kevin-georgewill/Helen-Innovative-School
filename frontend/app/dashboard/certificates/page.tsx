'use client'

import Link from 'next/link'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useMyCertificates } from '@/lib/queries/certificates'

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  )
}

function CertificatesContent() {
  const { data: certs, isLoading } = useMyCertificates()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!certs || certs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-his-border p-16 text-center">
        <AwardIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No certificates yet</p>
        <p className="text-slate-400 text-sm mt-1">Complete a course to earn your first certificate.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {certs.map((cert) => {
        const course = cert.course as any
        return (
          <div
            key={cert.id}
            className="bg-white rounded-2xl border border-his-border shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-his-navy/5 rounded-xl flex items-center justify-center shrink-0">
                <AwardIcon className="w-6 h-6 text-his-navy" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{course?.title ?? 'Course'}</h3>
                <p className="text-sm text-slate-500">
                  {cert.certificate_no} · Issued {new Date(cert.issued_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {cert.qr_code_url && (
                <a
                  href={cert.qr_code_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-his-blue hover:underline"
                >
                  Download PDF
                </a>
              )}
              <Link
                href={`/verify/${cert.certificate_no}`}
                className="text-sm font-semibold text-slate-500 hover:text-his-blue transition"
              >
                Verify →
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function CertificatesPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-his-navy">Certificates</h1>
          <p className="text-slate-500 mt-1">Your earned certificates</p>
        </div>
        <CertificatesContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

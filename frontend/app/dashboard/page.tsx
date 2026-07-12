'use client'

import Link from 'next/link'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useMe } from '@/lib/queries/auth'
import { useMyEnrollments } from '@/lib/queries/enrollments'
import { useMyCertificates } from '@/lib/queries/certificates'

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-his-border rounded-2xl p-6 shadow-sm">
      <p className="text-3xl font-black text-his-navy mb-1">{value}</p>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  )
}

function DashboardContent() {
  const { data: me } = useMe()
  const { data: enrollments, isLoading: loadingEnrollments } = useMyEnrollments()
  const { data: certificates } = useMyCertificates()

  const firstName = me?.full_name?.split(' ')[0] ?? 'there'
  const activeCount = enrollments?.filter((e) => e.status === 'active').length ?? 0
  const completedCount = enrollments?.filter((e) => e.status === 'completed').length ?? 0
  const certCount = certificates?.length ?? 0

  return (
    <DashboardShell>
      <h1 className="text-3xl font-bold text-his-navy mb-1">Welcome back, {firstName} 👋</h1>
      <p className="text-slate-500 mb-8">Here&apos;s an overview of your learning.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Active courses" value={activeCount} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard label="Certificates" value={certCount} />
      </div>

      {/* Enrolled courses */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-his-navy">My courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-his-blue hover:text-his-blue-light">
            Browse catalog →
          </Link>
        </div>

        {loadingEnrollments ? (
          <p className="text-slate-400 text-sm">Loading your courses…</p>
        ) : enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((e) => {
              const course = e.course as any
              return (
                <Link
                  key={e.id}
                  href={`/dashboard/my-courses/${course?.slug ?? e.course_id}`}
                  className="bg-white border border-his-border rounded-2xl p-5 card-hover shadow-sm block"
                >
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
                      e.status === 'active'
                        ? 'bg-his-green/10 text-his-green'
                        : e.status === 'completed'
                          ? 'bg-his-blue/10 text-his-blue'
                          : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {e.status}
                  </span>
                  <h3 className="font-bold text-slate-900 mb-1 leading-snug">
                    {course?.title ?? 'Course'}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                  </p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-his-border rounded-2xl p-10 text-center">
            <p className="text-slate-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg transition"
            >
              Explore courses
            </Link>
          </div>
        )}
      </section>
    </DashboardShell>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardContent />
    </ProtectedRoute>
  )
}

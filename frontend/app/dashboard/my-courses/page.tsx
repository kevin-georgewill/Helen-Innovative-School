'use client'

import Link from 'next/link'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useMyEnrollments } from '@/lib/queries/enrollments'
import type { EnrollmentStatus } from '@/types'

const statusStyle: Record<EnrollmentStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-his-blue/10 text-his-blue',
  suspended: 'bg-red-50 text-red-600',
}

function MyCoursesContent() {
  const { data: enrollments, isLoading } = useMyEnrollments()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-his-border shadow-sm p-5 animate-pulse">
            {/* thumbnail */}
            <div className="w-full h-36 bg-slate-200 rounded-xl mb-4" />
            {/* status badge */}
            <div className="h-5 w-16 bg-slate-200 rounded-full" />
            {/* title */}
            <div className="mt-2 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
            </div>
            {/* date */}
            <div className="mt-2 h-3 bg-slate-100 rounded w-2/5" />
            {/* footer row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-3 w-14 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-his-border p-16 text-center">
        <p className="text-slate-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
        <Link
          href="/courses"
          className="inline-flex items-center px-6 py-3 bg-his-navy text-white font-semibold rounded-lg hover:bg-his-navy-light transition"
        >
          Browse courses
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {enrollments.map((e) => {
        const course = e.course as any
        return (
          <Link
            key={e.id}
            href={`/dashboard/my-courses/${course?.slug ?? e.course_id}`}
            className="bg-white rounded-2xl border border-his-border shadow-sm p-5 card-hover block"
          >
            {course?.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-36 object-cover rounded-xl mb-4"
              />
            )}
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[e.status]}`}
            >
              {e.status}
            </span>
            <h3 className="font-bold text-slate-900 mt-2 mb-1 leading-snug line-clamp-2">
              {course?.title ?? 'Course'}
            </h3>
            <p className="text-xs text-slate-400">
              Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                {course?.program_type}
              </span>
              <span className="text-xs font-semibold text-his-blue">Continue →</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function MyCoursesPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-his-navy">My Courses</h1>
          <p className="text-slate-500 mt-1">Your enrolled courses</p>
        </div>
        <MyCoursesContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

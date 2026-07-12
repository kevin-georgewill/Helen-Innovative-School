import Link from 'next/link'
import type { Course } from '@/types'

const levelBadge: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  advanced: 'bg-rose-50 text-rose-700 border-rose-200',
}

const programLabel: Record<string, string> = {
  express: 'Express',
  certificate: 'Certificate',
  diploma: 'Diploma',
}

interface Props {
  course: Course
}

export default function CourseCard({ course }: Props) {
  const isFree = !course.price || Number(course.price) === 0

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group bg-white border border-his-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-his-blue/10 to-slate-100 overflow-hidden shrink-0">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-his-blue/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${levelBadge[course.level] ?? levelBadge.beginner}`}>
          {course.level}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {course.faculty && (
          <p className="text-his-blue text-xs font-semibold uppercase tracking-wide mb-1">
            {course.faculty.name}
          </p>
        )}

        <h3 className="text-slate-900 font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-his-blue transition-colors">
          {course.title}
        </h3>

        {course.instructor && (
          <p className="text-slate-500 text-xs mb-3 truncate">
            {course.instructor.full_name}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto mb-4">
          {course.duration && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              {course.duration}
            </span>
          )}
          {course.program_type && (
            <span>{programLabel[course.program_type] ?? course.program_type}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-his-border pt-4">
          <span className="text-his-navy font-bold text-lg">
            {isFree ? 'Free' : `₦${Number(course.price).toLocaleString()}`}
          </span>
          <span className="text-his-blue text-sm font-semibold group-hover:underline">
            View course →
          </span>
        </div>
      </div>
    </Link>
  )
}

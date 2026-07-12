'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { useCourse } from '@/lib/queries/courses'
import { useMe } from '@/lib/queries/auth'
import { useMyEnrollments, useEnroll } from '@/lib/queries/enrollments'
import type { Module, Lesson } from '@/types'

const levelLabel: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const contentTypeIcon = (type: string) => {
  if (type === 'video') return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
  if (type === 'pdf') return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  )
}

function ModuleAccordion({ mod, index }: { mod: Module & { lessons: Lesson[] }; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const lessonCount = mod.lessons?.length ?? 0

  return (
    <div className="border border-his-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-his-muted transition-colors text-left"
      >
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Module {index + 1}
          </span>
          <h3 className="text-slate-900 font-semibold mt-0.5">{mod.title}</h3>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs text-slate-400">{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <ul className="divide-y divide-his-border bg-his-muted">
          {(mod.lessons ?? []).map((lesson) => (
            <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
              <span className="text-slate-400">{contentTypeIcon(lesson.content_type)}</span>
              <span className="text-slate-700 text-sm flex-1">{lesson.title}</span>
              <div className="flex items-center gap-2 shrink-0">
                {lesson.is_free_preview && (
                  <span className="text-xs font-semibold text-his-green bg-his-green/10 px-2 py-0.5 rounded-full">
                    Preview
                  </span>
                )}
                {lesson.duration_min && (
                  <span className="text-xs text-slate-400">{lesson.duration_min}m</span>
                )}
              </div>
            </li>
          ))}
          {lessonCount === 0 && (
            <li className="px-5 py-3 text-sm text-slate-400 italic">No lessons yet.</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const { data: course, isLoading, isError } = useCourse(slug)
  const { data: profile } = useMe()
  const { data: enrollments } = useMyEnrollments()
  const enroll = useEnroll()

  const isEnrolled = enrollments?.some(
    (e) => e.course_id === course?.id && (e.status === 'active' || e.status === 'completed')
  )

  const isFree = !course?.price || Number(course.price) === 0
  const totalLessons = course?.modules?.reduce((acc, m) => acc + ((m as any).lessons?.length ?? 0), 0) ?? 0

  async function handleEnroll() {
    if (!profile) {
      router.push(`/register?redirect=/courses/${slug}`)
      return
    }
    if (!course) return
    try {
      await enroll.mutateAsync(course.id)
      router.push('/dashboard/my-courses')
    } catch (err: any) {
      // 409 means already enrolled — redirect to player
      if (err?.message?.includes('409') || err?.message?.toLowerCase().includes('already')) {
        router.push('/dashboard/my-courses')
      }
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-his-muted pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
            <div className="h-64 bg-slate-200 rounded-2xl mb-8" />
            <div className="h-8 bg-slate-200 rounded w-2/3 mb-4" />
            <div className="h-4 bg-slate-200 rounded w-full mb-2" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (isError || !course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-his-muted pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-his-navy mb-3">Course not found</h1>
            <Link href="/courses" className="text-his-blue font-semibold hover:underline">
              Browse all courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const modules = (course as any).modules ?? []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-his-muted">
        {/* Hero */}
        <section className="bg-his-navy pt-24 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: info */}
              <div className="lg:col-span-2">
                {course.faculty && (
                  <Link
                    href={`/faculties/${course.faculty.slug}`}
                    className="inline-block text-his-blue text-xs font-semibold uppercase tracking-wide mb-3 hover:underline"
                  >
                    {course.faculty.name}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-white/70 text-base leading-relaxed mb-6 max-w-2xl">
                    {course.description}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    {levelLabel[course.level] ?? course.level}
                  </span>
                  {course.duration && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <path strokeLinecap="round" d="M12 6v6l4 2" />
                      </svg>
                      {course.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 capitalize">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {modules.length} module{modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-9 h-9 rounded-full bg-his-blue/20 overflow-hidden shrink-0 flex items-center justify-center">
                      {(course.instructor as any).avatar_url ? (
                        <img src={(course.instructor as any).avatar_url} alt={(course.instructor as any).full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {((course.instructor as any).full_name ?? 'I')[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-white/80 text-sm">
                      {(course.instructor as any).full_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: sticky card — hidden on mobile (shown below) */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        {/* Content + sidebar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Curriculum */}
              <div>
                <h2 className="text-xl font-bold text-his-navy mb-4">Curriculum</h2>
                {modules.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No modules available yet.</p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((mod: any, i: number) => (
                      <ModuleAccordion key={mod.id} mod={mod} index={i} />
                    ))}
                  </div>
                )}
              </div>

              {/* Instructor bio */}
              {course.instructor && (course.instructor as any).bio && (
                <div>
                  <h2 className="text-xl font-bold text-his-navy mb-4">About the Instructor</h2>
                  <div className="bg-white border border-his-border rounded-2xl p-6 flex gap-5">
                    <div className="w-14 h-14 rounded-full bg-his-blue/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {(course.instructor as any).avatar_url ? (
                        <img src={(course.instructor as any).avatar_url} alt={(course.instructor as any).full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-his-blue font-bold text-xl">
                          {((course.instructor as any).full_name ?? 'I')[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold mb-1">{(course.instructor as any).full_name}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{(course.instructor as any).bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white border border-his-border rounded-2xl overflow-hidden shadow-sm sticky top-24">
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="text-3xl font-black text-his-navy mb-1">
                    {isFree ? 'Free' : `₦${Number(course.price).toLocaleString()}`}
                  </p>
                  {!isFree && (
                    <p className="text-slate-400 text-xs mb-4">One-time payment</p>
                  )}

                  {isEnrolled ? (
                    <Link
                      href="/dashboard/my-courses"
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-his-green hover:bg-his-green-hover text-white font-semibold rounded-xl transition-colors duration-200"
                    >
                      Continue Learning →
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enroll.isPending}
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {enroll.isPending
                        ? 'Enrolling…'
                        : profile
                        ? (isFree ? 'Enroll Free' : 'Enroll Now')
                        : 'Get Started'}
                    </button>
                  )}

                  {enroll.isError && (
                    <p className="mt-3 text-sm text-red-600 text-center">{enroll.error.message}</p>
                  )}

                  {!profile && (
                    <p className="mt-3 text-xs text-slate-400 text-center">
                      Already have an account?{' '}
                      <Link href="/login" className="text-his-blue font-semibold hover:underline">
                        Log in
                      </Link>
                    </p>
                  )}

                  <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
                    {course.duration && (
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-his-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                        </svg>
                        {course.duration} duration
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-his-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
                    </li>
                    <li className="flex items-center gap-2 capitalize">
                      <svg className="w-4 h-4 text-his-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {levelLabel[course.level] ?? course.level}
                    </li>
                    <li className="flex items-center gap-2 capitalize">
                      <svg className="w-4 h-4 text-his-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {course.program_type} program
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-his-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

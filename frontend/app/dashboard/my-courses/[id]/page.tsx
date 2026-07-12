'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useCourse } from '@/lib/queries/courses'
import { useCourseProgress, useMarkComplete } from '@/lib/queries/progress'
import type { Lesson } from '@/types'

function CoursePlayerContent() {
  const { id: slug } = useParams<{ id: string }>()
  const router = useRouter()

  const { data: course, isLoading: courseLoading } = useCourse(slug)
  const { data: progress, isLoading: progressLoading } = useCourseProgress(course?.id ?? '')
  const markComplete = useMarkComplete()

  const completedIds = new Set(
    (progress?.lessons ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  )

  const allLessons: Lesson[] = (course?.modules ?? []).flatMap((m) => m.lessons ?? [])

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [openModules, setOpenModules] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!course) return
    if (course.modules?.length) {
      setOpenModules(new Set(course.modules.map((m) => m.id)))
    }
    const lessons: Lesson[] = (course.modules ?? []).flatMap((m) => m.lessons ?? [])
    if (lessons.length > 0 && !activeLesson) {
      const firstUnread = lessons.find((l) => !completedIds.has(l.id)) ?? lessons[0]
      setActiveLesson(firstUnread)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  function toggleModule(id: string) {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleMarkComplete() {
    if (!activeLesson || !course) return
    markComplete.mutate(
      { lessonId: activeLesson.id, courseId: course.id },
      {
        onSuccess: () => {
          const idx = allLessons.findIndex((l) => l.id === activeLesson.id)
          if (idx < allLessons.length - 1) setActiveLesson(allLessons[idx + 1])
        },
      }
    )
  }

  if (courseLoading || progressLoading) {
    return (
      <div className="animate-pulse">
        {/* Header row: back link + title / progress */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
            <div className="h-7 w-72 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="flex-1 h-2 bg-slate-200 rounded-full" />
            <div className="h-3 w-8 bg-slate-200 rounded" />
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-2xl border border-his-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-his-border">
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
            <div className="p-3 space-y-1">
              {/* Module 1 */}
              <div className="flex items-center justify-between px-1 py-3">
                <div className="h-3.5 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-4 bg-slate-100 rounded" />
              </div>
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2.5">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                  <div className="h-3 bg-slate-100 rounded" style={{ width: `${i === 1 ? 70 : 55}%` }} />
                </div>
              ))}
              {/* Module 2 */}
              <div className="flex items-center justify-between px-1 py-3 mt-1">
                <div className="h-3.5 w-36 bg-slate-200 rounded" />
                <div className="h-4 w-4 bg-slate-100 rounded" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2.5">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                  <div className="h-3 bg-slate-100 rounded" style={{ width: `${[65, 50, 72][i - 1]}%` }} />
                </div>
              ))}
            </div>
          </aside>

          {/* Main content skeleton */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-his-border shadow-sm overflow-hidden">
            {/* Lesson header */}
            <div className="p-5 border-b border-his-border">
              <div className="h-3 w-10 bg-slate-200 rounded mb-2" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
            </div>
            {/* Lesson body */}
            <div className="p-5 space-y-3">
              <div className="h-3.5 bg-slate-100 rounded w-full" />
              <div className="h-3.5 bg-slate-100 rounded w-11/12" />
              <div className="h-3.5 bg-slate-100 rounded w-4/5" />
              <div className="h-3.5 bg-slate-100 rounded w-full" />
              <div className="h-3.5 bg-slate-100 rounded w-3/4" />
            </div>
            {/* Footer nav */}
            <div className="p-5 border-t border-his-border flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-9 w-24 bg-slate-200 rounded-lg" />
                <div className="h-9 w-20 bg-slate-200 rounded-lg" />
              </div>
              <div className="h-9 w-32 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return <p className="text-slate-500">Course not found.</p>
  }

  const totalLessons = allLessons.length
  const completedCount = completedIds.size
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isCompleted = activeLesson ? completedIds.has(activeLesson.id) : false
  const activeIdx = allLessons.findIndex((l) => l.id === activeLesson?.id)

  return (
    <div>
      {/* Header row */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard/my-courses')}
            className="text-sm text-slate-500 hover:text-his-blue flex items-center gap-1 mb-2"
          >
            ← My Courses
          </button>
          <h1 className="text-2xl font-bold text-his-navy">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3 min-w-[180px]">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-his-green rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
            {completedCount}/{totalLessons}
          </span>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-2xl border border-his-border shadow-sm overflow-hidden sticky top-36">
          <div className="p-4 border-b border-his-border">
            <p className="font-bold text-slate-900 text-sm">Course content</p>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
            {(course.modules ?? []).map((mod) => (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition"
                >
                  <span className="text-sm font-semibold text-slate-800 text-left pr-2 leading-snug">
                    {mod.title}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openModules.has(mod.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openModules.has(mod.id) &&
                  (mod.lessons ?? []).map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                        activeLesson?.id === lesson.id
                          ? 'bg-his-blue/10 border-r-2 border-his-blue'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {completedIds.has(lesson.id) ? (
                        <span className="w-5 h-5 rounded-full bg-his-green/20 flex items-center justify-center shrink-0">
                          <svg
                            className="w-3 h-3 text-his-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 12 12"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2 6l3 3 5-5"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                      )}
                      <span className="text-xs text-slate-700 leading-snug">{lesson.title}</span>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {activeLesson ? (
            <div className="bg-white rounded-2xl border border-his-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-his-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {activeLesson.content_type}
                  </span>
                  {activeLesson.duration_min && (
                    <span className="text-xs text-slate-400">· {activeLesson.duration_min} min</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{activeLesson.title}</h2>
              </div>

              <div className="p-5">
                {activeLesson.content_type === 'video' && activeLesson.content_url && (
                  <video
                    key={activeLesson.id}
                    src={activeLesson.content_url}
                    controls
                    className="w-full rounded-xl bg-black aspect-video"
                  />
                )}
                {activeLesson.content_type === 'pdf' && activeLesson.content_url && (
                  <iframe
                    key={activeLesson.id}
                    src={activeLesson.content_url}
                    className="w-full rounded-xl border border-his-border"
                    style={{ height: '70vh' }}
                    title={activeLesson.title}
                  />
                )}
                {activeLesson.content_type === 'text' && (
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {activeLesson.content_text}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-his-border flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    disabled={activeIdx <= 0}
                    onClick={() => setActiveLesson(allLessons[activeIdx - 1])}
                    className="text-sm font-semibold px-4 py-2 rounded-lg border border-his-border hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={activeIdx >= allLessons.length - 1}
                    onClick={() => setActiveLesson(allLessons[activeIdx + 1])}
                    className="text-sm font-semibold px-4 py-2 rounded-lg border border-his-border hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>

                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleted || markComplete.isPending}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                    isCompleted
                      ? 'bg-his-green/10 text-his-green cursor-default'
                      : 'bg-his-navy hover:bg-his-navy-light text-white disabled:opacity-60'
                  }`}
                >
                  {isCompleted ? '✓ Completed' : markComplete.isPending ? 'Saving…' : 'Mark complete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-his-border p-10 text-center">
              <p className="text-slate-500">Select a lesson from the sidebar to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CoursePlayerPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell>
        <CoursePlayerContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

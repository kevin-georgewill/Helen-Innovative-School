'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import CourseCard from '@/components/shared/CourseCard'
import { useCourses } from '@/lib/queries/courses'
import type { CourseLevel, ProgramType } from '@/types'

const LEVELS: { value: CourseLevel | ''; label: string }[] = [
  { value: '', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const PROGRAM_TYPES: { value: ProgramType | ''; label: string }[] = [
  { value: '', label: 'All programs' },
  { value: 'express', label: 'Express' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
]

export default function CoursesPage() {
  const [level, setLevel] = useState<CourseLevel | ''>('')
  const [programType, setProgramType] = useState<ProgramType | ''>('')

  const filters = {
    ...(level && { level }),
    ...(programType && { program_type: programType }),
  }

  const { data: courses, isLoading, isError } = useCourses(
    Object.keys(filters).length ? filters : undefined
  )

  const filterBtnClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
      active
        ? 'bg-his-navy text-white border-his-navy'
        : 'bg-white text-slate-600 border-his-border hover:border-his-navy hover:text-his-navy'
    }`

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-his-muted">
        {/* Header */}
        <section className="bg-his-navy pt-28 pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              All Courses
            </h1>
            <p className="text-white/70 text-lg max-w-xl">
              Explore programs across 11 technology-powered faculties and advance your career.
            </p>
          </div>
        </section>

        {/* Filters + grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              {LEVELS.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setLevel(value)}
                  className={filterBtnClass(level === value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="w-px bg-his-border hidden sm:block mx-1" />
            <div className="flex flex-wrap gap-2">
              {PROGRAM_TYPES.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setProgramType(value)}
                  className={filterBtnClass(programType === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* State: loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                    <div className="h-4 bg-slate-200 rounded w-3/5" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* State: error */}
          {isError && (
            <div className="text-center py-20">
              <p className="text-slate-500">Failed to load courses. Please try again.</p>
            </div>
          )}

          {/* State: empty */}
          {!isLoading && !isError && (!courses || courses.length === 0) && (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-slate-500 font-medium">No courses found for these filters.</p>
              <button
                onClick={() => { setLevel(''); setProgramType('') }}
                className="mt-4 text-his-blue text-sm font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !isError && courses && courses.length > 0 && (
            <>
              <p className="text-slate-500 text-sm mb-5">
                {courses.length} course{courses.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useAssessment, useSubmitAssessment } from '@/lib/queries/assessments'
import type { Question } from '@/types'

function AssessmentContent() {
  const { id: courseId } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: assessment, isLoading } = useAssessment(courseId)
  const submitAssessment = useSubmitAssessment()

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [activeQ, setActiveQ] = useState(0)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)

  if (isLoading) {
    return <div className="h-64 bg-white rounded-2xl animate-pulse" />
  }

  if (!assessment) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-his-border p-16 text-center">
        <p className="text-slate-500">No assessment found for this course.</p>
        <button
          onClick={() => router.push('/dashboard/my-courses')}
          className="mt-4 text-sm text-his-blue hover:underline font-semibold"
        >
          ← Back to My Courses
        </button>
      </div>
    )
  }

  const questions: Question[] = assessment.questions ?? []
  const total = questions.length

  if (result) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-his-border shadow-sm p-8 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.passed ? 'bg-his-green/10' : 'bg-red-50'
            }`}
          >
            {result.passed ? (
              <svg className="w-8 h-8 text-his-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-black text-his-navy mb-1">
            {result.passed ? 'You passed!' : 'Not quite'}
          </h2>
          <p className="text-slate-500 mb-1">
            You scored <span className="font-bold text-slate-900">{result.score}%</span>
          </p>
          <p className="text-sm text-slate-400 mb-6">Pass mark: {assessment.pass_score}%</p>

          {result.passed ? (
            <p className="text-sm text-his-green font-semibold mb-6">
              Great work! Your certificate is being processed.
            </p>
          ) : (
            <p className="text-sm text-slate-500 mb-6">Keep studying and try again when ready.</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/dashboard/my-courses/${courseId}`)}
              className="flex-1 py-2.5 border border-his-border rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Back to course
            </button>
            {!result.passed && (
              <button
                onClick={() => {
                  setAnswers({})
                  setActiveQ(0)
                  setResult(null)
                }}
                className="flex-1 py-2.5 bg-his-navy text-white font-semibold rounded-lg text-sm hover:bg-his-navy-light transition"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-his-border p-16 text-center">
        <p className="text-slate-500">This assessment has no questions yet.</p>
      </div>
    )
  }

  const question = questions[activeQ]
  const allAnswered = Object.keys(answers).length === total

  async function handleSubmit() {
    if (!assessment) return
    const res = await submitAssessment.mutateAsync({ id: assessment.id, answers })
    setResult(res as { score: number; passed: boolean })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <button
            onClick={() => router.push(`/dashboard/my-courses/${courseId}`)}
            className="text-sm text-slate-500 hover:text-his-blue flex items-center gap-1 mb-1"
          >
            ← Back to course
          </button>
          <h1 className="text-2xl font-bold text-his-navy">{assessment.title}</h1>
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {Object.keys(answers).length}/{total} answered
        </span>
      </div>

      <div className="h-1.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-his-blue rounded-full transition-all"
          style={{ width: `${total > 0 ? ((activeQ + 1) / total) * 100 : 0}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-his-border shadow-sm p-6 mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Question {activeQ + 1} of {total}
        </p>
        <h2 className="text-lg font-bold text-slate-900 mb-5 leading-snug">
          {question.question_text}
        </h2>

        <div className="space-y-3">
          {(question.options ?? []).map((opt, idx) => {
            const selected = answers[question.id] === idx
            return (
              <button
                key={idx}
                onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: idx }))}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition ${
                  selected
                    ? 'border-his-blue bg-his-blue/5 text-his-blue'
                    : 'border-his-border hover:border-his-blue/30 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    selected ? 'border-his-blue bg-his-blue' : 'border-slate-300'
                  }`}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
                <span className="text-sm font-medium">{opt.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          disabled={activeQ === 0}
          onClick={() => setActiveQ((q) => q - 1)}
          className="px-5 py-2.5 border border-his-border rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>

        {activeQ < total - 1 ? (
          <button
            onClick={() => setActiveQ((q) => q + 1)}
            className="px-5 py-2.5 bg-his-navy text-white font-semibold rounded-lg text-sm hover:bg-his-navy-light transition"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitAssessment.isPending}
            className="px-6 py-2.5 bg-his-green text-white font-semibold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitAssessment.isPending ? 'Submitting…' : 'Submit assessment'}
          </button>
        )}
      </div>

      {!allAnswered && activeQ === total - 1 && (
        <p className="text-xs text-amber-600 text-center mt-3">
          Answer all questions before submitting.
        </p>
      )}

      {submitAssessment.isError && (
        <p className="text-red-500 text-sm text-center mt-3">
          {(submitAssessment.error as Error)?.message}
        </p>
      )}
    </div>
  )
}

export default function AssessmentPage() {
  return (
    <ProtectedRoute role="student">
      <DashboardShell>
        <AssessmentContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

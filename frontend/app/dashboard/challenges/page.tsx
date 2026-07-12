'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useChallenges, useSubmitChallenge } from '@/lib/queries/challenges'
import type { InnovationChallenge, ChallengeContentType } from '@/types'

function timeRemaining(deadline: string | null): string {
  if (!deadline) return 'Open'
  const ms = new Date(deadline).getTime() - Date.now()
  if (ms <= 0) return 'Closed'
  const days = Math.floor(ms / 86_400_000)
  if (days > 0) return `${days}d remaining`
  const hours = Math.floor(ms / 3_600_000)
  return `${hours}h remaining`
}

function SubmitModal({
  challenge,
  onClose,
}: {
  challenge: InnovationChallenge
  onClose: () => void
}) {
  const submitChallenge = useSubmitChallenge()
  const [contentType, setContentType] = useState<ChallengeContentType>('text')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('content_type', contentType)
    if (description) fd.append('description', description)
    if (contentType === 'pdf' && file) fd.append('file', file)
    if (contentType === 'video') fd.append('video_url', videoUrl)
    await submitChallenge.mutateAsync({ id: challenge.id, formData: fd })
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-his-border flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Submit: {challenge.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-his-green/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-his-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Submission received!</h3>
            <p className="text-slate-500 text-sm">Good luck with your entry.</p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 bg-his-navy text-white font-semibold rounded-lg text-sm hover:bg-his-navy-light transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Submission type
              </label>
              <div className="flex gap-2">
                {(['text', 'pdf', 'video'] as ChallengeContentType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setContentType(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                      contentType === t
                        ? 'bg-his-navy text-white border-his-navy'
                        : 'text-slate-600 border-his-border hover:border-his-blue hover:text-his-blue'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {contentType === 'text' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Your entry
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe your innovation…"
                  required
                  className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue resize-none"
                />
              </div>
            )}

            {contentType === 'pdf' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Upload PDF
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-his-navy file:text-white file:font-semibold file:text-sm cursor-pointer"
                  />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description (optional)"
                  className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue resize-none"
                />
              </div>
            )}

            {contentType === 'video' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                    className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue"
                  />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description (optional)"
                  className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue resize-none"
                />
              </div>
            )}

            {submitChallenge.isError && (
              <p className="text-red-500 text-sm">{(submitChallenge.error as Error)?.message}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-his-border rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitChallenge.isPending}
                className="flex-1 py-2.5 bg-his-navy text-white font-semibold rounded-lg text-sm hover:bg-his-navy-light transition disabled:opacity-60"
              >
                {submitChallenge.isPending ? 'Submitting…' : 'Submit entry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ChallengesContent() {
  const { data: challenges, isLoading } = useChallenges()
  const [activeChallenge, setActiveChallenge] = useState<InnovationChallenge | null>(null)

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!challenges || challenges.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-his-border p-16 text-center">
        <p className="text-slate-500 font-medium">No active challenges</p>
        <p className="text-slate-400 text-sm mt-1">Check back soon for innovation challenges.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((ch) => {
          const remaining = timeRemaining(ch.deadline)
          const closed = remaining === 'Closed'
          return (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-his-border shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-900 leading-snug">{ch.title}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    closed ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {remaining}
                </span>
              </div>
              {ch.description && (
                <p className="text-slate-500 text-sm line-clamp-3 flex-1">{ch.description}</p>
              )}
              <button
                onClick={() => !closed && setActiveChallenge(ch)}
                disabled={closed}
                className="mt-4 w-full py-2.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-lg text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {closed ? 'Challenge closed' : 'Submit entry'}
              </button>
            </div>
          )
        })}
      </div>

      {activeChallenge && (
        <SubmitModal challenge={activeChallenge} onClose={() => setActiveChallenge(null)} />
      )}
    </>
  )
}

export default function ChallengesPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-his-navy">Innovation Challenges</h1>
          <p className="text-slate-500 mt-1">Submit your ideas and compete with peers</p>
        </div>
        <ChallengesContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

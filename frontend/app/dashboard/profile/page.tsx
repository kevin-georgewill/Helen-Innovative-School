'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useMe, useUpdateMe } from '@/lib/queries/auth'

function ProfileContent() {
  const { data: me } = useMe()
  const updateMe = useUpdateMe()
  const [form, setForm] = useState({ full_name: '', bio: '', phone: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (me) {
      setForm({
        full_name: me.full_name ?? '',
        bio: me.bio ?? '',
        phone: me.phone ?? '',
      })
    }
  }, [me])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await updateMe.mutateAsync(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = (form.full_name || me?.email || '?')[0].toUpperCase()

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-his-navy">Profile</h1>
        <p className="text-slate-500 mt-1">Update your personal information</p>
      </div>

      <div className="bg-white rounded-2xl border border-his-border shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-his-navy flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-bold text-slate-900">{me?.full_name}</p>
            <p className="text-sm text-slate-500">{me?.email}</p>
            <span className="text-xs font-semibold uppercase tracking-wide text-his-blue">
              {me?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Tell us about yourself…"
              className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+234…"
              className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue"
            />
          </div>

          {updateMe.isError && (
            <p className="text-red-500 text-sm">{(updateMe.error as Error)?.message}</p>
          )}

          <button
            type="submit"
            disabled={updateMe.isPending}
            className="w-full bg-his-navy hover:bg-his-navy-light text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {updateMe.isPending ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <ProfileContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

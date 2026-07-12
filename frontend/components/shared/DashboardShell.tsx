'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Logo from './Logo'
import { useMe, useLogout } from '@/lib/queries/auth'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/lib/queries/notifications'
import type { Notification } from '@/types'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', exact: true },
  { href: '/dashboard/my-courses', label: 'My Courses', exact: false },
  { href: '/dashboard/certificates', label: 'Certificates', exact: false },
  { href: '/dashboard/community', label: 'Community', exact: false },
  { href: '/dashboard/challenges', label: 'Challenges', exact: false },
  { href: '/dashboard/profile', label: 'Profile', exact: false },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: me } = useMe()
  const { data: notifications } = useNotifications()
  const logout = useLogout()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const [showNotifs, setShowNotifs] = useState(false)

  const unread = (notifications ?? []).filter((n) => !n.is_read).length

  async function handleLogout() {
    await logout.mutateAsync()
    router.replace('/login')
  }

  function handleNotifClick(n: Notification) {
    if (!n.is_read) markRead.mutate(n.id)
    setShowNotifs(false)
    if (n.link) router.push(n.link)
  }

  function isActive(item: (typeof NAV)[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen bg-his-muted flex flex-col">
      {/* Top bar */}
      <header className="bg-his-navy text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Logo variant="light" className="shrink-0" />

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs((v) => !v)}
                className="p-2 rounded-full hover:bg-white/10 transition relative"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unread > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center px-0.5">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-his-border z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-his-border">
                      <p className="font-semibold text-slate-900 text-sm">Notifications</p>
                      {unread > 0 && (
                        <button
                          onClick={() => markAllRead.mutate()}
                          className="text-xs text-his-blue hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {(notifications ?? []).length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No notifications</p>
                      ) : (
                        (notifications ?? []).slice(0, 20).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition ${
                              n.is_read ? 'opacity-60' : ''
                            }`}
                          >
                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                              {!n.is_read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-his-blue shrink-0 inline-block" />
                              )}
                              {n.title}
                            </p>
                            {n.body && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <span className="hidden sm:block text-sm text-white/70 truncate max-w-[100px]">
              {me?.full_name?.split(' ')[0]}
            </span>

            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="text-sm font-semibold px-4 py-1.5 rounded-full border border-white/30 hover:bg-white/10 transition disabled:opacity-50 shrink-0"
            >
              {logout.isPending ? '…' : 'Log out'}
            </button>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      <nav className="bg-white border-b border-his-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(item)
                    ? 'bg-his-navy text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
    </div>
  )
}

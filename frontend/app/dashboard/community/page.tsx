'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardShell from '@/components/shared/DashboardShell'
import { useCommunityPosts, useCreatePost, useReply } from '@/lib/queries/community'
import { useMe } from '@/lib/queries/auth'
import type { CommunityPost } from '@/types'

function timeAgo(dateStr: string): string {
  const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

function PostCard({ post }: { post: CommunityPost }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const reply = useReply()

  const replies = post.replies ?? []

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    await reply.mutateAsync({ postId: post.id, body: replyText.trim() })
    setReplyText('')
  }

  return (
    <div className="bg-white rounded-2xl border border-his-border shadow-sm p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-his-navy/10 flex items-center justify-center shrink-0 font-bold text-his-navy text-sm">
          {(post.author?.full_name?.[0] ?? '?').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 text-sm">
              {post.author?.full_name ?? 'Anonymous'}
            </span>
            <span className="text-xs text-slate-400">{timeAgo(post.created_at)}</span>
          </div>
          {post.title && (
            <h3 className="font-bold text-slate-900 mt-1 leading-snug">{post.title}</h3>
          )}
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">{post.body}</p>
        </div>
      </div>

      <div className="border-t border-his-border pt-3">
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="text-xs font-semibold text-his-blue hover:text-his-blue-light transition"
        >
          {showReplies ? 'Hide' : 'Show'} replies ({replies.length})
        </button>

        {showReplies && (
          <div className="mt-3 space-y-3">
            {replies.map((r) => (
              <div key={r.id} className="flex items-start gap-2.5 pl-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-500 text-xs">
                  {(r.author?.full_name?.[0] ?? '?').toUpperCase()}
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {r.author?.full_name ?? 'Anonymous'}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">{timeAgo(r.created_at)}</span>
                  <p className="text-sm text-slate-600 mt-0.5">{r.body}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleReply} className="flex gap-2 pl-2 mt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 border border-his-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || reply.isPending}
                className="px-4 py-1.5 bg-his-navy text-white text-sm font-semibold rounded-lg hover:bg-his-navy-light transition disabled:opacity-50"
              >
                {reply.isPending ? '…' : 'Reply'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function CommunityContent() {
  const { data: posts, isLoading } = useCommunityPosts()
  const createPost = useCreatePost()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    await createPost.mutateAsync({ title: title.trim() || undefined, body: body.trim() })
    setTitle('')
    setBody('')
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-his-navy">Community</h1>
          <p className="text-slate-500 mt-1">Connect and learn with other students</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-5 py-2.5 bg-his-navy text-white font-semibold rounded-lg hover:bg-his-navy-light transition text-sm"
        >
          {showForm ? 'Cancel' : '+ New post'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-2xl border border-his-border shadow-sm p-5 mb-6 space-y-4"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title (optional)"
            className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts, questions, or insights…"
            rows={4}
            required
            className="w-full border border-his-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-his-blue/30 focus:border-his-blue resize-none"
          />
          <button
            type="submit"
            disabled={!body.trim() || createPost.isPending}
            className="px-6 py-2.5 bg-his-navy text-white font-semibold rounded-lg hover:bg-his-navy-light transition disabled:opacity-50 text-sm"
          >
            {createPost.isPending ? 'Posting…' : 'Post'}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (posts ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-his-border p-16 text-center">
          <p className="text-slate-500">No posts yet. Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(posts ?? []).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommunityPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <CommunityContent />
      </DashboardShell>
    </ProtectedRoute>
  )
}

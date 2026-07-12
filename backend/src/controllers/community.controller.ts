import { Request, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'

export const createPostSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1),
  course_id: z.string().uuid().optional(),
})

export const createReplySchema = z.object({
  body: z.string().min(1),
})

export const listPosts = async (req: Request, res: Response) => {
  const { course_id } = req.query as Record<string, string>

  let query = supabase
    .from('community_posts')
    .select(`
      id, title, body, course_id, created_at,
      author:profiles!author_id(id, full_name, avatar_url),
      replies:community_replies(id, body, created_at, author:profiles!author_id(id, full_name, avatar_url))
    `)
    .order('created_at', { ascending: false })

  if (course_id) query = query.eq('course_id', course_id)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

export const createPost = async (req: Request, res: Response) => {
  const { title, body, course_id } = req.body

  const { data, error } = await supabase
    .from('community_posts')
    .insert({ author_id: req.user!.id, title: title ?? null, body, course_id: course_id ?? null })
    .select(`
      id, title, body, course_id, created_at,
      author:profiles!author_id(id, full_name, avatar_url)
    `)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Post created' })
}

export const createReply = async (req: Request, res: Response) => {
  const { postId } = req.params
  const { body } = req.body

  const { data: post } = await supabase
    .from('community_posts')
    .select('id')
    .eq('id', postId)
    .single()

  if (!post) return res.status(404).json({ error: 'Post not found' })

  const { data, error } = await supabase
    .from('community_replies')
    .insert({ post_id: postId, author_id: req.user!.id, body })
    .select(`
      id, post_id, body, created_at,
      author:profiles!author_id(id, full_name, avatar_url)
    `)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ data, message: 'Reply added' })
}

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params

  const { data: post } = await supabase
    .from('community_posts')
    .select('author_id')
    .eq('id', postId)
    .single()

  if (!post) return res.status(404).json({ error: 'Post not found' })

  if (req.user!.role !== 'admin' && post.author_id !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const { error } = await supabase.from('community_posts').delete().eq('id', postId)
  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: null, message: 'Post deleted' })
}

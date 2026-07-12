import { Request, Response } from 'express'
import { supabase } from '../services/supabase'

export const list = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, link, is_read, created_at')
    .eq('user_id', req.user!.id)
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data, message: 'OK' })
}

export const markRead = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', req.user!.id)

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: null, message: 'Marked as read' })
}

export const markAllRead = async (req: Request, res: Response) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', req.user!.id)
    .eq('is_read', false)

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: null, message: 'All marked as read' })
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user!.id)

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ data: null, message: 'Notification deleted' })
}

import { Request, Response } from 'express'
import { supabase } from '../services/supabase'

export const getInstructors = async (
  req: Request,
  res: Response
) => {
  const { data, error } = await supabase
    .from('instructor_profiles')
    .select(`
      id,
      professional_title,
      expertise,
      years_of_experience,
      bio,
      linkedin,
      website,
      status,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'approved')

  if (error) {
    return res.status(500).json({
      error: error.message,
    })
  }

  return res.status(200).json({
    data,
  })
}
export const getInstructorMe = async (
  req: Request,
  res: Response
) => {
  const { data, error } = await supabase
    .from("instructor_profiles")
    .select(`
      *,
      profiles(
        full_name,
        avatar_url
      )
    `)
    .eq("id", req.user!.id)
    .single();

  if (error) {
    return res.status(404).json({
      error: error.message,
    });
  }

  return res.json({
    data,
  });
};
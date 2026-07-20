import { Request, Response } from "express";
import { supabase } from "../services/supabase";

export async function getInstructorDashboard(
  req: Request,
  res: Response
) {
  const instructorId = req.user!.id;

  const { data: instructor, error } = await supabase
    .from("instructor_profiles")
    .select(`
      professional_title,
      expertise,
      years_of_experience,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq("id", instructorId)
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  return res.json({
    data: {
      instructor,

      stats: {
        total_students: 0,
        total_courses: 0,
        pending_assignments: 0,
        upcoming_classes: 0,
      },

      notifications: [],

      recent_activities: [],
    },
  });
}
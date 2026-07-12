export type UserRole = 'student' | 'instructor' | 'admin'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type ProgramType = 'express' | 'certificate' | 'diploma'
export type ContentType = 'video' | 'pdf' | 'text'
export type EnrollmentStatus = 'active' | 'completed' | 'suspended'
export type EventType = 'webinar' | 'workshop' | 'competition' | 'challenge'
export type ChallengeContentType = 'text' | 'pdf' | 'video'

// Auth
export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

// Profile
export interface Profile {
  id: string
  email: string
  role: UserRole
  full_name: string
  avatar_url: string | null
  bio: string | null
  phone: string | null
  created_at: string
}

// Faculty
export interface Faculty {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

// Course
export interface Course {
  id: string
  faculty_id: string
  instructor_id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  price: number
  duration: string | null
  level: CourseLevel
  program_type: ProgramType
  is_published: boolean
  created_at: string
  faculty?: Faculty
  instructor?: Profile
  modules?: Module[]
}

// Module
export interface Module {
  id: string
  course_id: string
  title: string
  position: number
  created_at: string
  lessons?: Lesson[]
}

// Lesson
export interface Lesson {
  id: string
  module_id: string
  title: string
  position: number
  content_type: ContentType
  content_url: string | null
  content_text: string | null
  duration_min: number | null
  is_free_preview: boolean
  created_at: string
}

// Enrollment
export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  payment_ref: string | null
  status: EnrollmentStatus
  enrolled_at: string
  course?: Course
}

// LessonProgress
export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
}

// Assessment
export interface Assessment {
  id: string
  course_id: string
  title: string
  pass_score: number
  created_at: string
  questions?: Question[]
}

// Question option shape stored in JSONB
export interface QuestionOption {
  text: string
  is_correct: boolean
}

// Question
export interface Question {
  id: string
  assessment_id: string
  question_text: string
  options: QuestionOption[]
  position: number | null
}

// Submission
export interface Submission {
  id: string
  student_id: string
  assessment_id: string
  answers: Record<string, number> | null
  score: number | null
  passed: boolean | null
  submitted_at: string
  student?: Profile
}

// Certificate
export interface Certificate {
  id: string
  student_id: string
  course_id: string
  certificate_no: string
  qr_code_url: string | null
  issued_at: string
  approved_by: string | null
  course?: Course
  student?: Profile
}

// Event
export interface Event {
  id: string
  title: string
  event_type: EventType
  description: string | null
  starts_at: string | null
  ends_at: string | null
  location_url: string | null
  created_at: string
}

// EventRegistration
export interface EventRegistration {
  id: string
  event_id: string
  student_id: string
  registered_at: string
}

// CommunityPost
export interface CommunityPost {
  id: string
  author_id: string
  course_id: string | null
  title: string | null
  body: string
  created_at: string
  author?: Profile
  replies?: CommunityReply[]
}

// CommunityReply
export interface CommunityReply {
  id: string
  post_id: string
  author_id: string
  body: string
  created_at: string
  author?: Profile
}

// InnovationChallenge
export interface InnovationChallenge {
  id: string
  title: string
  description: string | null
  deadline: string | null
  created_at: string
}

// ChallengeSubmission
export interface ChallengeSubmission {
  id: string
  challenge_id: string
  student_id: string
  content_type: ChallengeContentType
  content_url: string | null
  description: string | null
  submitted_at: string
}

// BlogPost
export interface BlogPost {
  id: string
  author_id: string
  title: string
  slug: string
  body: string
  category: string | null
  thumbnail_url: string | null
  is_published: boolean
  published_at: string | null
  author?: Profile
}

// Notification
export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

// Admin stats shape
export interface AdminStats {
  total_students: number
  total_courses: number
  total_revenue: number
  total_enrollments: number
  recent_enrollments: Enrollment[]
}

import axios, { AxiosError } from 'axios'
import { supabase } from './supabase'
import type {
  Profile,
  Faculty,
  Course,
  Module,
  Lesson,
  Enrollment,
  LessonProgress,
  Assessment,
  Submission,
  Certificate,
  Event,
  EventRegistration,
  CommunityPost,
  CommunityReply,
  InnovationChallenge,
  ChallengeSubmission,
  BlogPost,
  Notification,
  AdminStats,
} from '../types'

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error: string }>) => {
    const message = err.response?.data?.error ?? err.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  }
)

const get = <T>(path: string) =>
  client.get<{ data: T }>(path).then((r) => r.data.data)

const post = <T>(path: string, body?: unknown) =>
  client.post<{ data: T }>(path, body).then((r) => r.data.data)

const patch = <T>(path: string, body?: unknown) =>
  client.patch<{ data: T }>(path, body).then((r) => r.data.data)

const del = <T>(path: string) =>
  client.delete<{ data: T }>(path).then((r) => r.data.data)

const uploadFile = <T>(path: string, formData: FormData) =>
  client
    .post<{ data: T }>(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data)

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: { email: string; password: string; full_name: string }) =>
    post<{ token: string }>('/auth/register', body),

  // Documented backend login. The frontend signs in via Supabase Auth directly
  // (see lib/auth.ts), so this mirrors API.md for completeness / non-browser clients.
  login: (body: { email: string; password: string }) =>
    post<{ token: string; user: Pick<Profile, 'id' | 'email' | 'role' | 'full_name' | 'avatar_url'> }>(
      '/auth/login',
      body
    ),

  logout: () => post('/auth/logout'),

  me: () => get<Profile>('/auth/me'),

  updateMe: (body: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'bio' | 'phone'>>) =>
    patch<Profile>('/auth/me', body),
}

// ─── Faculties ───────────────────────────────────────────────────────────────

export const facultiesApi = {
  list: () => get<Faculty[]>('/faculties'),

  get: (slug: string) => get<Faculty & { courses: Course[] }>(`/faculties/${slug}`),

  create: (body: Pick<Faculty, 'name' | 'slug' | 'description' | 'icon'>) =>
    post<Faculty>('/faculties', body),

  update: (id: string, body: Partial<Pick<Faculty, 'name' | 'description' | 'icon'>>) =>
    patch<Faculty>(`/faculties/${id}`, body),

  remove: (id: string) => del(`/faculties/${id}`),
}

// ─── Courses ─────────────────────────────────────────────────────────────────

export const coursesApi = {
  list: (params?: { faculty?: string; level?: string; program_type?: string }) =>
    get<Course[]>(`/courses${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''}`),

  get: (slug: string) => get<Course>(`/courses/${slug}`),

  create: (body: Partial<Course>) => post<Course>('/courses', body),

  update: (id: string, body: Partial<Course>) => patch<Course>(`/courses/${id}`, body),

  remove: (id: string) => del(`/courses/${id}`),

  addModule: (courseId: string, body: { title: string; position: number }) =>
    post<Module>(`/courses/${courseId}/modules`, body),
}

// ─── Modules ─────────────────────────────────────────────────────────────────

export const modulesApi = {
  update: (id: string, body: { title?: string; position?: number }) =>
    patch<Module>(`/modules/${id}`, body),

  remove: (id: string) => del(`/modules/${id}`),

  addLesson: (moduleId: string, formData: FormData) =>
    uploadFile<Lesson>(`/modules/${moduleId}/lessons`, formData),
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export const lessonsApi = {
  update: (id: string, body: Partial<Pick<Lesson, 'title' | 'position' | 'duration_min'>>) =>
    patch<Lesson>(`/lessons/${id}`, body),

  remove: (id: string) => del(`/lessons/${id}`),
}

// ─── Enrollments ─────────────────────────────────────────────────────────────

export const enrollmentsApi = {
  enroll: (courseId: string) => post<Enrollment>('/enrollments', { course_id: courseId }),

  mine: () => get<Enrollment[]>('/enrollments/me'),

  students: (courseId: string) =>
    get<(Enrollment & { student: Profile })[]>(`/enrollments/${courseId}/students`),
}

// ─── Progress ────────────────────────────────────────────────────────────────

export const progressApi = {
  markComplete: (lessonId: string) => post<LessonProgress>(`/progress/${lessonId}`),

  forCourse: (courseId: string) =>
    get<{ completed: number; total: number; lessons: LessonProgress[] }>(`/progress/${courseId}`),
}

// ─── Assessments ─────────────────────────────────────────────────────────────

export const assessmentsApi = {
  getForCourse: (courseId: string) => get<Assessment>(`/assessments/${courseId}`),

  create: (body: { course_id: string; title: string; pass_score?: number; questions: unknown[] }) =>
    post<Assessment>('/assessments', body),

  submit: (id: string, answers: Record<string, number>) =>
    post<{ score: number; passed: boolean }>(`/assessments/${id}/submit`, { answers }),

  uploadAssignment: (id: string, formData: FormData) =>
    uploadFile<Submission>(`/assessments/${id}/upload`, formData),

  results: (id: string) => get<Submission[]>(`/assessments/${id}/results`),
}

// ─── Certificates ────────────────────────────────────────────────────────────

export const certificatesApi = {
  mine: () => get<Certificate[]>('/certificates/me'),

  verify: (certificateNo: string) =>
    get<Certificate>(`/certificates/verify/${certificateNo}`),
}

// ─── Events ──────────────────────────────────────────────────────────────────

export const eventsApi = {
  list: () => get<Event[]>('/events'),

  get: (id: string) => get<Event>(`/events/${id}`),

  register: (id: string) => post<EventRegistration>(`/events/${id}/register`),

  create: (body: Partial<Event>) => post<Event>('/events', body),
}

// ─── Community ───────────────────────────────────────────────────────────────

export const communityApi = {
  list: (courseId?: string) =>
    get<CommunityPost[]>(`/community${courseId ? `?course_id=${courseId}` : ''}`),

  create: (body: { title?: string; body: string; course_id?: string }) =>
    post<CommunityPost>('/community', body),

  reply: (postId: string, body: { body: string }) =>
    post<CommunityReply>(`/community/${postId}/replies`, body),

  remove: (postId: string) => del(`/community/${postId}`),
}

// ─── Notifications ───────────────────────────────────────────────────────────

export const notificationsApi = {
  list: () => get<Notification[]>('/notifications/me'),

  markRead: (id: string) => patch<Notification>(`/notifications/${id}/read`),

  markAllRead: () => patch('/notifications/read-all'),

  remove: (id: string) => del(`/notifications/${id}`),
}

// ─── Innovation Challenges ───────────────────────────────────────────────────

export const challengesApi = {
  list: () => get<InnovationChallenge[]>('/challenges'),

  get: (id: string) => get<InnovationChallenge>(`/challenges/${id}`),

  submit: (id: string, formData: FormData) =>
    uploadFile<ChallengeSubmission>(`/challenges/${id}/submit`, formData),

  create: (body: Partial<InnovationChallenge>) => post<InnovationChallenge>('/challenges', body),

  submissions: (id: string) => get<ChallengeSubmission[]>(`/challenges/${id}/submissions`),
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const blogApi = {
  list: () => get<BlogPost[]>('/blog'),

  get: (slug: string) => get<BlogPost>(`/blog/${slug}`),

  create: (body: Partial<BlogPost>) => post<BlogPost>('/blog', body),

  update: (id: string, body: Partial<BlogPost>) => patch<BlogPost>(`/blog/${id}`, body),
}

// ─── Payments ────────────────────────────────────────────────────────────────

export const paymentsApi = {
  paystackInitiate: (courseId: string) =>
    post<{ pay_url: string }>('/payments/paystack/initiate', { course_id: courseId }),

  stripeInitiate: (courseId: string) =>
    post<{ client_secret: string }>('/payments/stripe/initiate', { course_id: courseId }),
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => get<AdminStats>('/admin/stats'),

  listStudents: () => get<(Profile & { enrollment_count: number })[]>('/admin/students'),

  suspendStudent: (id: string) => patch(`/admin/students/${id}/suspend`),

  deleteStudent: (id: string) => del(`/admin/students/${id}`),

  listCourses: () =>
    get<(Course & { enrollment_count: number })[]>('/admin/courses'),

  publishCourse: (id: string, publish: boolean) =>
    patch<Course>(`/admin/courses/${id}/publish`, { is_published: publish }),

  deleteCourse: (id: string) => del(`/admin/courses/${id}`),

  approveCertificate: (enrollmentId: string) =>
    post<Certificate>(`/admin/certificates/${enrollmentId}/approve`),
}

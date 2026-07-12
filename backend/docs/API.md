# HIS Backend — API Reference

**Helen Innovative School (HIS) · REST API v1**

---

## Overview

| | |
|---|---|
| **Base URL** | `http://localhost:4000/api/v1` |
| **Production** | `https://api.his.yourdomain.com/api/v1` |
| **Auth scheme** | `Authorization: Bearer <supabase_jwt>` |
| **Content-Type** | `application/json` (except file uploads: `multipart/form-data`) |

### Standard Response Shape

```json
// Success
{ "data": <T>, "message": "string" }

// Error
{ "error": "string" }
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Bad request |
| `401` | No token / invalid token |
| `403` | Valid token but wrong role |
| `404` | Resource not found |
| `409` | Conflict (duplicate) |
| `422` | Validation error (Zod) |
| `500` | Internal server error |

### Role Values

`student` · `instructor` · `admin`

---

## Health Check

### `GET /health`

No auth required. Liveness probe.

**Response `200`**
```json
{ "status": "ok" }
```

---

## 1. Auth

### `POST /auth/register`

**Public** — create a new account. Role is always `student` on registration.

**Body**
```json
{
  "email": "string",
  "password": "string",
  "full_name": "string"
}
```

**Response `201`**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

**Errors**
| Code | Reason |
|---|---|
| `409` | Email already registered |
| `422` | Missing or invalid fields |

---

### `POST /auth/login`

**Public**

**Body**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response `200`**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "jane@example.com",
      "role": "student",
      "full_name": "Jane Doe",
      "avatar_url": null
    }
  },
  "message": "Login successful"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Invalid credentials |
| `422` | Missing fields |

---

### `POST /auth/logout`

**Auth required**

No body.

**Response `200`**
```json
{ "data": null, "message": "Logged out successfully" }
```

---

### `GET /auth/me`

**Auth required**

Returns the full profile of the authenticated user.

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "email": "jane@example.com",
    "role": "student",
    "full_name": "Jane Doe",
    "avatar_url": "https://storage.supabase.co/avatars/jane.jpg",
    "bio": "Fintech enthusiast",
    "phone": "+2348012345678",
    "created_at": "2024-01-15T10:00:00Z"
  },
  "message": "OK"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Missing or invalid token |

---

### `PATCH /auth/me`

**Auth required**

Update own profile fields. All fields are optional.

**Body**
```json
{
  "full_name": "string",
  "avatar_url": "string",
  "bio": "string",
  "phone": "string"
}
```

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "full_name": "Jane Doe Updated",
    "avatar_url": "https://...",
    "bio": "Updated bio",
    "phone": "+2348099999999",
    "updated_at": "2024-06-17T12:00:00Z"
  },
  "message": "Profile updated"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `422` | Invalid field types |

---

## 2. Faculties

### `GET /faculties`

**Public** — list all 11 faculties.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "FinTech",
      "slug": "fintech",
      "description": "Financial technology, payments, and investment innovation",
      "icon": "💳",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "OK"
}
```

---

### `GET /faculties/:slug`

**Public** — single faculty with its published courses.

**Path params**
| Param | Type | Example |
|---|---|---|
| `slug` | string | `fintech` |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "name": "FinTech",
    "slug": "fintech",
    "description": "Financial technology, payments, and investment innovation",
    "icon": "💳",
    "courses": [
      {
        "id": "uuid",
        "title": "Intro to FinTech",
        "slug": "intro-to-fintech",
        "thumbnail_url": "https://...",
        "price": 15000,
        "level": "beginner",
        "program_type": "express",
        "duration": "2 Weeks",
        "is_published": true
      }
    ]
  },
  "message": "OK"
}
```

**Errors**
| Code | Reason |
|---|---|
| `404` | Faculty slug not found |

---

### `POST /faculties`

**Admin only**

**Body**
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "icon": "string"
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "name": "MediaTech",
    "slug": "mediatech",
    "description": "Media technology and digital storytelling",
    "icon": "🎬",
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Faculty created"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Not admin |
| `409` | Slug already exists |
| `422` | Missing required fields |

---

### `PATCH /faculties/:id`

**Admin only**

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body** — all fields optional
```json
{
  "name": "string",
  "description": "string",
  "icon": "string"
}
```

**Response `200`**
```json
{
  "data": { "id": "uuid", "name": "MediaTech Updated", "slug": "mediatech" },
  "message": "Faculty updated"
}
```

**Errors** — `401` `403` `404` `422`

---

### `DELETE /faculties/:id`

**Admin only**

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Faculty deleted" }
```

**Errors** — `401` `403` `404`

---

## 3. Courses

### `GET /courses`

**Public** — list published courses with optional filters.

**Query params**
| Param | Type | Values |
|---|---|---|
| `faculty` | string | faculty slug e.g. `fintech` |
| `level` | string | `beginner` `intermediate` `advanced` |
| `program_type` | string | `express` `certificate` `diploma` |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Intro to FinTech",
      "slug": "intro-to-fintech",
      "description": "Learn the fundamentals of financial technology.",
      "thumbnail_url": "https://...",
      "price": 15000,
      "level": "beginner",
      "program_type": "express",
      "duration": "2 Weeks",
      "is_published": true,
      "faculty": { "id": "uuid", "name": "FinTech", "slug": "fintech" },
      "instructor": {
        "id": "uuid",
        "full_name": "Dr. Amara Okafor",
        "avatar_url": "https://..."
      }
    }
  ],
  "message": "OK"
}
```

---

### `GET /courses/:slug`

**Public** — full course detail with modules and lessons.

**Path params**
| Param | Type | Example |
|---|---|---|
| `slug` | string | `intro-to-fintech` |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Intro to FinTech",
    "slug": "intro-to-fintech",
    "description": "Learn the fundamentals of financial technology.",
    "thumbnail_url": "https://...",
    "price": 15000,
    "level": "beginner",
    "program_type": "express",
    "duration": "2 Weeks",
    "is_published": true,
    "faculty": { "id": "uuid", "name": "FinTech", "slug": "fintech" },
    "instructor": {
      "id": "uuid",
      "full_name": "Dr. Amara Okafor",
      "avatar_url": "https://...",
      "bio": "10 years in financial tech"
    },
    "modules": [
      {
        "id": "uuid",
        "title": "Module 1: Foundations",
        "position": 1,
        "lessons": [
          {
            "id": "uuid",
            "title": "What is FinTech?",
            "content_type": "video",
            "content_url": "https://storage.supabase.co/lessons/...",
            "duration_min": 12,
            "position": 1,
            "is_free_preview": true
          }
        ]
      }
    ]
  },
  "message": "OK"
}
```

**Errors** — `404` course not found

---

### `POST /courses`

**Instructor or Admin**

**Body**
```json
{
  "title": "string",
  "slug": "string",
  "description": "string",
  "faculty_id": "uuid",
  "price": 15000,
  "level": "beginner",
  "program_type": "express",
  "duration": "2 Weeks",
  "thumbnail_url": "string"
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Intro to FinTech",
    "slug": "intro-to-fintech",
    "instructor_id": "uuid",
    "is_published": false,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Course created"
}
```

**Errors** — `401` `403` `409` (duplicate slug) `422`

---

### `PATCH /courses/:id`

**Instructor (own course) or Admin**

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body** — all fields optional
```json
{
  "title": "string",
  "description": "string",
  "price": 0,
  "level": "beginner",
  "program_type": "express",
  "duration": "string",
  "thumbnail_url": "string",
  "is_published": false
}
```

**Response `200`**
```json
{
  "data": { "id": "uuid", "title": "Updated Title", "updated_at": "2024-06-17T12:00:00Z" },
  "message": "Course updated"
}
```

**Errors** — `401` `403` `404` `422`

---

### `DELETE /courses/:id`

**Admin only** — soft-archives the course (sets `is_published = false`).

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Course archived" }
```

**Errors** — `401` `403` `404`

---

### `POST /courses/:id/modules`

**Instructor or Admin** — add a module to a course.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (course) |

**Body**
```json
{
  "title": "string",
  "position": 1
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "title": "Module 1: Foundations",
    "position": 1,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Module added"
}
```

**Errors** — `401` `403` `404` `422`

---

## 4. Modules

### `PATCH /modules/:id`

**Instructor or Admin** — update module title or reorder.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body** — all fields optional
```json
{
  "title": "string",
  "position": 2
}
```

**Response `200`**
```json
{
  "data": { "id": "uuid", "title": "Updated Module Title", "position": 2 },
  "message": "Module updated"
}
```

**Errors** — `401` `403` `404` `422`

---

### `DELETE /modules/:id`

**Instructor or Admin** — deletes the module and all its lessons (cascade).

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Module deleted" }
```

**Errors** — `401` `403` `404`

---

### `POST /modules/:id/lessons`

**Instructor or Admin** — upload a lesson file and create the lesson record.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (module) |

**Body** — `multipart/form-data`
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `content_type` | string | yes | `video` `pdf` `text` |
| `position` | number | yes | |
| `duration_min` | number | no | |
| `is_free_preview` | boolean | no | default `false` |
| `content_text` | string | no | required if `content_type = text` |
| `file` | File | no | required if `content_type = video` or `pdf` |

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "module_id": "uuid",
    "course_id": "uuid",
    "title": "What is FinTech?",
    "content_type": "video",
    "content_url": "https://storage.supabase.co/lessons/course-uuid/lesson-uuid.mp4",
    "duration_min": 12,
    "position": 1,
    "is_free_preview": true,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Lesson added"
}
```

**Errors** — `401` `403` `404` `422`

---

## 5. Lessons

### `PATCH /lessons/:id`

**Instructor or Admin** — update lesson metadata or replace the file.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body** — `multipart/form-data`, all fields optional
| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `position` | number | |
| `duration_min` | number | |
| `is_free_preview` | boolean | |
| `content_text` | string | |
| `file` | File | replaces existing file in Supabase Storage |

**Response `200`**
```json
{
  "data": { "id": "uuid", "title": "Updated Lesson Title", "duration_min": 15 },
  "message": "Lesson updated"
}
```

**Errors** — `401` `403` `404` `422`

---

### `DELETE /lessons/:id`

**Instructor or Admin**

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Lesson deleted" }
```

**Errors** — `401` `403` `404`

---

## 6. Enrollments

### `POST /enrollments`

**Student only** — enroll in a course and initiate payment.

**Body**
```json
{
  "course_id": "uuid",
  "payment_provider": "paystack"
}
```

> For free courses (`price = 0`) the enrollment is activated immediately. For paid courses, call the relevant payment initiate endpoint next.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "student_id": "uuid",
    "course_id": "uuid",
    "status": "pending",
    "payment_provider": "paystack",
    "enrolled_at": "2024-06-17T00:00:00Z"
  },
  "message": "Enrollment created"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Not a student |
| `404` | Course not found |
| `409` | Already enrolled |

---

### `GET /enrollments/me`

**Auth required** — returns the current user's enrollments with course details.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "active",
      "enrolled_at": "2024-06-17T00:00:00Z",
      "course": {
        "id": "uuid",
        "title": "Intro to FinTech",
        "slug": "intro-to-fintech",
        "thumbnail_url": "https://...",
        "level": "beginner",
        "program_type": "express"
      }
    }
  ],
  "message": "OK"
}
```

---

### `GET /enrollments/:courseId/students`

**Instructor or Admin** — list all enrolled students for a course.

**Path params**
| Param | Type |
|---|---|
| `courseId` | uuid |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "active",
      "enrolled_at": "2024-06-17T00:00:00Z",
      "student": {
        "id": "uuid",
        "full_name": "Jane Doe",
        "avatar_url": "https://...",
        "email": "jane@example.com"
      }
    }
  ],
  "message": "OK"
}
```

**Errors** — `401` `403` `404`

---

## 7. Progress

### `POST /progress/:lessonId`

**Auth required** — mark a lesson as complete for the current user.

**Path params**
| Param | Type |
|---|---|
| `lessonId` | uuid |

No body.

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "student_id": "uuid",
    "lesson_id": "uuid",
    "course_id": "uuid",
    "completed_at": "2024-06-17T12:00:00Z"
  },
  "message": "Lesson marked complete"
}
```

**Errors** — `401` `404`

---

### `GET /progress/:courseId`

**Auth required** — get lesson completion data for a course.

**Path params**
| Param | Type |
|---|---|
| `courseId` | uuid |

**Response `200`**
```json
{
  "data": {
    "course_id": "uuid",
    "completed": 4,
    "total": 10,
    "percentage": 40,
    "lessons": [
      {
        "lesson_id": "uuid",
        "completed_at": "2024-06-17T12:00:00Z"
      }
    ]
  },
  "message": "OK"
}
```

**Errors** — `401` `404`

---

## 8. Assessments

### `GET /assessments/:courseId`

**Auth required** — returns the assessment and all questions for a course.

**Path params**
| Param | Type |
|---|---|
| `courseId` | uuid |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "title": "FinTech Module 1 Quiz",
    "pass_score": 70,
    "questions": [
      {
        "id": "uuid",
        "body": "What does API stand for?",
        "position": 1,
        "options": [
          { "id": "a", "text": "Application Programming Interface", "is_correct": true },
          { "id": "b", "text": "Applied Protocol Interface", "is_correct": false },
          { "id": "c", "text": "Automated Process Integration", "is_correct": false },
          { "id": "d", "text": "None of the above", "is_correct": false }
        ]
      }
    ]
  },
  "message": "OK"
}
```

> **Note:** `is_correct` is stripped before sending to students — only shown for instructor/admin results.

**Errors** — `401` `404`

---

### `POST /assessments`

**Instructor or Admin** — create an assessment with questions.

**Body**
```json
{
  "course_id": "uuid",
  "title": "string",
  "pass_score": 70,
  "questions": [
    {
      "body": "string",
      "position": 1,
      "options": [
        { "id": "a", "text": "string", "is_correct": true },
        { "id": "b", "text": "string", "is_correct": false },
        { "id": "c", "text": "string", "is_correct": false },
        { "id": "d", "text": "string", "is_correct": false }
      ]
    }
  ]
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "title": "FinTech Module 1 Quiz",
    "pass_score": 70,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Assessment created"
}
```

**Errors** — `401` `403` `404` (course) `422`

---

### `POST /assessments/:id/submit`

**Student only** — submit quiz answers and receive a score.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (assessment) |

**Body**
```json
{
  "answers": {
    "<question_id>": "a",
    "<question_id>": "c"
  }
}
```

**Response `200`**
```json
{
  "data": {
    "submission_id": "uuid",
    "score": 85,
    "passed": true,
    "pass_score": 70,
    "correct": 17,
    "total": 20
  },
  "message": "Assessment submitted"
}
```

**Errors** — `401` `403` `404` `422`

---

### `POST /assessments/:id/upload`

**Student only** — upload an assignment file (PDF, doc, video).

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (assessment) |

**Body** — `multipart/form-data`
| Field | Type | Required |
|---|---|---|
| `file` | File | yes |

File is stored in the `assignments` Supabase Storage bucket.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "assessment_id": "uuid",
    "student_id": "uuid",
    "content_url": "https://storage.supabase.co/assignments/uuid/file.pdf",
    "submitted_at": "2024-06-17T12:00:00Z"
  },
  "message": "Assignment submitted"
}
```

**Errors** — `401` `403` `404` `422`

---

### `GET /assessments/:id/results`

**Instructor or Admin** — all student submissions for an assessment.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (assessment) |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "score": 85,
      "passed": true,
      "submitted_at": "2024-06-17T12:00:00Z",
      "student": {
        "id": "uuid",
        "full_name": "Jane Doe",
        "avatar_url": "https://..."
      }
    }
  ],
  "message": "OK"
}
```

**Errors** — `401` `403` `404`

---

## 9. Certificates

### `GET /certificates/me`

**Auth required** — returns all issued certificates for the current user.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "certificate_no": "HIS-2024-00001",
      "pdf_url": "https://storage.supabase.co/certificates/HIS-2024-00001.pdf",
      "qr_code_url": "https://storage.supabase.co/certificates/HIS-2024-00001-qr.png",
      "issued_at": "2024-06-17T00:00:00Z",
      "course": {
        "id": "uuid",
        "title": "Intro to FinTech",
        "slug": "intro-to-fintech"
      }
    }
  ],
  "message": "OK"
}
```

---

### `GET /certificates/verify/:certificateNo`

**Public** — verifies a certificate by its unique number (used by QR code scan).

**Path params**
| Param | Type | Example |
|---|---|---|
| `certificateNo` | string | `HIS-2024-00001` |

**Response `200`**
```json
{
  "data": {
    "certificate_no": "HIS-2024-00001",
    "issued_at": "2024-06-17T00:00:00Z",
    "student": {
      "full_name": "Jane Doe",
      "avatar_url": "https://..."
    },
    "course": {
      "title": "Intro to FinTech",
      "faculty": "FinTech"
    }
  },
  "message": "Certificate is valid"
}
```

**Errors**
| Code | Reason |
|---|---|
| `404` | Certificate number not found |

---

### `POST /certificates/generate/:enrollmentId`

**Admin only** — generate a PDF certificate with QR code for a completed enrollment.

**Path params**
| Param | Type |
|---|---|
| `enrollmentId` | uuid |

No body.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "certificate_no": "HIS-2024-00002",
    "pdf_url": "https://storage.supabase.co/certificates/HIS-2024-00002.pdf",
    "qr_code_url": "https://storage.supabase.co/certificates/HIS-2024-00002-qr.png",
    "issued_at": "2024-06-17T00:00:00Z"
  },
  "message": "Certificate issued"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Not admin |
| `404` | Enrollment not found |
| `409` | Certificate already issued for this enrollment |

---

## 10. Events

### `GET /events`

**Public** — list all published events ordered by start date.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "FinTech Innovation Summit",
      "description": "Annual summit for fintech professionals.",
      "event_type": "webinar",
      "starts_at": "2024-08-01T10:00:00Z",
      "ends_at": "2024-08-01T13:00:00Z",
      "location": "https://meet.google.com/...",
      "thumbnail_url": "https://...",
      "is_published": true
    }
  ],
  "message": "OK"
}
```

---

### `GET /events/:id`

**Public** — single event detail.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "title": "FinTech Innovation Summit",
    "description": "Annual summit for fintech professionals.",
    "event_type": "webinar",
    "starts_at": "2024-08-01T10:00:00Z",
    "ends_at": "2024-08-01T13:00:00Z",
    "location": "https://meet.google.com/...",
    "thumbnail_url": "https://...",
    "is_published": true,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "OK"
}
```

**Errors** — `404`

---

### `POST /events`

**Admin only** — create a new event.

**Body**
```json
{
  "title": "string",
  "description": "string",
  "event_type": "webinar",
  "starts_at": "2024-08-01T10:00:00Z",
  "ends_at": "2024-08-01T13:00:00Z",
  "location": "string",
  "thumbnail_url": "string"
}
```

`event_type` values: `webinar` `workshop` `competition` `challenge`

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "title": "FinTech Innovation Summit",
    "event_type": "webinar",
    "is_published": false,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Event created"
}
```

**Errors** — `401` `403` `422`

---

### `POST /events/:id/register`

**Auth required** — register the current user for an event.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

No body.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "event_id": "uuid",
    "student_id": "uuid",
    "registered_at": "2024-06-17T00:00:00Z"
  },
  "message": "Registered for event"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `404` | Event not found |
| `409` | Already registered |

---

## 11. Community

### `GET /community`

**Auth required** — list forum posts, optionally scoped to a course.

**Query params**
| Param | Type | Notes |
|---|---|---|
| `course_id` | uuid | optional — filters to one course |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Tips for passing the FinTech quiz",
      "body": "Here are my notes from Module 1...",
      "course_id": "uuid",
      "created_at": "2024-06-17T10:00:00Z",
      "reply_count": 5,
      "author": {
        "id": "uuid",
        "full_name": "Jane Doe",
        "avatar_url": "https://..."
      }
    }
  ],
  "message": "OK"
}
```

---

### `POST /community`

**Auth required** — create a new forum post.

**Body**
```json
{
  "title": "string",
  "body": "string",
  "course_id": "uuid"
}
```

`course_id` is optional. Omit for a platform-wide post.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Tips for passing the FinTech quiz",
    "body": "Here are my notes...",
    "course_id": "uuid",
    "author_id": "uuid",
    "created_at": "2024-06-17T10:00:00Z"
  },
  "message": "Post created"
}
```

**Errors** — `401` `422`

---

### `POST /community/:postId/replies`

**Auth required** — reply to a forum post.

**Path params**
| Param | Type |
|---|---|
| `postId` | uuid |

**Body**
```json
{ "body": "string" }
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "post_id": "uuid",
    "body": "Great tips, thanks!",
    "author_id": "uuid",
    "created_at": "2024-06-17T10:30:00Z",
    "author": {
      "full_name": "John Smith",
      "avatar_url": "https://..."
    }
  },
  "message": "Reply added"
}
```

**Errors** — `401` `404` `422`

---

### `DELETE /community/:postId`

**Auth required** — delete a post. Only the post author or an admin can delete.

**Path params**
| Param | Type |
|---|---|
| `postId` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Post deleted" }
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Not the author or admin |
| `404` | Post not found |

---

## 12. Innovation Challenges

### `GET /challenges`

**Public** — list all active innovation challenges ordered by deadline.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Build a FinTech Solution for Rural Nigeria",
      "description": "Submit a prototype or business plan addressing financial inclusion.",
      "deadline": "2024-09-01T23:59:59Z",
      "thumbnail_url": "https://...",
      "is_active": true,
      "created_at": "2024-06-17T00:00:00Z"
    }
  ],
  "message": "OK"
}
```

---

### `GET /challenges/:id`

**Public** — single challenge detail.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Build a FinTech Solution for Rural Nigeria",
    "description": "Submit a prototype or business plan...",
    "deadline": "2024-09-01T23:59:59Z",
    "thumbnail_url": "https://...",
    "is_active": true,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "OK"
}
```

**Errors** — `404`

---

### `POST /challenges`

**Admin only** — create a new innovation challenge.

**Body**
```json
{
  "title": "string",
  "description": "string",
  "deadline": "2024-09-01T23:59:59Z",
  "thumbnail_url": "string"
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Build a FinTech Solution for Rural Nigeria",
    "deadline": "2024-09-01T23:59:59Z",
    "is_active": true,
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Challenge created"
}
```

**Errors** — `401` `403` `422`

---

### `POST /challenges/:id/submit`

**Auth required** — submit an entry to a challenge (text, PDF, or video).

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body** — `multipart/form-data`
| Field | Type | Required | Notes |
|---|---|---|---|
| `content_type` | string | yes | `text` `pdf` `video` |
| `content_text` | string | no | required if `content_type = text` |
| `file` | File | no | required if `content_type = pdf` or `video` |

File is stored in the `challenge-submissions` Supabase Storage bucket.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "challenge_id": "uuid",
    "student_id": "uuid",
    "content_type": "pdf",
    "file_url": "https://storage.supabase.co/challenge-submissions/...",
    "submitted_at": "2024-06-17T12:00:00Z"
  },
  "message": "Submission received"
}
```

**Errors** — `401` `404` `422`

---

### `GET /challenges/:id/submissions`

**Admin only** — all entries for a challenge.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "content_type": "pdf",
      "file_url": "https://...",
      "content_text": null,
      "submitted_at": "2024-06-17T12:00:00Z",
      "student": {
        "id": "uuid",
        "full_name": "Jane Doe",
        "avatar_url": "https://..."
      }
    }
  ],
  "message": "OK"
}
```

**Errors** — `401` `403` `404`

---

## 13. Blog

### `GET /blog`

**Public** — list all published posts ordered by `published_at` descending.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "The Future of FinTech in Africa",
      "slug": "future-of-fintech-africa",
      "excerpt": "A look at the trends shaping African financial technology.",
      "category": "FinTech",
      "thumbnail_url": "https://...",
      "published_at": "2024-06-10T00:00:00Z",
      "author": {
        "id": "uuid",
        "full_name": "Dr. Amara Okafor",
        "avatar_url": "https://..."
      }
    }
  ],
  "message": "OK"
}
```

---

### `GET /blog/:slug`

**Public** — full post content.

**Path params**
| Param | Type | Example |
|---|---|---|
| `slug` | string | `future-of-fintech-africa` |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "title": "The Future of FinTech in Africa",
    "slug": "future-of-fintech-africa",
    "excerpt": "A look at the trends shaping African financial technology.",
    "body": "## Introduction\n\nFinancial technology in Africa...",
    "category": "FinTech",
    "thumbnail_url": "https://...",
    "is_published": true,
    "published_at": "2024-06-10T00:00:00Z",
    "created_at": "2024-06-09T00:00:00Z",
    "author": {
      "id": "uuid",
      "full_name": "Dr. Amara Okafor",
      "avatar_url": "https://..."
    }
  },
  "message": "OK"
}
```

**Errors** — `404`

---

### `POST /blog`

**Instructor or Admin** — create a blog post.

**Body**
```json
{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "body": "string",
  "category": "string",
  "thumbnail_url": "string",
  "is_published": false
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "title": "The Future of FinTech in Africa",
    "slug": "future-of-fintech-africa",
    "is_published": false,
    "author_id": "uuid",
    "created_at": "2024-06-17T00:00:00Z"
  },
  "message": "Post created"
}
```

**Errors** — `401` `403` `409` (duplicate slug) `422`

---

### `PATCH /blog/:id`

**Instructor or Admin** — update or publish a post.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body** — all fields optional
```json
{
  "title": "string",
  "excerpt": "string",
  "body": "string",
  "category": "string",
  "thumbnail_url": "string",
  "is_published": true
}
```

> Setting `is_published: true` automatically sets `published_at` to `now()`.

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "is_published": true,
    "published_at": "2024-06-17T12:00:00Z",
    "updated_at": "2024-06-17T12:00:00Z"
  },
  "message": "Post updated"
}
```

**Errors** — `401` `403` `404` `422`

---

## 14. Notifications

### `GET /notifications/me`

**Auth required** — list all notifications for the current user, unread first.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Certificate Ready",
      "body": "Your certificate for Intro to FinTech has been issued.",
      "link": "/dashboard/certificates",
      "is_read": false,
      "created_at": "2024-06-17T12:00:00Z"
    }
  ],
  "message": "OK"
}
```

---

### `PATCH /notifications/read-all`

**Auth required** — mark every notification as read for the current user.

No body.

**Response `200`**
```json
{ "data": { "updated": 3 }, "message": "All notifications marked as read" }
```

---

### `PATCH /notifications/:id/read`

**Auth required** — mark a single notification as read.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

No body.

**Response `200`**
```json
{
  "data": { "id": "uuid", "is_read": true },
  "message": "Notification marked as read"
}
```

**Errors** — `401` `404`

---

### `DELETE /notifications/:id`

**Auth required** — delete a notification (only own notifications).

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Notification deleted" }
```

**Errors** — `401` `403` `404`

---

## 15. Payments

### `POST /payments/paystack/initiate`

**Auth required** — initialise a Paystack transaction for a course enrollment.

**Body**
```json
{
  "enrollment_id": "uuid",
  "email": "jane@example.com"
}
```

**Response `200`**
```json
{
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "abc123",
    "reference": "his_20240617_uuid"
  },
  "message": "Payment initiated"
}
```

**Errors** — `401` `404` `502` (Paystack API error)

---

### `POST /payments/paystack/verify`

**Public** — Paystack webhook. Called by Paystack after payment. Verifies HMAC signature, activates enrollment on success.

**Headers**
| Header | Value |
|---|---|
| `x-paystack-signature` | HMAC SHA512 of raw body using `PAYSTACK_SECRET_KEY` |

**Body** — raw JSON from Paystack (event shape)
```json
{
  "event": "charge.success",
  "data": {
    "reference": "his_20240617_uuid",
    "status": "success",
    "amount": 1500000
  }
}
```

**Response `200`**
```json
{ "data": null, "message": "OK" }
```

---

### `POST /payments/stripe/initiate`

**Auth required** — create a Stripe PaymentIntent for a course enrollment.

**Body**
```json
{
  "enrollment_id": "uuid",
  "currency": "usd"
}
```

**Response `200`**
```json
{
  "data": {
    "client_secret": "pi_xxx_secret_xxx"
  },
  "message": "Payment intent created"
}
```

**Errors** — `401` `404` `502` (Stripe API error)

---

### `POST /payments/stripe/webhook`

**Public** — Stripe webhook. Uses `express.raw()` body parser (not `express.json()`). Verifies Stripe signature, activates enrollment on `payment_intent.succeeded`.

**Headers**
| Header | Value |
|---|---|
| `stripe-signature` | Stripe webhook signature |

**Response `200`**
```json
{ "data": null, "message": "OK" }
```

---

## 16. Admin

> All admin endpoints require role `admin`. Returns `403` for any other role.

---

### `GET /admin/stats`

Platform-wide dashboard statistics.

**Response `200`**
```json
{
  "data": {
    "total_students": 312,
    "total_instructors": 18,
    "total_courses": 44,
    "total_enrollments": 890,
    "active_enrollments": 754,
    "total_revenue": 13450000,
    "total_certificates_issued": 221,
    "recent_enrollments": [
      {
        "id": "uuid",
        "enrolled_at": "2024-06-17T11:00:00Z",
        "course": { "title": "Intro to FinTech" },
        "student": { "full_name": "Jane Doe" }
      }
    ]
  },
  "message": "OK"
}
```

---

### `GET /admin/students`

List all students with their enrollment counts.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "avatar_url": "https://...",
      "phone": "+2348012345678",
      "created_at": "2024-01-15T00:00:00Z",
      "enrollment_count": 3
    }
  ],
  "message": "OK"
}
```

---

### `PATCH /admin/students/:id/suspend`

Suspend a student — sets all their active enrollments to `suspended`.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (profile) |

No body.

**Response `200`**
```json
{
  "data": { "student_id": "uuid", "suspensions_applied": 3 },
  "message": "Student suspended"
}
```

**Errors** — `401` `403` `404`

---

### `DELETE /admin/students/:id`

Permanently remove a student profile and all their data (cascade).

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (profile) |

**Response `200`**
```json
{ "data": null, "message": "Student removed" }
```

**Errors** — `401` `403` `404`

---

### `GET /admin/courses`

List all courses (published and unpublished) with enrollment counts.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Intro to FinTech",
      "slug": "intro-to-fintech",
      "is_published": true,
      "level": "beginner",
      "price": 15000,
      "created_at": "2024-01-15T00:00:00Z",
      "enrollment_count": 47,
      "faculty": { "name": "FinTech", "slug": "fintech" },
      "instructor": { "full_name": "Dr. Amara Okafor" }
    }
  ],
  "message": "OK"
}
```

---

### `PATCH /admin/courses/:id/publish`

Toggle `is_published` on a course.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Body**
```json
{ "is_published": true }
```

**Response `200`**
```json
{
  "data": { "id": "uuid", "is_published": true },
  "message": "Course published"
}
```

**Errors** — `401` `403` `404` `422`

---

### `DELETE /admin/courses/:id`

Permanently delete a course. Modules, lessons, and enrollments cascade.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid |

**Response `200`**
```json
{ "data": null, "message": "Course deleted" }
```

**Errors** — `401` `403` `404`

---

### `POST /admin/certificates/:id/approve`

Approve a pending enrollment and generate the certificate PDF + QR code.

**Path params**
| Param | Type |
|---|---|
| `id` | uuid (enrollment) |

No body.

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "certificate_no": "HIS-2024-00003",
    "pdf_url": "https://storage.supabase.co/certificates/HIS-2024-00003.pdf",
    "qr_code_url": "https://storage.supabase.co/certificates/HIS-2024-00003-qr.png",
    "issued_at": "2024-06-17T12:00:00Z",
    "approved_by": "uuid",
    "student": { "full_name": "Jane Doe" },
    "course": { "title": "Intro to FinTech" }
  },
  "message": "Certificate approved and issued"
}
```

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Not admin |
| `404` | Enrollment not found |
| `409` | Certificate already issued |

---

## Appendix — Storage Buckets

| Bucket | Contents | Access |
|---|---|---|
| `lessons` | Video and PDF lesson files | Private — URL signed by backend |
| `assignments` | Student assignment uploads | Private |
| `certificates` | Generated certificate PDFs + QR PNGs | Public |
| `thumbnails` | Course and blog thumbnail images | Public |
| `avatars` | Profile pictures | Public |
| `challenge-submissions` | Student innovation challenge files | Private |

---

## Appendix — Async Polling

Community and notifications are updated asynchronously via periodic REST calls — no WebSocket or Supabase Realtime connection is used.

| Feature | Endpoint | Recommended interval |
|---|---|---|
| Community post list | `GET /community` | 30 s |
| Notification bell | `GET /notifications/me` | 30 s |

The frontend calls these endpoints on a `setInterval` while the relevant page/component is mounted, and clears the interval on unmount.

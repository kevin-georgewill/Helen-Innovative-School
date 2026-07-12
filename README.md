# Helen Innovative School (HIS)

> "Where Every Profession Meets Innovation."

A Progressive Web App (PWA) platform for HIS — a future-focused professional learning institution. Students can discover courses, enroll, learn, take assessments, earn certificates, and engage with an innovation community.

---

## Repositories

| Folder      | Stack                                          | Purpose                           |
| ----------- | ---------------------------------------------- | --------------------------------- |
| `frontend/` | Next.js 16 · TypeScript · Tailwind · shadcn/ui | PWA served to users               |
| `backend/`  | Node.js · Express · TypeScript                 | REST API consumed by the frontend |

**Database:** Supabase (PostgreSQL + Auth + Storage)

---

## Architecture

```
frontend/          →    backend/          →    Supabase
Next.js PWA             Node.js API            PostgreSQL
(Vercel)           REST (Railway/Render)       Auth · Storage
                   /api/v1/*
```

- The frontend calls Supabase **only for Auth** (sign in, get session, sign out) to obtain a JWT.
- All other data — courses, enrollments, community, notifications — goes through the backend REST API.
- Every API request carries `Authorization: Bearer <access_token>`.
- The backend validates the token via `supabase.auth.getUser()` using the service role key.
- Community and notifications refresh asynchronously via polling (no WebSocket).

---

## Frontend (`frontend/`)

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Supabase Auth (`@supabase/ssr`)
- **HTTP Client:** Axios (token injected via request interceptor)
- **PWA:** `@ducanh2912/next-pwa`

### Key Directories

```
app/
  (public)/        Public pages — homepage, courses, faculties, blog, events
  (auth)/          Login and register pages
  dashboard/       Student portal
  instructor/      Instructor portal
  admin/           Admin portal
components/
  ui/              shadcn/ui primitives
  shared/          Navbar, Footer, CourseCard, FacultyCard, ProtectedRoute
lib/
  api.ts           Axios client — auto-attaches Supabase access_token
  auth.ts          Auth helpers wrapping supabase.auth
  supabase.ts      Supabase browser client — Auth only (createBrowserClient)
  utils.ts         cn(), formatDate(), formatPrice()
types/
  index.ts         Shared TypeScript types
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
```

> `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used **only for Supabase Auth** (sign in, session, sign out). All other Supabase access goes through the backend.

### Getting Started

```bash
cd frontend
npm install
cp .env.local.example .env.local   # fill in values
npm run dev                         # http://localhost:3000
```

---

## Backend (`backend/`)

### Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript (run with `tsx`)
- **Database / Auth:** Supabase (service role key)
- **Validation:** Zod
- **File Uploads:** Multer → Supabase Storage
- **Payments:** Paystack + Stripe
- **PDF Generation:** pdf-lib + qrcode

### Key Directories

```
index.ts                  Express entry point
src/
  routes/                 One router file per domain, mounted at /api/v1
  controllers/            Business logic called by routers
  middleware/
    auth.ts               authenticateUser — validates Supabase JWT, attaches req.user
    validate.ts           validateRequest(schema) — Zod body validation
    error.ts              Global error handler
    upload.ts             Multer memoryStorage for file uploads
  services/
    supabase.ts           Supabase client (service role)
    paystack.ts           Paystack transaction helpers
    stripe.ts             Stripe PaymentIntent helpers
    email.ts              Transactional email (provider TBD)
    certificate.ts        PDF certificate generation
  types/
    index.ts              UserRole, AuthUser, Express.Request augmentation
  utils/
    index.ts              notImplemented handler
supabase/
  migrations/             SQL migration files
```

### API

All endpoints are prefixed `/api/v1`. A health check is available at `GET /health`.

| Domain                | Base path                            |
| --------------------- | ------------------------------------ |
| Auth                  | `/api/v1/auth`                       |
| Faculties             | `/api/v1/faculties`                  |
| Courses               | `/api/v1/courses`                    |
| Modules & Lessons     | `/api/v1/modules`, `/api/v1/lessons` |
| Enrollments           | `/api/v1/enrollments`                |
| Progress              | `/api/v1/progress`                   |
| Assessments           | `/api/v1/assessments`                |
| Certificates          | `/api/v1/certificates`               |
| Events                | `/api/v1/events`                     |
| Community             | `/api/v1/community`                  |
| Innovation Challenges | `/api/v1/challenges`                 |
| Blog                  | `/api/v1/blog`                       |
| Payments              | `/api/v1/payments`                   |
| Admin                 | `/api/v1/admin`                      |

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
PORT=4000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
PAYSTACK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000
```

### Getting Started

```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm run dev            # http://localhost:4000
```

---

## User Roles

| Role         | Access                                                                               |
| ------------ | ------------------------------------------------------------------------------------ |
| `student`    | Enroll in courses, learn, take assessments, download certificates, join community    |
| `instructor` | Create and manage courses, upload lessons, create assessments, view student progress |
| `admin`      | Full platform access — manage students, faculties, certificates, events, challenges  |

---

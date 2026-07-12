import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS. Use for admin operations and all DB access.
// IMPORTANT: never call user-session methods (e.g. signInWithPassword) on this client;
// doing so mutates its in-memory session and changes the auth header it sends, which
// would make subsequent DB calls run as that user (subject to RLS) instead of service role.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

// Dedicated, throwaway client for password sign-ins. Uses the anon key, like a normal
// client would, and never persists a session — so it can't poison the service client.
export const createAuthClient = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

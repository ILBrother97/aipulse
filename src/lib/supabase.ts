import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client type definition
 */
export type SupabaseClient = ReturnType<typeof createClient>;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

/**
 * Initializes and returns the Supabase client instance.
 * Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment variables.
 *
 * @returns {SupabaseClient} The configured Supabase client
 * @throws {Error} If required environment variables are missing
 *
 * @example
 * ```ts
 * import { supabase } from '@/lib/supabase';
 *
 * // Use the client for auth operations
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password'
 * });
 * ```
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Gets the current authenticated user from the active session.
 *
 * @returns {Promise<User | null>} The current user or null if not authenticated
 *
 * @example
 * ```ts
 * import { getCurrentUser } from '@/lib/supabase';
 *
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('User ID:', user.id);
 * }
 * ```
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Gets the current active session.
 *
 * @returns {Promise<Session | null>} The current session or null if not authenticated
 *
 * @example
 * ```ts
 * import { getSession } from '@/lib/supabase';
 *
 * const session = await getSession();
 * if (session) {
 *   console.log('Access token:', session.access_token);
 * }
 * ```
 */
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

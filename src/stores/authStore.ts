import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Profile data from the profiles table
 */
export interface Profile {
  id: string;
  is_premium: boolean;
  created_at: string;
  stripe_customer_id: string | null;
}

/**
 * Authentication store state interface
 */
interface AuthState {
  /** Current authenticated user or null if not logged in */
  user: User | null;
  /** Whether the user has premium access */
  isPremium: boolean;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error message from last operation */
  error: string | null;
}

/**
 * Authentication store actions interface
 */
interface AuthActions {
  /**
   * Sign in with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise that resolves on success or rejects with error
   */
  signIn: (email: string, password: string) => Promise<void>;

  /**
   * Sign up a new user with email and password
   * @param email - User's email address
   * @param password - User's password (min 6 characters)
   * @returns Promise that resolves on success or rejects with error
   */
  signUp: (email: string, password: string) => Promise<void>;

  /**
   * Sign in with Google OAuth
   * @returns Promise that resolves on success or rejects with error
   */
  signInWithGoogle: () => Promise<void>;

  /**
   * Sign out the current user
   * @returns Promise that resolves when signout is complete
   */
  signOut: () => Promise<void>;

  /**
   * Fetch the user's profile and update premium status
   * @returns Promise that resolves when profile is fetched
   */
  fetchProfile: () => Promise<void>;

  /**
   * Set the current user (used by auth state listener)
   * @param user - The authenticated user or null
   */
  setUser: (user: User | null) => void;

  /**
   * Clear any error messages
   */
  clearError: () => void;
}

/**
 * Combined auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Creates the authentication store using Zustand with persistence.
 * Handles user authentication, premium status tracking, and session management.
 *
 * @example
 * ```ts
 * import { useAuthStore } from '@/stores/authStore';
 *
 * function MyComponent() {
 *   const { user, isPremium, signIn, signOut } = useAuthStore();
 *
 *   return (
 *     <div>
 *       {user ? (
 *         <button onClick={signOut}>Sign Out</button>
 *       ) : (
 *         <button onClick={() => signIn('email', 'password')}>Sign In</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isPremium: false,
      isLoading: false,
      error: null,

      // Actions
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set({ user: data.user, isLoading: false });
          // Fetch profile after successful sign in
          await get().fetchProfile();
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          set({ user: data.user, isLoading: false });
          // Profile will be created automatically via database trigger
          if (data.user) {
            await get().fetchProfile();
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
          // OAuth redirect will handle the rest, state updates on return
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            user: null,
            isPremium: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) {
          set({ isPremium: false });
          return;
        }

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', user.id)
            .single<{ is_premium: boolean }>();

          if (error) {
            console.error('Error fetching profile:', error);
            set({ isPremium: false });
            return;
          }

          set({ isPremium: data?.is_premium ?? false });
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          set({ isPremium: false });
        }
      },

      setUser: (user: User | null) => {
        set({ user });
        if (user) {
          get().fetchProfile();
        } else {
          set({ isPremium: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isPremium: state.isPremium,
      }),
    }
  )
);

/**
 * Initialize auth state listener to handle session changes.
 * Call this once in your app's entry point (e.g., main.tsx or App.tsx).
 *
 * @example
 * ```tsx
 * import { initializeAuthListener } from '@/stores/authStore';
 *
 * function App() {
 *   useEffect(() => {
 *     const unsubscribe = initializeAuthListener();
 *     return () => unsubscribe();
 *   }, []);
 *
 *   return <YourApp />;
 * }
 * ```
 */
export function initializeAuthListener(): () => void {
  const { setUser } = useAuthStore.getState();

  // Set initial user
  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user);
  });

  // Listen for auth state changes
  const { data: subscription } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
    }
  );

  // Return unsubscribe function
  return () => {
    subscription.subscription.unsubscribe();
  };
}

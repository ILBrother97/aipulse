import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Chrome,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

/**
 * Props for the AuthModal component
 */
export interface AuthModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Initial tab to show */
  defaultTab?: 'signin' | 'signup';
}

/**
 * Premium authentication modal with polished UI, animations, and full functionality.
 * Features tabbed sign in/up, Google OAuth, form validation, and error handling.
 *
 * @example
 * ```tsx
 * import { AuthModal } from '@/components/ui';
 * import { useState } from 'react';
 *
 * function App() {
 *   const [showAuth, setShowAuth] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setShowAuth(true)}>Sign In</button>
 *       <AuthModal
 *         isOpen={showAuth}
 *         onClose={() => setShowAuth(false)}
 *         defaultTab="signin"
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultTab = 'signin' 
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { signIn, signUp, signInWithGoogle, isLoading, error, clearError } = useAuthStore();

  // Clear errors when switching tabs or closing
  const handleTabChange = useCallback((tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handleClose = useCallback(() => {
    setLocalError(null);
    clearError();
    setEmail('');
    setPassword('');
    onClose();
  }, [clearError, onClose]);

  const validateForm = useCallback(() => {
    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setLocalError('Please enter your password');
      return false;
    }
    if (activeTab === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    return true;
  }, [email, password, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!validateForm()) return;

    try {
      if (activeTab === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      handleClose();
    } catch (err) {
      // Error is handled by the store, displayed below
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // OAuth redirects, modal closes on return
    } catch (err) {
      // Error handled by store
    }
  };

  const displayError = localError || error;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container - perfectly centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-md mx-4',
          'bg-white dark:bg-gray-900',
          'rounded-2xl shadow-2xl',
          'overflow-hidden',
          'max-h-[90vh] overflow-y-auto'
        )}
      >
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-br from-primary via-primary-dark to-primary px-6 py-8">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo & Title */}
            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-4"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                {activeTab === 'signin' ? 'Welcome Back' : 'Join AIPulse'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 mt-1 text-sm"
              >
                {activeTab === 'signin' 
                  ? 'Sign in to manage your AI tools' 
                  : 'Create an account to get started'}
              </motion.p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tab Switcher */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
              {(['signin', 'signup'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300',
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-700 text-primary shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Error Display */}
            <AnimatePresence mode="wait">
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{displayError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google OAuth */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={cn(
                'w-full flex items-center justify-center gap-3 px-4 py-3 mb-4',
                'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
                'rounded-xl font-medium text-gray-700 dark:text-gray-200',
                'hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary',
                'hover:shadow-lg hover:shadow-primary/10',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
              )}
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  or with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className={cn(
                  'relative flex items-center rounded-xl border-2 bg-gray-50 dark:bg-gray-800',
                  'transition-all duration-200',
                  focusedField === 'email' 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <Mail className={cn(
                    'absolute left-4 w-5 h-5 transition-colors duration-200',
                    focusedField === 'email' ? 'text-primary' : 'text-gray-400'
                  )} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={cn(
                      'w-full pl-12 pr-4 py-3.5 rounded-xl',
                      'bg-transparent text-gray-900 dark:text-white placeholder-gray-400',
                      'focus:outline-none'
                    )}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className={cn(
                  'relative flex items-center rounded-xl border-2 bg-gray-50 dark:bg-gray-800',
                  'transition-all duration-200',
                  focusedField === 'password' 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <Lock className={cn(
                    'absolute left-4 w-5 h-5 transition-colors duration-200',
                    focusedField === 'password' ? 'text-primary' : 'text-gray-400'
                  )} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={activeTab === 'signup' ? 'Min 6 characters' : 'Your password'}
                    className={cn(
                      'w-full pl-12 pr-12 py-3.5 rounded-xl',
                      'bg-transparent text-gray-900 dark:text-white placeholder-gray-400',
                      'focus:outline-none'
                    )}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              {activeTab === 'signin' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {/* TODO: Implement forgot password */}}
                    className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-6 py-3.5',
                  'bg-gradient-to-r from-primary to-primary-dark',
                  'text-black font-bold rounded-xl',
                  'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40',
                  'hover:from-primary-light hover:to-primary',
                  'transition-all duration-300',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg'
                )}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => handleTabChange('signup')}
                      className="font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => handleTabChange('signin')}
                      className="font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
              
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms</a>
                {' & '}
                <a href="#" className="text-primary hover:underline">Privacy</a>
              </p>
            </div>
          </div>
        </motion.div>
    </AnimatePresence>
  );
}

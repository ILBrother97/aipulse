import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  LogOut, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

/**
 * User menu dropdown for authenticated users.
 * Displays user info, premium badge, and account actions.
 *
 * @example
 * ```tsx
 * import { UserMenu } from '@/components/ui';
 *
 * function Header() {
 *   const { user } = useAuthStore();
 *
 *   if (!user) return <button>Sign In</button>;
 *
 *   return <UserMenu onOpenSettings={() => setShowSettings(true)} />;
 * }
 * ```
 */
export default function UserMenu({ 
  onOpenSettings 
}: { 
  onOpenSettings?: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isPremium, signOut } = useAuthStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      // Error handled by auth store
    } finally {
      setIsSigningOut(false);
    }
  };

  const userEmail = user?.email || 'User';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0];

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2 py-2 rounded-xl',
          'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700',
          'hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-primary/5',
          'transition-all duration-300',
          isOpen && 'bg-white dark:bg-gray-800 shadow-lg shadow-primary/10'
        )}
      >
        {/* Avatar */}
        <div className="relative">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
            'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
            'transition-all duration-300',
            isPremium 
              ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white ring-amber-400/50 shadow-lg shadow-amber-400/30'
              : 'bg-gradient-to-br from-primary to-primary-dark text-black ring-primary/50 shadow-lg shadow-primary/20'
          )}>
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt={userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="drop-shadow-sm">{userInitial}</span>
            )}
          </div>
          
          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
              <Crown className="w-2 h-2 text-white" />
            </div>
          )}
          
          {/* Online Status Indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
        </div>
        
        {/* User Info */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">
            {userName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
            {userEmail}
          </span>
        </div>
        
        {/* Chevron */}
        <ChevronDown className={cn(
          'w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-300',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute right-0 top-full mt-2 w-64',
              'bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl',
              'rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40',
              'border border-gray-200/50 dark:border-gray-700/50',
              'z-50 overflow-hidden'
            )}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {/* Mini Avatar */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base',
                  'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
                  isPremium 
                    ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white ring-amber-400/50'
                    : 'bg-gradient-to-br from-primary to-primary-dark text-black ring-primary/50'
                )}>
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt={userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="drop-shadow-sm">{userInitial}</span>
                  )}
                </div>
                
                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {userName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {userEmail}
                  </p>
                  {isPremium && (
                    <div className="flex items-center gap-1 mt-1">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        Premium Member
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5">
              {onOpenSettings && (
                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-xl',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'hover:text-gray-900 dark:hover:text-white',
                    'transition-all duration-200',
                    'group'
                  )}
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 transition-colors">
                    <Settings className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium">Settings</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage your preferences</p>
                  </div>
                </button>
              )}

              {/* Divider */}
              <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-xl',
                  'text-red-600 dark:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-900/30',
                  'hover:text-red-700 dark:hover:text-red-300',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'group'
                )}
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
                  {isSigningOut ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium">
                    {isSigningOut ? 'Signing out...' : 'Sign Out'}
                  </span>
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {isSigningOut ? 'Please wait...' : 'Sign out of your account'}
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const userEmail = user?.email || 'User';
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'bg-gray-100 dark:bg-background-dark',
          'hover:bg-gray-200 dark:hover:bg-background-card',
          'transition-all duration-200',
          isOpen && 'bg-gray-200 dark:bg-background-card'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm',
          isPremium 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
            : 'bg-primary text-black'
        )}>
          {userInitial}
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-gray-500 dark:text-text-secondary transition-transform duration-200',
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
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-2 w-64',
              'bg-white dark:bg-background-card',
              'rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30',
              'border border-gray-200 dark:border-border',
              'z-50 overflow-hidden'
            )}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-border">
              <p className="font-medium text-gray-900 dark:text-text-primary truncate">
                {userEmail}
              </p>
              {isPremium && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    Premium Member
                  </span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-1">
              {onOpenSettings && (
                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'text-gray-700 dark:text-text-secondary',
                    'hover:bg-gray-100 dark:hover:bg-background-dark',
                    'transition-colors duration-150'
                  )}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              )}

              <button
                onClick={handleSignOut}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'text-red-600 dark:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-900/20',
                  'transition-colors duration-150'
                )}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

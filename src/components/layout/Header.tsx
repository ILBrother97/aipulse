import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, BarChart2, GitBranch, Clock, Keyboard, BookOpen, ChevronDown } from 'lucide-react';
import { Button } from '../ui';
import SearchBar from '../features/SearchBar';
import ThemeToggle from '../features/ThemeToggle';
import ViewToggle from '../features/ViewToggle';
import { useToolsStore } from '../../stores/toolsStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import AuthModal from '../ui/AuthModal';
import UserMenu from '../ui/UserMenu';

interface HeaderProps {
  onAddTool: () => void;
  onShowShortcuts: () => void;
  onShowActivity: () => void;
}

type Page = 'home' | 'analytics' | 'workflows' | 'settings';

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'workflows', label: 'Workflows', icon: GitBranch },
];

const resourceLinks = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'API Reference', href: '/api', icon: GitBranch },
  { name: 'Guides', href: '/guides', icon: Clock },
  { name: 'Support', href: '/support', icon: Settings },
];

export default function Header({ onAddTool, onShowShortcuts, onShowActivity }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPage, setCurrentPage, settings } = useToolsStore();
  const { user } = useAuthStore();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isResourcePage = ['/docs', '/api', '/guides', '/support'].includes(location.pathname);
  
  // Animation based on intensity
  const animationVariants = {
    subtle: { duration: 0.2, ease: "easeOut" as const },
    normal: { duration: 0.4, ease: "easeOut" as const },
    bold: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
    none: { duration: 0, ease: "linear" as const }
  };
  
  const currentAnimation = animationVariants[settings.animationIntensity] || animationVariants.normal;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={currentAnimation}
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-border-light dark:border-border overflow-x-hidden"
    >
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 gap-2 min-w-0">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, ...currentAnimation }}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
          >
            <button
              onClick={() => {
                if (isResourcePage) {
                  navigate('/');
                } else {
                  setCurrentPage('home');
                }
              }}
              className="logo-3d-container flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src="/logo.svg" alt="AIPulse" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl" />
              <span className="text-xl font-bold text-gray-900 dark:text-text-primary hidden sm:block">AIPulse</span>
            </button>

            {/* Nav links — desktop */}
            <nav className="hidden lg:flex items-center gap-1 min-w-0 flex-1 justify-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isResourcePage) {
                      navigate('/');
                      setTimeout(() => setCurrentPage(item.id), 100);
                    } else {
                      setCurrentPage(item.id);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    (!isResourcePage && currentPage === item.id)
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary dark:text-text-mutedDark hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card'
                  )}
                >
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
              
              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isResourcesOpen
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary dark:text-text-mutedDark hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card'
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isResourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-background-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="py-2">
                        {resourceLinks.map((link) => (
                          <button
                            key={link.name}
                            onClick={() => {
                              navigate(link.href);
                              setIsResourcesOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary dark:text-text-mutedDark hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-dark transition-colors"
                          >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </motion.div>

          {/* Search Bar - Center */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...currentAnimation }}
            className="flex-1 max-w-xl"
          >
            {currentPage === 'home' && <SearchBar />}
          </motion.div>

          {/* Actions - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ...currentAnimation }}
            className="flex items-center gap-1.5 flex-shrink-0"
          >
            {/* View toggle — only on home */}
            {currentPage === 'home' && (
              <div className="hidden sm:block">
                <ViewToggle />
              </div>
            )}

            <ThemeToggle />

            {/* Activity log */}
            <button
              onClick={onShowActivity}
              className="p-2 rounded-xl text-text-secondary dark:text-text-mutedDark hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors"
              title="Activity Log"
              aria-label="Activity Log"
            >
              <Clock className="w-4 h-4" />
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={onShowShortcuts}
              className="p-2 rounded-xl text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors hidden sm:flex items-center"
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                if (isResourcePage) {
                  navigate('/');
                  setTimeout(() => setCurrentPage('settings'), 100);
                } else {
                  setCurrentPage('settings');
                }
              }}
              className={cn(
                'p-2 rounded-xl transition-colors',
                (!isResourcePage && currentPage === 'settings')
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary dark:text-text-mutedDark hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card'
              )}
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Add Tool — only on home */}
            {currentPage === 'home' && (
              <>
                <Button
                  onClick={onAddTool}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="hidden sm:flex"
                  size="sm"
                >
                  Add Tool
                </Button>
                <Button
                  onClick={onAddTool}
                  size="sm"
                  className="sm:hidden p-2"
                  aria-label="Add Tool"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Auth Section */}
            {user ? (
              <UserMenu 
                onOpenSettings={() => {
                  if (isResourcePage) {
                    navigate('/');
                    setTimeout(() => setCurrentPage('settings'), 100);
                  } else {
                    setCurrentPage('settings');
                  }
                }} 
              />
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                variant="primary"
                size="sm"
              >
                Sign In
              </Button>
            )}
          </motion.div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => {
              if (isResourcePage) {
                navigate('/');
              } else {
                setCurrentPage('home');
              }
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
              (!isResourcePage && currentPage === 'home') ? 'text-primary bg-primary/10' : 'text-text-secondary dark:text-text-mutedDark'
            )}
          >
            <span className="w-3.5 h-3.5">🏠</span> Home
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (isResourcePage) {
                  navigate('/');
                  setTimeout(() => setCurrentPage(item.id), 100);
                } else {
                  setCurrentPage(item.id);
                }
              }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                (!isResourcePage && currentPage === item.id) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-text-muted'
              )}
            >
              <item.icon className="w-3.5 h-3.5" /> {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="signin"
      />
    </motion.header>
  );
}

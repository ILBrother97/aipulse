import { motion } from 'framer-motion';
import { Plus, Settings, BarChart2, Clock, Keyboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui';
import SearchBar from '../features/SearchBar';
import ViewToggle from '../features/ViewToggle';
import { useToolsStore } from '../../stores/toolsStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import AuthModal from '../ui/AuthModal';
import UserMenu from '../ui/UserMenu';

interface HeaderProps {
  onAddTool: () => void;
  onShowShortcuts: () => void;
  onShowActivity: () => void;
}

type Page = 'home' | 'analytics' | 'settings';

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];


export default function Header({ onAddTool, onShowShortcuts, onShowActivity }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPage, setCurrentPage, settings } = useToolsStore();
  const { user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
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
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 gap-3">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, ...currentAnimation }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <button
              onClick={() => setCurrentPage('home')}
              className="logo-3d-container flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src="/logo.svg" alt="AIPulse" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg" />
              <span className="text-lg font-bold text-gray-900 hidden sm:block">AIPulse</span>
            </button>

            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center gap-1 ml-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200',
                    currentPage === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
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

            {/* Activity log */}
            <button
              onClick={onShowActivity}
              className="p-1.5 rounded-xl text-text-secondary hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Activity Log"
              aria-label="Activity Log"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={onShowShortcuts}
              className="p-1.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors hidden sm:flex items-center"
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setCurrentPage('settings')}
              className={cn(
                'p-1.5 rounded-xl transition-colors',
                currentPage === 'settings'
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-gray-900 hover:bg-gray-100'
              )}
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
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
                onOpenSettings={() => setCurrentPage('settings')} 
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
        <div className="md:hidden flex items-center gap-1 pb-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setCurrentPage('home')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
              currentPage === 'home' ? 'text-primary bg-primary/10' : 'text-text-secondary'
            )}
          >
            <span className="w-3 h-3">🏠</span> Home
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                currentPage === item.id ? 'text-primary bg-primary/10' : 'text-gray-600'
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

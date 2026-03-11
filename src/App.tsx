import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeAuthListener } from './stores/authStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CategoryTabs from './components/features/CategoryTabs';
import RecentlyUsed from './components/features/RecentlyUsed';
import ToolGrid from './components/features/ToolGrid';
import FavoritesSection from './components/features/FavoritesSection';
import AnalyticsPage from './components/features/AnalyticsPage';
import WorkflowsPage from './components/features/WorkflowsPage';
import SettingsPage from './components/features/SettingsPage';
import AIAssistant from './components/features/AIAssistant';
import ToolModal from './components/modals/ToolModal';
import DeleteModal from './components/modals/DeleteModal';
import CollectionModal from './components/modals/CollectionModal';
import AddToCollectionModal from './components/modals/AddToCollectionModal';
import KeyboardShortcutsModal from './components/modals/KeyboardShortcutsModal';
import ActivityLogModal from './components/modals/ActivityLogModal';
import { ToastContainer } from './components/ui';
import type { AITool, Collection } from './types/index';
import { useToolsStore, accentColors } from './stores/toolsStore';
import { applyTheme } from './utils/theme';
import Documentation from './pages/Documentation';
import APIReference from './pages/APIReference';
import Guides from './pages/Guides';
import Support from './pages/Support';

function App() {
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isAddToCollectionOpen, setIsAddToCollectionOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [collectionTarget, setCollectionTarget] = useState<Collection | null>(null);
  const [toolForCollection, setToolForCollection] = useState<AITool | null>(null);

  const { isDarkMode, settings, currentPage, setCurrentPage, updateSettings } = useToolsStore();

  // Generate dynamic CSS for accent color only
  const dynamicStyles = useMemo(() => {
    const accent = accentColors[settings.themeAccent] || accentColors.teal;
    const darken = (hex: string, amount: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.max((num >> 16) - amount, 0);
      const g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
      const b = Math.max((num & 0x0000FF) - amount, 0);
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };
    const lighten = (hex: string, amount: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min((num >> 16) + amount, 255);
      const g = Math.min(((num >> 8) & 0x00FF) + amount, 255);
      const b = Math.min((num & 0x0000FF) + amount, 255);
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };
    
    return `
      :root {
        --color-accent: ${accent};
        --color-accent-dark: ${darken(accent, 30)};
        --color-accent-light: ${lighten(accent, 30)};
      }
    `;
  }, [settings.themeAccent]);

  // Apply theme on mount and whenever settings/dark mode change
  useEffect(() => {
    applyTheme(settings, isDarkMode);
  }, [settings, isDarkMode]);

  // Initialize auth state listener on mount
  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, []);

  // ── Keyboard shortcuts ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // ? or Ctrl+/ → shortcuts modal
      if (e.key === '?' && !ctrl) {
        setIsShortcutsOpen((o) => !o);
        return;
      }
      if (ctrl && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen((o) => !o);
        return;
      }
      if (ctrl && e.key === 'n') {
        e.preventDefault();
        setSelectedTool(null);
        setIsToolModalOpen(true);
        return;
      }
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        setCurrentPage('analytics');
        return;
      }
      if (ctrl && e.key === 's') {
        e.preventDefault();
        setCurrentPage('settings');
        return;
      }
      if (ctrl && e.key === 'k') {
        e.preventDefault();
        (document.querySelector('[data-search-input]') as HTMLInputElement)?.focus();
        return;
      }
      // Ctrl+1/2/3/4 view modes
      if (ctrl && e.key === '1') { e.preventDefault(); updateSettings({ viewMode: 'grid' }); }
      if (ctrl && e.key === '2') { e.preventDefault(); updateSettings({ viewMode: 'list' }); }
      if (ctrl && e.key === '3') { e.preventDefault(); updateSettings({ viewMode: 'expanded' }); }
      if (ctrl && e.key === '4') { e.preventDefault(); updateSettings({ viewMode: 'kanban' }); }

      // Esc → close any open modal
      if (e.key === 'Escape') {
        setIsToolModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsCollectionModalOpen(false);
        setIsAddToCollectionOpen(false);
        setIsShortcutsOpen(false);
        setIsActivityOpen(false);
      }
    },
    [setCurrentPage, updateSettings]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleAddTool = () => { setSelectedTool(null); setIsToolModalOpen(true); };
  const handleEditTool = (tool: AITool) => { setSelectedTool(tool); setIsToolModalOpen(true); };
  const handleDeleteTool = (tool: AITool) => { setSelectedTool(tool); setIsDeleteModalOpen(true); };
  const handleAddToCollection = (tool: AITool) => { setToolForCollection(tool); setIsAddToCollectionOpen(true); };

  return (
    <Router>
      <div className={`min-h-screen bg-background-light dark:bg-background-dark text-text-primaryLight dark:text-text-primary transition-colors duration-300 ${settings.reduceMotion ? 'reduce-motion' : ''} animation-${settings.animationIntensity}`}>
        {/* Dynamic Theme Styles */}
        <style>{dynamicStyles}</style>

        {/* Header - Always visible */}
        <Header
          onAddTool={handleAddTool}
          onShowShortcuts={() => setIsShortcutsOpen(true)}
          onShowActivity={() => setIsActivityOpen(true)}
        />

        <Routes>
          {/* Main App Route */}
          <Route path="/" element={
            <main className="pt-20 pb-16 px-3 sm:px-4 lg:px-6 min-h-screen">
              <div className="w-full max-w-none sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  {/* ── HOME PAGE ──────────────────────────────────────── */}
                  {currentPage === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Category Tabs */}
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                      >
                        <CategoryTabs
                          onCreateCollection={() => {
                            setCollectionTarget(null);
                            setIsCollectionModalOpen(true);
                          }}
                          onEditCollection={(col) => {
                            setCollectionTarget(col);
                            setIsCollectionModalOpen(true);
                          }}
                        />
                      </motion.section>

                      {/* Favorites Section */}
                      <FavoritesSection />

                      {/* Recently Used */}
                      <RecentlyUsed onToolClick={() => {}} />

                      {/* Tool Grid */}
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ToolGrid
                          onEditTool={handleEditTool}
                          onDeleteTool={handleDeleteTool}
                          onAddTool={handleAddTool}
                          onAddToCollection={handleAddToCollection}
                        />
                      </motion.section>
                    </motion.div>
                  )}

                  {/* ── ANALYTICS PAGE ─────────────────────────────────── */}
                  {currentPage === 'analytics' && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AnalyticsPage />
                    </motion.div>
                  )}

                  {/* ── WORKFLOWS PAGE ─────────────────────────────────── */}
                  {currentPage === 'workflows' && (
                    <motion.div
                      key="workflows"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <WorkflowsPage />
                    </motion.div>
                  )}

                  {/* ── SETTINGS PAGE ──────────────────────────────────── */}
                  {currentPage === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SettingsPage />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          } />

          {/* Resource Pages Routes */}
          <Route path="/docs" element={
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
              <Documentation />
            </main>
          } />
          <Route path="/api" element={
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
              <APIReference />
            </main>
          } />
          <Route path="/guides" element={
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
              <Guides />
            </main>
          } />
          <Route path="/support" element={
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
              <Support />
            </main>
          } />
        </Routes>

        {/* Footer */}
        <Footer />

        {/* AI Assistant (floating) */}
        <AIAssistant />

        {/* Toast Notifications */}
        <ToastContainer />

        {/* ── Modals ────────────────────────────────────────────────── */}
        <ToolModal
          isOpen={isToolModalOpen}
          onClose={() => { setIsToolModalOpen(false); setSelectedTool(null); }}
          tool={selectedTool}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedTool(null); }}
          tool={selectedTool}
        />
        <CollectionModal
          isOpen={isCollectionModalOpen}
          onClose={() => { setIsCollectionModalOpen(false); setCollectionTarget(null); }}
          collection={collectionTarget}
        />
        <AddToCollectionModal
          isOpen={isAddToCollectionOpen}
          onClose={() => { setIsAddToCollectionOpen(false); setToolForCollection(null); }}
          tool={toolForCollection}
          onCreateCollection={() => { setIsAddToCollectionOpen(false); setIsCollectionModalOpen(true); }}
        />
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
        <ActivityLogModal
          isOpen={isActivityOpen}
          onClose={() => setIsActivityOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;

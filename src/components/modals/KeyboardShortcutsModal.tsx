import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Open search / focus search bar' },
      { keys: ['Ctrl', 'S'], description: 'Open settings' },
      { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
      { keys: ['Ctrl', 'D'], description: 'Open analytics dashboard' },
      { keys: ['Esc'], description: 'Close modals / deselect' },
    ],
  },
  {
    category: 'View Modes',
    items: [
      { keys: ['Ctrl', '1'], description: 'Switch to Grid view' },
      { keys: ['Ctrl', '2'], description: 'Switch to List view' },
      { keys: ['Ctrl', '3'], description: 'Switch to Expanded view' },
      { keys: ['Ctrl', '4'], description: 'Switch to Kanban view' },
    ],
  },
  {
    category: 'Tool Actions',
    items: [
      { keys: ['Tab'], description: 'Navigate between tools' },
    ],
  },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              className="pointer-events-auto w-full max-w-2xl bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Keyboard Shortcuts</h2>
                    <p className="text-xs text-gray-500">Press <Kbd>?</Kbd> or <Kbd>Ctrl</Kbd><Kbd>/</Kbd> to toggle this</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {shortcuts.map((section) => (
                    <div key={section.category}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {section.category}
                      </h3>
                      <div className="space-y-2">
                        {section.items.map((item) => (
                          <div key={item.description} className="flex items-center justify-between gap-4">
                            <span className="text-sm text-gray-600">{item.description}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {item.keys.map((key, i) => (
                                <span key={i} className="flex items-center gap-1">
                                  <Kbd>{key}</Kbd>
                                  {i < item.keys.length - 1 && <span className="text-gray-500 text-xs">+</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  On Mac, use <Kbd>⌘</Kbd> instead of <Kbd>Ctrl</Kbd>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center px-2 py-0.5 min-w-[24px] h-6 bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 shadow-sm">
      {children}
    </kbd>
  );
}

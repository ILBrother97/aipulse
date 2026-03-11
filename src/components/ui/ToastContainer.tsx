import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border max-w-sm min-w-[260px] ${
              t.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/90 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100'
                : t.type === 'error'
                ? 'bg-red-100 dark:bg-red-900/90 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100'
                : 'bg-white dark:bg-background-card border-gray-200 dark:border-border text-gray-900 dark:text-text-primary'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-primary flex-shrink-0" />}
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

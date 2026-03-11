import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';

export default function FavoritesSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { getFavoriteTools, recordUsage, settings } = useToolsStore();
  const favorites = getFavoriteTools();
  
  // Animation based on intensity
  const animationVariants = {
    subtle: { duration: 0.2, ease: "easeOut" as const },
    normal: { duration: 0.3, ease: "easeOut" as const },
    bold: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
    none: { duration: 0, ease: "linear" as const }
  };
  
  const currentAnimation = animationVariants[settings.animationIntensity] || animationVariants.normal;

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={currentAnimation}
      className="mb-6"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary transition-colors mb-3 group"
      >
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-semibold">Favorites</span>
        <span className="text-xs text-gray-500 dark:text-text-muted bg-gray-100 dark:bg-background-card px-2 py-0.5 rounded-full">{favorites.length}</span>
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={currentAnimation}>
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={currentAnimation}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {favorites.map((tool, i) => {
                const IconComponent = tool.icon
                  ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
                  : null;
                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, ...currentAnimation }}
                    whileHover={{ scale: settings.animationIntensity === 'none' ? 1 : 1.05 }}
                    whileTap={{ scale: settings.animationIntensity === 'none' ? 1 : 0.95 }}
                    onClick={() => { recordUsage(tool.id); window.open(tool.url, '_blank', 'noopener,noreferrer'); }}
                    className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                      {IconComponent
                        ? <IconComponent className="w-5 h-5 text-yellow-400" />
                        : <LucideIcons.Zap className="w-5 h-5 text-yellow-400" />
                      }
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-text-primary truncate w-full text-center">{tool.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-500 dark:text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

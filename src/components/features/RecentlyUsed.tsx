import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { useToolsStore } from '../../stores/toolsStore';
import type { AITool } from '../../types/index';
import { cn } from '../../utils/cn';

interface RecentlyUsedProps {
  onToolClick: (tool: AITool) => void;
}

export default function RecentlyUsed({ onToolClick }: RecentlyUsedProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { getRecentlyUsedTools, addToRecentlyUsed, settings } = useToolsStore();
  const recentTools = getRecentlyUsedTools();
  
  // Animation based on intensity
  const animationVariants = {
    subtle: { duration: 0.2, ease: "easeOut" as const },
    normal: { duration: 0.3, ease: "easeOut" as const },
    bold: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
    none: { duration: 0, ease: "linear" as const }
  };
  
  const currentAnimation = animationVariants[settings.animationIntensity] || animationVariants.normal;

  if (recentTools.length === 0) return null;

  const handleToolClick = (tool: AITool) => {
    addToRecentlyUsed(tool.id);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={currentAnimation}
      className="mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Recently Used</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={currentAnimation}
          >
            <LucideIcons.ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Tools List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={currentAnimation}
            className="overflow-hidden"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentTools.slice(0, 6).map((tool, index) => {
                const IconComponent = tool.icon
                  ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
                  : null;

                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, ...currentAnimation }}
                    whileHover={{ scale: settings.animationIntensity === 'none' ? 1 : 1.03 }}
                    whileTap={{ scale: settings.animationIntensity === 'none' ? 1 : 0.97 }}
                    onClick={() => handleToolClick(tool)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border',
                      'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group'
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {IconComponent ? (
                        <IconComponent className="w-4 h-4 text-primary" />
                      ) : (
                        <LucideIcons.Zap className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-text-primary whitespace-nowrap">
                        {tool.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-text-muted">{tool.category}</p>
                    </div>
                    <LucideIcons.ExternalLink className="w-4 h-4 text-gray-500 dark:text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
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

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Pencil, Trash2, GripVertical, Star, Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { AITool, ViewMode } from '../../types/index';
import { useToolsStore } from '../../stores/toolsStore';
import { toast } from '../../stores/toastStore';
import { cn } from '../../utils/cn';

interface ToolCardProps {
  tool: AITool;
  onEdit: (tool: AITool) => void;
  onDelete: (tool: AITool) => void;
  onAddToCollection?: (tool: AITool) => void;
  index: number;
  viewMode?: ViewMode;
}

export default function ToolCard({
  tool,
  onEdit,
  onDelete,
  onAddToCollection,
  index,
  viewMode = 'grid',
}: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { recordUsage, toggleFavorite, settings } = useToolsStore();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tool.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const IconComponent = tool.icon
    ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : null;

  const handleLaunch = () => {
    recordUsage(tool.id);
    const target = settings.defaultLaunchBehavior === 'current-tab' ? '_self' : '_blank';
    window.open(tool.url, target, 'noopener,noreferrer');
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(tool.id);
    toast.success(tool.isFavorite ? `Removed "${tool.name}" from favorites` : `Added "${tool.name}" to favorites`);
  };

  const cardRadius = settings.borderRadius === 'sharp' ? 'rounded-lg' : settings.borderRadius === 'very-rounded' ? 'rounded-3xl' : 'rounded-2xl';
  
  // Animation variants based on intensity
  const animationVariants = {
    subtle: { duration: 0.15, ease: "easeOut" as const },
    normal: { duration: 0.3, ease: "easeOut" as const },
    bold: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
    none: { duration: 0, ease: "linear" as const }
  };
  
  const currentAnimation = animationVariants[settings.animationIntensity] || animationVariants.normal;
  
  // Hover lift based on animation intensity
  const hoverLift = {
    subtle: -2,
    normal: -4,
    bold: -8,
    none: 0
  };

  // ── LIST VIEW ───────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isDragging ? 0.5 : 1, x: 0 }}
        transition={currentAnimation}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          `group flex items-center gap-3 px-3 py-2 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border ${cardRadius} transition-all`,
          'hover:border-primary/50',
          isDragging && 'opacity-50'
        )}
        whileHover={{ y: hoverLift[settings.animationIntensity], scale: settings.animationIntensity === 'bold' ? 1.02 : 1 }}
      >
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 dark:text-text-muted">
          <GripVertical className="w-3.5 h-3.5" />
        </div>
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          {IconComponent ? <IconComponent className="w-4 h-4 text-primary" /> : <LucideIcons.Zap className="w-4 h-4 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-900 dark:text-text-primary truncate">{tool.name}</span>
            <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex-shrink-0">{tool.category}</span>
          </div>
          {tool.description && <p className="text-xs text-gray-500 dark:text-text-muted truncate mt-0.5">{tool.description}</p>}
        </div>
        <div className={cn('flex items-center gap-1 transition-opacity', isHovered ? 'opacity-100' : 'opacity-0')}>
          <button onClick={handleFavorite} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-yellow-400 transition-colors">
            <Star className={cn('w-4 h-4', tool.isFavorite && 'fill-yellow-400 text-yellow-400')} />
          </button>
          {onAddToCollection && (
            <button onClick={() => onAddToCollection(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-primary transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onEdit(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-primary transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={handleLaunch} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
            Launch <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ── EXPANDED VIEW ───────────────────────────────────────
  if (viewMode === 'expanded') {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        transition={currentAnimation}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          `group relative bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border ${cardRadius} transition-all`,
          'hover:border-primary/50',
          isDragging && 'opacity-50'
        )}
        whileHover={{ y: hoverLift[settings.animationIntensity], scale: settings.animationIntensity === 'bold' ? 1.03 : 1 }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              {IconComponent ? <IconComponent className="w-5.5 h-5.5 text-primary" /> : <LucideIcons.Zap className="w-5.5 h-5.5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 dark:text-text-primary">{tool.name}</h3>
              <span className="text-xs text-primary font-medium">{tool.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleFavorite} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                <Star className={cn('w-4 h-4', tool.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 dark:text-text-muted')} />
              </button>
              <div {...attributes} {...listeners} className="p-1.5 rounded-lg cursor-grab text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-secondary">
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          {tool.description && <p className="text-xs text-gray-600 dark:text-text-secondary mb-3 leading-relaxed">{tool.description}</p>}
          {tool.lastAccessed && (
            <p className="text-xs text-gray-500 dark:text-text-muted mb-3">
              Last used: {new Date(tool.lastAccessed).toLocaleDateString()}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(tool)} className="p-2 rounded-lg text-gray-500 dark:text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            {onAddToCollection && (
              <button onClick={() => onAddToCollection(tool)} className="p-2 rounded-lg text-gray-500 dark:text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            )}
            <motion.button
              onClick={handleLaunch}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-xl font-medium text-sm hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
            >
              Launch <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── GRID VIEW (default) ─────────────────────────────────
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={currentAnimation}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        `group relative bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border ${cardRadius} overflow-hidden transition-all`,
        'hover:border-primary/50',
        isDragging && 'opacity-50 rotate-2'
      )}
      whileHover={{ y: hoverLift[settings.animationIntensity], scale: settings.animationIntensity === 'bold' ? 1.03 : 1 }}
    >
      {/* Favorite + Drag */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <motion.button
          onClick={handleFavorite}
          whileTap={{ scale: settings.animationIntensity === 'none' ? 1 : 0.8 }}
          className={cn(
            'p-1 rounded-lg transition-all',
            tool.isFavorite ? 'opacity-100' : isHovered ? 'opacity-100' : 'opacity-0'
          )}
          aria-label={tool.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <motion.div
            initial={false}
            animate={{ scale: tool.isFavorite && settings.animationIntensity !== 'none' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: settings.animationIntensity === 'bold' ? 0.4 : 0.2 }}
          >
            <Star
              className={cn(
                'w-3.5 h-3.5 transition-all',
                tool.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-text-muted hover:text-yellow-400'
              )}
            />
          </motion.div>
        </motion.button>
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'p-1 rounded-lg cursor-grab active:cursor-grabbing transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <GripVertical className="w-3.5 h-3.5 text-text-muted" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {IconComponent ? <IconComponent className="w-5 h-5 text-primary" /> : <LucideIcons.Zap className="w-5 h-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-text-primary truncate">{tool.name}</h3>
            <span className="text-xs text-primary font-medium">{tool.category}</span>
          </div>
        </div>

        {tool.description && (
          <p className="text-xs text-gray-600 dark:text-text-secondary line-clamp-2 mb-3">{tool.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className={cn('flex items-center gap-1 transition-opacity duration-200', isHovered ? 'opacity-100' : 'opacity-0')}>
            <button onClick={() => onEdit(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Edit tool">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors" aria-label="Delete tool">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {onAddToCollection && (
              <button onClick={() => onAddToCollection(tool)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Add to collection">
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <motion.button
            onClick={handleLaunch}
            whileHover={{ scale: settings.animationIntensity === 'none' ? 1 : 1.05 }}
            whileTap={{ scale: settings.animationIntensity === 'none' ? 1 : 0.95 }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-primary text-black rounded-lg font-medium text-xs hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
          >
            Launch <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

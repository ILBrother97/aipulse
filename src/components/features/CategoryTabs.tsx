import { motion } from 'framer-motion';
import { Star, Plus, Settings2, Trash2, FolderOpen, Lock } from 'lucide-react';
import { useState } from 'react';
import { useToolsStore } from '../../stores/toolsStore';
import { usePremium } from '@/hooks/usePremium';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';
import { cn } from '../../utils/cn';
import { PremiumGate } from '@/components/premium';
import type { Collection } from '../../types/index';

interface CategoryTabsProps {
  onCreateCollection: () => void;
  onEditCollection: (col: Collection) => void;
}

export default function CategoryTabs({ onCreateCollection, onEditCollection }: CategoryTabsProps) {
  const FREE_LIMIT = 3;
  
  const {
    categories, collections, tools,
    selectedCategory, selectedCollectionId,
    setSelectedCategory, setSelectedCollection,
    deleteCollection,
    settings,
  } = useToolsStore();
  
  const { isPremium } = usePremium();
  const { openUpgradeModal } = useUpgradeModal();
  
  // Animation based on intensity
  const animationVariants = {
    subtle: { duration: 0.2, ease: "easeOut" as const },
    normal: { duration: 0.4, ease: "easeOut" as const },
    bold: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
    none: { duration: 0, ease: "linear" as const }
  };
  
  const currentAnimation = animationVariants[settings.animationIntensity] || animationVariants.normal;

  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  const getCategoryCount = (name: string) => tools.filter((t) => t.category === name).length;
  const favCount = tools.filter((t) => t.isFavorite).length;

  const isNoneSelected = !selectedCategory && !selectedCollectionId;

  return (
    <div className="w-full">
      <div className="category-tabs-container flex items-center gap-1 pb-1.5 overflow-x-auto pb-1.5">
        {/* All */}
        <TabButton active={isNoneSelected} onClick={() => setSelectedCategory(null)}>
          All
          <Badge active={isNoneSelected}>{tools.length}</Badge>
        </TabButton>

        {/* Favorites */}
        {favCount > 0 && (
          <TabButton
            active={selectedCategory === 'Favorites'}
            onClick={() => setSelectedCategory('Favorites')}
            icon={<Star className="w-3 h-3" />}
          >
            Favorites
            <Badge active={selectedCategory === 'Favorites'}>{favCount}</Badge>
          </TabButton>
        )}

        {/* Default Categories */}
        {categories.map((cat) => {
          const count = getCategoryCount(cat.name);
          if (count === 0) return null;
          const isActive = selectedCategory === cat.name;
          return (
            <TabButton key={cat.id} active={isActive} onClick={() => setSelectedCategory(cat.name)}>
              {cat.name}
              <Badge active={isActive}>{count}</Badge>
            </TabButton>
          );
        })}

        {/* Divider */}
        {collections.length > 0 && (
          <div className="w-px h-4 bg-gray-300 dark:bg-border mx-1 flex-shrink-0" />
        )}

        {/* Collections */}
        {collections.map((col) => {
          const isActive = selectedCollectionId === col.id;
          return (
            <div
              key={col.id}
              className="relative flex-shrink-0"
              onMouseEnter={() => setHoveredCol(col.id)}
              onMouseLeave={() => setHoveredCol(null)}
            >
              <TabButton
                active={isActive}
                onClick={() => setSelectedCollection(isActive ? null : col.id)}
                accent={col.color}
                icon={<FolderOpen className="w-3 h-3" />}
              >
                {col.name}
                <Badge active={isActive}>{col.toolIds.length}</Badge>
              </TabButton>
              {hoveredCol === col.id && (
                <div className="absolute top-0 right-0 flex items-center gap-0.5 bg-white dark:bg-background-card border border-gray-200 dark:border-border rounded-lg px-1 py-0.5 -translate-y-1 translate-x-1 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditCollection(col); }}
                    className="p-0.5 text-gray-500 dark:text-text-muted hover:text-primary transition-colors"
                  >
                    <Settings2 className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCollection(col.id); }}
                    className="p-0.5 text-gray-500 dark:text-text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Create Collection */}
        <motion.button
          onClick={() => {
            if (!isPremium && collections.length >= FREE_LIMIT) {
              openUpgradeModal();
              return;
            }
            onCreateCollection();
          }}
          whileHover={{ scale: settings.animationIntensity === 'none' ? 1 : 1.05 }}
          whileTap={{ scale: settings.animationIntensity === 'none' ? 1 : 0.95 }}
          disabled={!isPremium && collections.length >= FREE_LIMIT}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all border-2 border-dashed flex-shrink-0 ml-1 mr-1",
            (!isPremium && collections.length >= FREE_LIMIT)
              ? "text-gray-400 dark:text-text-muted border-gray-400 dark:border-gray-600 cursor-not-allowed"
              : "text-gray-500 dark:text-text-muted hover:text-primary hover:bg-primary/10 border-gray-300 dark:border-border hover:border-primary"
          )}
        >
          {!isPremium && collections.length >= FREE_LIMIT ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          New Collection
        </motion.button>
      </div>

      {/* Collections Limit Banner */}
      {!isPremium && collections.length >= FREE_LIMIT && (
        <div className="mt-2">
          <PremiumGate 
            feature="Unlimited Collections" 
            variant="limit" 
            limitCurrent={collections.length} 
            limitMax={FREE_LIMIT} 
          />
        </div>
      )}

      {/* Inline message for limit reached */}
      {!isPremium && collections.length >= FREE_LIMIT && (
        <div className="mt-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
            You've used {FREE_LIMIT}/{FREE_LIMIT} free collections — Upgrade for unlimited
          </p>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active, onClick, children, icon, accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex-shrink-0',
        active ? 'text-black' : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary'
      )}
      style={active && accent ? { backgroundColor: accent } : undefined}
    >
      {active && !accent && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-primary rounded-full"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1">
        {icon}
        {children}
      </span>
    </button>
  );
}

function Badge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={cn('px-1 py-0.5 rounded-full text-xs', active ? 'bg-black/20' : 'bg-gray-100 dark:bg-background-card')}>
      {children}
    </span>
  );
}

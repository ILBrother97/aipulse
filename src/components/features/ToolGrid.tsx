import { useMemo } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import type { AITool } from '../../types/index';
import { useToolsStore } from '../../stores/toolsStore';
import ToolCard from './ToolCard';
import { Search, Plus } from 'lucide-react';
import { Button } from '../ui';

interface ToolGridProps {
  onEditTool: (tool: AITool) => void;
  onDeleteTool: (tool: AITool) => void;
  onAddTool: () => void;
  onAddToCollection?: (tool: AITool) => void;
}

export default function ToolGrid({ onEditTool, onDeleteTool, onAddTool, onAddToCollection }: ToolGridProps) {
  const { tools, getFilteredTools, reorderTools, searchQuery, selectedCategory, selectedCollectionId, settings } = useToolsStore();
  const viewMode = settings.viewMode;

  const filteredTools = useMemo(
    () => getFilteredTools(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tools, searchQuery, selectedCategory, selectedCollectionId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = filteredTools.findIndex((t) => t.id === active.id);
      const newIdx = filteredTools.findIndex((t) => t.id === over.id);
      reorderTools(arrayMove(filteredTools, oldIdx, newIdx).map((t) => t.id));
    }
  };

  if (filteredTools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="w-20 h-20 rounded-full bg-background-card flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-text-muted" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {searchQuery ? 'No tools found' : 'No tools yet'}
        </h3>
        <p className="text-text-secondary text-center max-w-md mb-6">
          {searchQuery
            ? `No tools match "${searchQuery}". Try a different search.`
            : 'Get started by adding your first AI tool.'}
        </p>
        {!searchQuery && (
          <Button onClick={onAddTool} leftIcon={<Plus className="w-5 h-5" />}>
            Add Your First Tool
          </Button>
        )}
      </motion.div>
    );
  }

  const strategy = viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy;

  const gridClass =
    viewMode === 'list'
      ? 'flex flex-col gap-2'
      : viewMode === 'expanded'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
      : viewMode === 'kanban'
      ? '' // handled separately
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6';

  // ── Kanban View ─────────────────────────────────────────
  if (viewMode === 'kanban') {
    const { categories } = useToolsStore.getState();
    const toolsByCategory: Record<string, AITool[]> = {};
    for (const tool of filteredTools) {
      if (!toolsByCategory[tool.category]) toolsByCategory[tool.category] = [];
      toolsByCategory[tool.category].push(tool);
    }
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(toolsByCategory).map(([cat, catTools]) => (
          <div key={cat} className="flex-shrink-0 w-72 bg-gray-50 dark:bg-background-card rounded-2xl border-2 border-gray-200 dark:border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-text-primary text-sm">{cat}</h3>
              <span className="text-xs text-gray-500 dark:text-text-muted bg-gray-200 dark:bg-background-dark px-2 py-0.5 rounded-full">
                {catTools.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {catTools.map((tool, i) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onEdit={onEditTool}
                  onDelete={onDeleteTool}
                  onAddToCollection={onAddToCollection}
                  index={i}
                  viewMode="list"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filteredTools.map((t) => t.id)} strategy={strategy}>
        <div className={gridClass}>
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={onEditTool}
              onDelete={onDeleteTool}
              onAddToCollection={onAddToCollection}
              index={index}
              viewMode={viewMode as 'grid' | 'list' | 'expanded'}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

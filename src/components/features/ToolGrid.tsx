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
      ? 'flex flex-col gap-1.5'
      : viewMode === 'expanded'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'
      : viewMode === 'kanban'
      ? '' // handled separately
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4';

  // ── Kanban View ─────────────────────────────────────────
  if (viewMode === 'kanban') {
    const { categories } = useToolsStore.getState();
    const toolsByCategory: Record<string, AITool[]> = {};
    for (const tool of filteredTools) {
      if (!toolsByCategory[tool.category]) toolsByCategory[tool.category] = [];
      toolsByCategory[tool.category].push(tool);
    }
    return (
      <div className="bg-[#f1f5f9] dark:bg-[#0a0e1a] min-h-full -mx-4 px-4 py-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.entries(toolsByCategory).map(([cat, catTools]) => (
            <div key={cat} className="flex-shrink-0 w-72 bg-white dark:bg-[#0d1117] rounded-xl border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.06)] p-4">
              <div className="bg-white dark:bg-[#111827] rounded-lg px-3 py-2.5 border-b border-[#f1f5f9] dark:border-[rgba(255,255,255,0.08)] mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#0f172a] dark:text-[#f1f5f9] font-semibold text-[14px]">{cat}</h3>
                  <span className="text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.15)] dark:bg-[rgba(var(--color-primary-rgb),0.15)] text-[11px] font-medium rounded-[4px] px-[7px] py-[1px]">
                    {catTools.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {catTools.length === 0 ? (
                  <p className="text-[#334155] dark:text-[#334155] text-[12px] text-center py-4">No tools</p>
                ) : (
                  catTools.map((tool, i) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onEdit={onEditTool}
                      onDelete={onDeleteTool}
                      onAddToCollection={onAddToCollection}
                      index={i}
                      viewMode="list"
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
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

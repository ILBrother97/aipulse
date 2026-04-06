import { LayoutGrid, List, Maximize2, Columns } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { cn } from '../../utils/cn';
import type { ViewMode } from '../../types/index';

const views: { mode: ViewMode; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
  { mode: 'list', icon: List, label: 'List' },
  { mode: 'expanded', icon: Maximize2, label: 'Expanded' },
  { mode: 'kanban', icon: Columns, label: 'Kanban' },
];

export default function ViewToggle() {
  const { settings, updateSettings } = useToolsStore();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#111827] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-md p-[3px]">
      {views.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => updateSettings({ viewMode: mode })}
          title={label}
          aria-label={label}
          className={cn(
            'w-8 h-8 rounded flex items-center justify-center transition-all duration-200',
            settings.viewMode === mode
              ? 'bg-[var(--color-primary)] text-[#0a0e1a]'
              : 'bg-transparent text-[#475569] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#94a3b8]'
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

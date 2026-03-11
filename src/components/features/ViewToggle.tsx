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
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl p-1">
      {views.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => updateSettings({ viewMode: mode })}
          title={label}
          aria-label={label}
          className={cn(
            'p-2 rounded-lg transition-all duration-200',
            settings.viewMode === mode
              ? 'bg-primary text-black'
              : 'text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-200 dark:hover:bg-background-cardHover'
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

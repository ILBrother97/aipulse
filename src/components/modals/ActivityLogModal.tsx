import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, Plus, Trash2, Edit2, Star, FolderOpen,
  GitBranch, Settings, Download, Upload, Filter, Search,
} from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui';
import type { ActivityEntry } from '../../types/index';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig: Record<ActivityEntry['type'], { icon: React.ElementType; color: string; label: string }> = {
  add: { icon: Plus, color: 'text-green-400', label: 'Added' },
  delete: { icon: Trash2, color: 'text-red-400', label: 'Deleted' },
  edit: { icon: Edit2, color: 'text-blue-400', label: 'Edited' },
  favorite: { icon: Star, color: 'text-yellow-400', label: 'Favorited' },
  unfavorite: { icon: Star, color: 'text-text-muted', label: 'Unfavorited' },
  collection_create: { icon: FolderOpen, color: 'text-primary', label: 'Collection Created' },
  collection_delete: { icon: FolderOpen, color: 'text-red-400', label: 'Collection Deleted' },
  workflow_create: { icon: GitBranch, color: 'text-purple-400', label: 'Workflow Created' },
  workflow_delete: { icon: GitBranch, color: 'text-red-400', label: 'Workflow Deleted' },
  settings_change: { icon: Settings, color: 'text-text-secondary', label: 'Settings Changed' },
  import: { icon: Upload, color: 'text-primary', label: 'Imported' },
  export: { icon: Download, color: 'text-primary', label: 'Exported' },
};

type FilterType = 'all' | ActivityEntry['type'];

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'add', label: 'Added' },
  { key: 'delete', label: 'Deleted' },
  { key: 'edit', label: 'Edited' },
  { key: 'favorite', label: 'Favorites' },
  { key: 'collection_create', label: 'Collections' },
  { key: 'workflow_create', label: 'Workflows' },
  { key: 'settings_change', label: 'Settings' },
];

function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityLogModal({ isOpen, onClose }: ActivityLogModalProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { activityLog } = useToolsStore();

  const filtered = useMemo(() => {
    let list = activityLog;
    if (filterType !== 'all') {
      list = list.filter((e) => e.type === filterType ||
        (filterType === 'favorite' && (e.type === 'favorite' || e.type === 'unfavorite')) ||
        (filterType === 'collection_create' && (e.type === 'collection_create' || e.type === 'collection_delete')) ||
        (filterType === 'workflow_create' && (e.type === 'workflow_create' || e.type === 'workflow_delete'))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.description.toLowerCase().includes(q));
    }
    return list;
  }, [activityLog, filterType, searchQuery]);

  const handleExportCSV = () => {
    const rows = [['Time', 'Type', 'Description']];
    filtered.forEach((e) => rows.push([
      new Date(e.timestamp).toISOString(),
      e.type,
      e.description,
    ]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aipulse-activity.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group by date
  const grouped = useMemo(() => {
    const groups: { date: string; entries: ActivityEntry[] }[] = [];
    const map: Record<string, ActivityEntry[]> = {};
    for (const entry of filtered) {
      const key = new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      if (!map[key]) {
        map[key] = [];
        groups.push({ date: key, entries: map[key] });
      }
      map[key].push(entry);
    }
    return groups;
  }, [filtered]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              className="pointer-events-auto w-full max-w-2xl bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-text-primary">Activity Log</h2>
                    <p className="text-xs text-gray-500 dark:text-text-muted">{activityLog.length} total actions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={handleExportCSV} leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Export
                  </Button>
                  <button onClick={onClose} className="p-2 rounded-xl text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-dark transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="px-6 py-3 border-b border-gray-200 dark:border-border flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gray-400 dark:text-text-muted" />
                  <div className="flex gap-1.5 flex-wrap">
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setFilterType(opt.key)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium transition-all',
                          filterType === opt.key
                            ? 'bg-primary text-black'
                            : 'text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary bg-gray-100 dark:bg-background-dark'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-text-muted" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search activity..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-background-dark border border-gray-200 dark:border-border rounded-lg text-xs text-gray-900 dark:text-text-primary focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Log entries */}
              <div className="overflow-y-auto flex-1 p-4">
                {grouped.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-10 h-10 text-gray-400 dark:text-text-muted mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-text-secondary text-sm">No activity yet</p>
                    <p className="text-gray-500 dark:text-text-muted text-xs mt-1">Actions you take will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {grouped.map((group) => (
                      <div key={group.date}>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-text-muted uppercase tracking-wider mb-3 sticky top-0 bg-white dark:bg-background-card py-1">
                          {group.date}
                        </h3>
                        <div className="space-y-1">
                          {group.entries.map((entry, i) => {
                            const config = typeConfig[entry.type] || typeConfig.edit;
                            const IconComp = config.icon;
                            return (
                              <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-background-dark transition-colors"
                              >
                                <div className={cn('w-7 h-7 rounded-lg bg-gray-100 dark:bg-background-dark flex items-center justify-center flex-shrink-0', config.color)}>
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 dark:text-text-primary truncate">{entry.description}</p>
                                  <p className="text-xs text-gray-500 dark:text-text-muted">{config.label}</p>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-text-muted flex-shrink-0">
                                  {formatTime(entry.timestamp)}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

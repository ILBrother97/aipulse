import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  AITool,
  Category,
  Collection,
  UsageEvent,
  Workflow,
  AppSettings,
  ActivityEntry,
  ToolsState,
  UsageStats,
} from '../types/index';
import { defaultTools, defaultCategories } from '../constants/defaultTools';

// ─── Default Settings ────────────────────────────────────
export const defaultSettings: AppSettings = {
  viewMode: 'grid',
  themeAccent: 'teal',
  spacingMode: 'standard',
  textSize: 'standard',
  borderRadius: 'rounded',
  fontFamily: 'mono',
  fontWeight: 'bold',
  backgroundPattern: 'grid',
  animationIntensity: 'normal',
  showTooltips: true,
  showKeyboardHints: true,
  defaultLaunchBehavior: 'current-tab',
  analyticsEnabled: true,
  reduceMotion: false,
  highContrast: false,
};

// ─── Theme accent colors ──────────────────────────────────
export const accentColors: Record<string, string> = {
  teal: '#00D9FF',
  purple: '#A855F7',
  blue: '#3B82F6',
  green: '#22C55E',
  orange: '#F97316',
  mono: '#E5E5E5',
};

// ─── Persisted State Shape ────────────────────────────────
interface PersistedState {
  tools: AITool[];
  categories: Category[];
  collections: Collection[];
  isDarkMode: boolean;
  recentlyUsed: string[];
  usageEvents: UsageEvent[];
  workflows: Workflow[];
  settings: AppSettings;
  activityLog: ActivityEntry[];
}

// ─── Utility: calculate usage stats ──────────────────────
function calcStats(events: UsageEvent[], tools: AITool[], days: number): UsageStats {
  const now = Date.now();
  const cutoff = days === 0 ? 0 : now - days * 86_400_000;
  const filtered = days === 0 ? events : events.filter((e) => e.timestamp >= cutoff);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const weekTs = todayTs - 6 * 86_400_000;
  const monthTs = todayTs - 29 * 86_400_000;

  const toolCounts: Record<string, { count: number; name: string; category: string }> = {};
  const catCounts: Record<string, number> = {};
  const dayMap: Record<string, number> = {};
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const days7 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (const e of filtered) {
    // tool counts
    if (!toolCounts[e.toolId]) toolCounts[e.toolId] = { count: 0, name: e.toolName, category: e.category };
    toolCounts[e.toolId].count++;
    // category counts
    catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    // daily
    const d = new Date(e.timestamp);
    const key = d.toISOString().split('T')[0];
    dayMap[key] = (dayMap[key] || 0) + 1;
    // weekday
    const wd = days7[d.getDay()];
    weekdayMap[wd]++;
  }

  // build daily timeline for last N days
  const dailyTimeline: { date: string; count: number }[] = [];
  const numDays = Math.min(days || 30, 90);
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(todayTs - i * 86_400_000);
    const key = d.toISOString().split('T')[0];
    dailyTimeline.push({ date: key, count: dayMap[key] || 0 });
  }

  // accessed tool ids
  const accessedIds = new Set(events.map((e) => e.toolId));
  const thirtyDaysAgo = now - 30 * 86_400_000;
  const unusedTools = tools.filter(
    (t) => !t.lastAccessed || t.lastAccessed < thirtyDaysAgo
  );

  return {
    totalLaunches: filtered.length,
    todayLaunches: events.filter((e) => e.timestamp >= todayTs).length,
    weekLaunches: events.filter((e) => e.timestamp >= weekTs).length,
    monthLaunches: events.filter((e) => e.timestamp >= monthTs).length,
    topTools: Object.entries(toolCounts)
      .map(([toolId, v]) => ({ toolId, name: v.name, count: v.count, category: v.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    categoryBreakdown: Object.entries(catCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
    dailyTimeline,
    weekdayBreakdown: days7.map((d) => ({ day: d, count: weekdayMap[d] })),
    unusedTools,
  };
}

// ─── Store ────────────────────────────────────────────────
export const useToolsStore = create<ToolsState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────
      tools: defaultTools,
      categories: defaultCategories,
      collections: [],
      searchQuery: '',
      selectedCategory: null,
      selectedCollectionId: null,
      isDarkMode: false,
      recentlyUsed: [],
      usageEvents: [],
      workflows: [],
      settings: defaultSettings,
      activityLog: [],
      currentPage: 'home',

      // ── Activity Logging ───────────────────────────────
      addActivity: (entry) => {
        set((state) => ({
          activityLog: [
            { ...entry, id: uuidv4(), timestamp: Date.now() },
            ...state.activityLog,
          ].slice(0, 200),
        }));
      },

      // ── Tool CRUD ──────────────────────────────────────
      addTool: (toolData) => {
        const newTool: AITool = {
          ...toolData,
          id: uuidv4(),
          createdAt: Date.now(),
          order: get().tools.length,
          isFavorite: false,
          collectionIds: [],
        };
        set((state) => ({ tools: [...state.tools, newTool] }));
        get().addActivity({ type: 'add', description: `Added "${newTool.name}"`, metadata: { toolId: newTool.id } });
      },

      updateTool: (id, updates) => {
        set((state) => ({
          tools: state.tools.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        const name = get().tools.find((t) => t.id === id)?.name || id;
        get().addActivity({ type: 'edit', description: `Edited "${name}"`, metadata: { toolId: id } });
      },

      deleteTool: (id) => {
        const name = get().tools.find((t) => t.id === id)?.name || id;
        set((state) => ({
          tools: state.tools.filter((t) => t.id !== id),
          recentlyUsed: state.recentlyUsed.filter((tid) => tid !== id),
          collections: state.collections.map((c) => ({
            ...c,
            toolIds: c.toolIds.filter((tid) => tid !== id),
          })),
        }));
        get().addActivity({ type: 'delete', description: `Deleted "${name}"` });
      },

      reorderTools: (toolIds) => {
        set((state) => {
          const map = new Map(state.tools.map((t) => [t.id, t]));
          const reordered = toolIds.map((id) => map.get(id)).filter((t): t is AITool => !!t)
            .map((t, i) => ({ ...t, order: i }));
          const remaining = state.tools.filter((t) => !toolIds.includes(t.id));
          return { tools: [...reordered, ...remaining] };
        });
      },

      // ── Favorites (Feature 1) ──────────────────────────
      toggleFavorite: (toolId) => {
        const tool = get().tools.find((t) => t.id === toolId);
        if (!tool) return;
        const nowFav = !tool.isFavorite;
        set((state) => ({
          tools: state.tools.map((t) =>
            t.id === toolId ? { ...t, isFavorite: nowFav } : t
          ),
        }));
        get().addActivity({
          type: nowFav ? 'favorite' : 'unfavorite',
          description: `${nowFav ? 'Favorited' : 'Unfavorited'} "${tool.name}"`,
        });
      },

      getFavoriteTools: () => get().tools.filter((t) => t.isFavorite),

      // ── Categories ────────────────────────────────────
      addCategory: (name) => {
        set((state) => ({
          categories: [...state.categories, { id: uuidv4(), name }],
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      // ── Collections (Feature 3) ───────────────────────
      addCollection: (collectionData) => {
        const col: Collection = {
          ...collectionData,
          id: uuidv4(),
          createdAt: Date.now(),
          order: get().collections.length,
          toolIds: collectionData.toolIds || [],
        };
        set((state) => ({ collections: [...state.collections, col] }));
        get().addActivity({ type: 'collection_create', description: `Created collection "${col.name}"` });
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCollection: (id) => {
        const col = get().collections.find((c) => c.id === id);
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
          tools: state.tools.map((t) => ({
            ...t,
            collectionIds: (t.collectionIds || []).filter((cid) => cid !== id),
          })),
        }));
        if (col) get().addActivity({ type: 'collection_delete', description: `Deleted collection "${col.name}"` });
        if (get().selectedCollectionId === id) set({ selectedCollectionId: null });
      },

      addToolToCollection: (toolId, collectionId) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId && !c.toolIds.includes(toolId)
              ? { ...c, toolIds: [...c.toolIds, toolId] }
              : c
          ),
          tools: state.tools.map((t) =>
            t.id === toolId && !(t.collectionIds || []).includes(collectionId)
              ? { ...t, collectionIds: [...(t.collectionIds || []), collectionId] }
              : t
          ),
        }));
      },

      removeToolFromCollection: (toolId, collectionId) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, toolIds: c.toolIds.filter((id) => id !== toolId) }
              : c
          ),
          tools: state.tools.map((t) =>
            t.id === toolId
              ? { ...t, collectionIds: (t.collectionIds || []).filter((id) => id !== collectionId) }
              : t
          ),
        }));
      },

      getCollectionTools: (collectionId) => {
        const col = get().collections.find((c) => c.id === collectionId);
        if (!col) return [];
        const map = new Map(get().tools.map((t) => [t.id, t]));
        return col.toolIds.map((id) => map.get(id)).filter((t): t is AITool => !!t);
      },

      // ── Filters ───────────────────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category, selectedCollectionId: null }),
      setSelectedCollection: (id) => set({ selectedCollectionId: id, selectedCategory: null }),

      // ── Theme ─────────────────────────────────────────
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),

      // ── Recently Used ─────────────────────────────────
      addToRecentlyUsed: (toolId) => {
        set((state) => ({
          recentlyUsed: [toolId, ...state.recentlyUsed.filter((id) => id !== toolId)].slice(0, 10),
          tools: state.tools.map((t) =>
            t.id === toolId ? { ...t, lastAccessed: Date.now() } : t
          ),
        }));
      },

      // ── Usage Analytics (Feature 2) ───────────────────
      recordUsage: (toolId) => {
        const tool = get().tools.find((t) => t.id === toolId);
        if (!tool || !get().settings.analyticsEnabled) return;
        const event: UsageEvent = {
          id: uuidv4(),
          toolId,
          toolName: tool.name,
          category: tool.category,
          timestamp: Date.now(),
        };
        const cutoff = Date.now() - 90 * 86_400_000;
        set((state) => ({
          usageEvents: [event, ...state.usageEvents.filter((e) => e.timestamp > cutoff)],
        }));
        get().addToRecentlyUsed(toolId);
      },

      getUsageStats: (days) => calcStats(get().usageEvents, get().tools, days),

      // ── Workflows (Feature 11) ─────────────────────────
      addWorkflow: (wfData) => {
        const wf: Workflow = {
          ...wfData,
          id: uuidv4(),
          createdAt: Date.now(),
          useCount: 0,
        };
        set((state) => ({ workflows: [...state.workflows, wf] }));
        get().addActivity({ type: 'workflow_create', description: `Created workflow "${wf.name}"` });
      },

      updateWorkflow: (id, updates) => {
        set((state) => ({
          workflows: state.workflows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
      },

      deleteWorkflow: (id) => {
        const wf = get().workflows.find((w) => w.id === id);
        set((state) => ({ workflows: state.workflows.filter((w) => w.id !== id) }));
        if (wf) get().addActivity({ type: 'workflow_delete', description: `Deleted workflow "${wf.name}"` });
      },

      executeWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id
              ? { ...w, useCount: w.useCount + 1, lastUsed: Date.now() }
              : w
          ),
        }));
      },

      // ── Workflow Execution with Variables ──────────────
      activeExecution: null as WorkflowExecution | null,
      startWorkflowExecution: (workflowId: string) => {
        const execution: WorkflowExecution = {
          workflowId,
          startedAt: Date.now(),
          currentStepIndex: 0,
          variables: {},
          completedSteps: [],
        };
        set({ activeExecution: execution });
        get().executeWorkflow(workflowId);
        return execution;
      },
      setExecutionStep: (stepIndex: number) => {
        set((state) => ({
          activeExecution: state.activeExecution
            ? { ...state.activeExecution, currentStepIndex: stepIndex }
            : null,
        }));
      },
      setStepOutput: (stepId: string, output: string) => {
        set((state) => {
          if (!state.activeExecution) return state;
          return {
            activeExecution: {
              ...state.activeExecution,
              variables: { ...state.activeExecution.variables, [stepId]: output },
              completedSteps: [...state.activeExecution.completedSteps, stepId],
            },
          };
        });
      },
      getStepInput: (step: WorkflowStep) => {
        const { activeExecution } = get();
        if (!activeExecution || !step.inputVar) return '';
        const varName = step.inputVar.replace('{{', '').replace('}}', '');
        return activeExecution.variables[varName] || '';
      },
      endWorkflowExecution: () => set({ activeExecution: null }),

      // ── Settings (Feature 10) ─────────────────────────
      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }));
        get().addActivity({ type: 'settings_change', description: 'Updated settings' });
      },
      resetSettings: () => set({ settings: defaultSettings }),

      // ── Navigation ────────────────────────────────────
      setCurrentPage: (page) => set({ currentPage: page }),

      // ── Getters ───────────────────────────────────────
      getFilteredTools: () => {
        const { tools, selectedCategory, selectedCollectionId, collections, searchQuery } = get();
        let list = tools;

        if (selectedCollectionId) {
          const col = collections.find((c) => c.id === selectedCollectionId);
          if (col) list = col.toolIds.map((id) => list.find((t) => t.id === id)).filter((t): t is AITool => !!t);
        } else if (selectedCategory) {
          if (selectedCategory === 'Favorites') {
            list = list.filter((t) => t.isFavorite);
          } else {
            list = list.filter((t) => t.category === selectedCategory);
          }
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          list = list.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q) ||
              (t.description?.toLowerCase().includes(q) ?? false)
          );
        }

        return list.sort((a, b) => a.order - b.order);
      },

      getRecentlyUsedTools: () => {
        const { recentlyUsed, tools } = get();
        const map = new Map(tools.map((t) => [t.id, t]));
        return recentlyUsed.map((id) => map.get(id)).filter((t): t is AITool => !!t);
      },

      exportData: () => {
        const { tools, categories, collections, workflows, settings, activityLog } = get();
        const data = { tools, categories, collections, workflows, settings, activityLog, exportedAt: Date.now() };
        get().addActivity({ type: 'export', description: `Exported data (${tools.length} tools)` });
        return JSON.stringify(data, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            tools: data.tools || [],
            categories: data.categories || defaultCategories,
            collections: data.collections || [],
            workflows: data.workflows || [],
            settings: { ...defaultSettings, ...(data.settings || {}) },
          });
          get().addActivity({ type: 'import', description: `Imported data (${data.tools?.length || 0} tools)` });
        } catch {
          throw new Error('Invalid backup file format');
        }
      },
    }),
    {
      name: 'aipulse-storage-v3',
      partialize: (state): PersistedState => ({
        tools: state.tools,
        categories: state.categories,
        collections: state.collections,
        isDarkMode: state.isDarkMode,
        recentlyUsed: state.recentlyUsed,
        usageEvents: state.usageEvents,
        workflows: state.workflows,
        settings: state.settings,
        activityLog: state.activityLog,
      }),
    }
  )
);

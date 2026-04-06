// ─── Core Tool ────────────────────────────────────────────
export interface AITool {
  id: string;
  name: string;
  url: string;
  category: string;
  description?: string;
  icon?: string;
  createdAt: number;
  lastAccessed?: number;
  order: number;
  isFavorite?: boolean;
  collectionIds?: string[]; // Feature 3
  tags?: string[];
}

// ─── Category ─────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  color?: string;
}

// ─── Custom Collection (Feature 3) ────────────────────────
export interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  toolIds: string[];
  createdAt: number;
  order: number;
}

// ─── Analytics / Usage (Feature 2) ───────────────────────
export interface UsageEvent {
  id: string;
  toolId: string;
  toolName: string;
  category: string;
  timestamp: number;
}

// ─── Theme / Settings (Feature 10) ────────────────────────
export type ViewMode = 'grid' | 'list' | 'expanded' | 'kanban';
export type ThemeAccent = 'teal' | 'purple' | 'blue' | 'green' | 'orange' | 'mono';
export type SpacingMode = 'compact' | 'standard' | 'spacious';
export type TextSize = 'small' | 'standard' | 'large' | 'xlarge';
export type BorderRadius = 'sharp' | 'rounded' | 'very-rounded';
export type FontFamily = 'default' | 'serif' | 'mono';
export type FontWeight = 'normal' | 'medium' | 'bold';
export type BackgroundPattern = 'grid' | 'none' | 'dots' | 'lines';
export type AnimationIntensity = 'subtle' | 'normal' | 'bold' | 'none';

export interface AppSettings {
  viewMode: ViewMode;
  themeAccent: ThemeAccent;
  spacingMode: SpacingMode;
  textSize: TextSize;
  borderRadius: BorderRadius;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  backgroundPattern: BackgroundPattern;
  animationIntensity: AnimationIntensity;
  showTooltips: boolean;
  showKeyboardHints: boolean;
  defaultLaunchBehavior: 'new-tab' | 'current-tab';
  analyticsEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
}

// ─── Activity Log (Feature 15) ────────────────────────────
export interface ActivityEntry {
  id: string;
  type: 'add' | 'delete' | 'edit' | 'favorite' | 'unfavorite' | 'collection_create' | 'collection_delete' | 'settings_change' | 'import' | 'export';
  description: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// ─── Main Store State ─────────────────────────────────────
export interface ToolsState {
  tools: AITool[];
  categories: Category[];
  collections: Collection[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedCollectionId: string | null;
  recentlyUsed: string[];
  usageEvents: UsageEvent[];
  settings: AppSettings;
  activityLog: ActivityEntry[];
  currentPage: 'home' | 'analytics' | 'settings';

  // Tool CRUD
  addTool: (tool: Omit<AITool, 'id' | 'createdAt' | 'order'>) => void;
  updateTool: (id: string, updates: Partial<AITool>) => void;
  deleteTool: (id: string) => void;
  reorderTools: (toolIds: string[]) => void;

  // Favorites (Feature 1)
  toggleFavorite: (toolId: string) => void;
  getFavoriteTools: () => AITool[];

  // Category actions
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categoryIds: string[]) => void;

  // Collection actions (Feature 3)
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'order'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addToolToCollection: (toolId: string, collectionId: string) => void;
  removeToolFromCollection: (toolId: string, collectionId: string) => void;
  getCollectionTools: (collectionId: string) => AITool[];

  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedCollection: (id: string | null) => void;

  // Recently used
  addToRecentlyUsed: (toolId: string) => void;

  // Usage analytics (Feature 2)
  recordUsage: (toolId: string) => void;
  getUsageStats: (days: number) => UsageStats;


  // Settings (Feature 10)
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Navigation
  setCurrentPage: (page: 'home' | 'analytics' | 'settings') => void;

  // Activity log (Feature 15)
  addActivity: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;

  // Getters
  getFilteredTools: () => AITool[];
  getRecentlyUsedTools: () => AITool[];
  exportData: () => string;
  importData: (json: string) => void;
}

// ─── Analytics Return Types ───────────────────────────────
export interface UsageStats {
  totalLaunches: number;
  todayLaunches: number;
  weekLaunches: number;
  monthLaunches: number;
  topTools: { toolId: string; name: string; count: number; category: string }[];
  categoryBreakdown: { category: string; count: number }[];
  dailyTimeline: { date: string; count: number }[];
  weekdayBreakdown: { day: string; count: number }[];
  unusedTools: AITool[];
}

export interface ToolFormData {
  name: string;
  url: string;
  category: string;
  description: string;
  icon: string;
}

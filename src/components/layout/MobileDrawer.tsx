import { useEffect } from 'react';
import { X, LayoutGrid, List, Maximize2, Columns, Star, FolderOpen, Plus, Lock } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { usePremium } from '@/hooks/usePremium';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';
import { cn } from '../../utils/cn';
import type { ViewMode, Collection } from '../../types/index';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCollection: () => void;
  onEditCollection: (col: Collection) => void;
}

const views: { mode: ViewMode; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
  { mode: 'list', icon: List, label: 'List' },
  { mode: 'expanded', icon: Maximize2, label: 'Expanded' },
  { mode: 'kanban', icon: Columns, label: 'Kanban' },
];

export default function MobileDrawer({ isOpen, onClose, onCreateCollection, onEditCollection }: MobileDrawerProps) {
  const {
    settings,
    updateSettings,
    categories,
    collections,
    tools,
    selectedCategory,
    selectedCollectionId,
    setSelectedCategory,
    setSelectedCollection,
    deleteCollection,
  } = useToolsStore();

  const { isPremium } = usePremium();
  const { openUpgradeModal } = useUpgradeModal();
  const FREE_LIMIT = 3;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getCategoryCount = (name: string) => tools.filter((t) => t.category === name).length;
  const favCount = tools.filter((t) => t.isFavorite).length;
  const isNoneSelected = !selectedCategory && !selectedCollectionId;

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    onClose();
  };

  const handleCollectionClick = (id: string) => {
    setSelectedCollection(selectedCollectionId === id ? null : id);
    onClose();
  };

  const handleViewModeChange = (mode: ViewMode) => {
    updateSettings({ viewMode: mode });
    onClose();
  };

  const handleCreateCollection = () => {
    if (!isPremium && collections.length >= FREE_LIMIT) {
      openUpgradeModal();
      onClose();
      return;
    }
    onCreateCollection();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-opacity duration-200',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.6)' }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          background: '#0d1117',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          zIndex: 51,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>Menu</span>
          <button
            onClick={onClose}
            style={{
              color: '#64748b',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* View Mode Section */}
          <div>
            <div
              style={{
                color: '#475569',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                fontWeight: 500,
              }}
            >
              View Mode
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {views.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => handleViewModeChange(mode)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background:
                      settings.viewMode === mode
                        ? 'rgba(var(--color-accent-rgb, 249, 115, 22), 0.1)'
                        : 'transparent',
                    borderRadius: '6px',
                    border: 'none',
                    color: settings.viewMode === mode ? 'var(--color-accent)' : '#64748b',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (settings.viewMode !== mode) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (settings.viewMode !== mode) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Categories Section */}
          <div>
            <div
              style={{
                color: '#475569',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                fontWeight: 500,
              }}
            >
              Categories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {/* All */}
              <button
                onClick={() => handleCategoryClick(null)}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isNoneSelected
                    ? 'rgba(var(--color-accent-rgb, 249, 115, 22), 0.1)'
                    : 'transparent',
                  borderRadius: '6px',
                  border: 'none',
                  color: isNoneSelected ? 'var(--color-accent)' : '#64748b',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isNoneSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isNoneSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                <span>All</span>
                <span
                  style={{
                    background: isNoneSelected
                      ? 'var(--color-accent)'
                      : 'rgba(255,255,255,0.08)',
                    color: isNoneSelected ? '#0a0e1a' : '#64748b',
                    borderRadius: '4px',
                    fontSize: '10px',
                    padding: '1px 6px',
                  }}
                >
                  {tools.length}
                </span>
              </button>

              {/* Favorites */}
              {favCount > 0 && (
                <button
                  onClick={() => handleCategoryClick('Favorites')}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      selectedCategory === 'Favorites'
                        ? 'rgba(var(--color-accent-rgb, 249, 115, 22), 0.1)'
                        : 'transparent',
                    borderRadius: '6px',
                    border: 'none',
                    color: selectedCategory === 'Favorites' ? 'var(--color-accent)' : '#64748b',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== 'Favorites') {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== 'Favorites') {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star className="w-3 h-3" />
                    Favorites
                  </span>
                  <span
                    style={{
                      background:
                        selectedCategory === 'Favorites'
                          ? 'var(--color-accent)'
                          : 'rgba(255,255,255,0.08)',
                      color: selectedCategory === 'Favorites' ? '#0a0e1a' : '#64748b',
                      borderRadius: '4px',
                      fontSize: '10px',
                      padding: '1px 6px',
                    }}
                  >
                    {favCount}
                  </span>
                </button>
              )}

              {/* Categories */}
              {categories.map((cat) => {
                const count = getCategoryCount(cat.name);
                if (count === 0) return null;
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isActive
                        ? 'rgba(var(--color-accent-rgb, 249, 115, 22), 0.1)'
                        : 'transparent',
                      borderRadius: '6px',
                      border: 'none',
                      color: isActive ? 'var(--color-accent)' : '#64748b',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#64748b';
                      }
                    }}
                  >
                    <span>{cat.name}</span>
                    <span
                      style={{
                        background: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
                        color: isActive ? '#0a0e1a' : '#64748b',
                        borderRadius: '4px',
                        fontSize: '10px',
                        padding: '1px 6px',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* Collections */}
              {collections.length > 0 && (
                <>
                  <div style={{ height: '8px' }} />
                  {collections.map((col) => {
                    const isActive = selectedCollectionId === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => handleCollectionClick(col.id)}
                        style={{
                          width: '100%',
                          padding: '8px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isActive
                            ? 'rgba(var(--color-accent-rgb, 249, 115, 22), 0.1)'
                            : 'transparent',
                          borderRadius: '6px',
                          border: 'none',
                          color: isActive ? 'var(--color-accent)' : '#64748b',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.color = '#94a3b8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                          }
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FolderOpen className="w-3 h-3" style={{ color: col.color }} />
                          {col.name}
                        </span>
                        <span
                          style={{
                            background: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
                            color: isActive ? '#0a0e1a' : '#64748b',
                            borderRadius: '4px',
                            fontSize: '10px',
                            padding: '1px 6px',
                          }}
                        >
                          {col.toolIds.length}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* New Collection Button */}
          <button
            onClick={handleCreateCollection}
            style={{
              width: '100%',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: '6px',
              color: '#64748b',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = '#64748b';
            }}
            disabled={!isPremium && collections.length >= FREE_LIMIT}
          >
            {!isPremium && collections.length >= FREE_LIMIT ? (
              <>
                <Lock className="w-3 h-3" />
                New Collection (Premium)
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                New Collection
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

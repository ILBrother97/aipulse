import { Search, X } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useState, useEffect } from 'react';

export default function SearchBar() {
  const [localQuery, setLocalQuery] = useState('');
  const setSearchQuery = useToolsStore((state) => state.setSearchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        placeholder="Search tools..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        data-search-input
        className="w-full bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl pl-10 pr-10 py-2 text-gray-900 dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-gray-300 dark:hover:border-text-muted"
      />
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

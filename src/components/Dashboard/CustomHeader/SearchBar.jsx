import { IoSearch } from "react-icons/io5";
import { FaFilter } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

export function SearchBar({ onSearch, onFilter, filters }) {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [clientInput, setClientInput] = useState(filters?.client || '');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState(filters?.tags || []);
  const [pendingFilters, setPendingFilters] = useState({ client: filters?.client, tags: filters?.tags });
  const filterRef = useRef(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilters]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Call onSearch on every change - Dashboard handles debouncing
    onSearch(value, false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger immediate search on Enter key (bypass debounce)
    onSearch(searchValue, true);
    // Apply pending filters
    applyFilters();
  };

  const handleClientChange = (value) => {
    setClientInput(value);
    setPendingFilters(prev => ({ ...prev, client: value || undefined }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setTagInput('');
      setPendingFilters(prev => ({ ...prev, tags: newTags.length > 0 ? newTags : undefined }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    setPendingFilters(prev => ({ ...prev, tags: newTags.length > 0 ? newTags : undefined }));
  };

  const applyFilters = () => {
    onFilter(pendingFilters);
    setShowFilters(false);
  };

  const handleClearAll = () => {
    setClientInput('');
    setSelectedTags([]);
    const clearedFilters = { client: undefined, tags: undefined };
    setPendingFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = filters?.client || (filters?.tags && filters.tags.length > 0);

  return (
    <div className="header-search-wrapper" ref={filterRef}>
      <form onSubmit={handleSubmit} className="header-search">
        <IoSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchValue}
          onChange={handleChange}
          className="search-input"
        />
        <button
          type="button"
          className={`search-filter-btn ${hasActiveFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Filter options"
        >
          <FaFilter />
          {hasActiveFilters && <span className="filter-badge" />}
        </button>
      </form>

      {showFilters && (
        <div className="search-filter-dropdown">
          <div className="filter-header">
            <span>Filters</span>
            {hasActiveFilters && (
              <button onClick={handleClearAll} className="filter-clear-btn">
                Clear All
              </button>
            )}
          </div>

          {/* Client Filter */}
          <div className="filter-section">
            <label htmlFor="filter-client">Client</label>
            <input
              id="filter-client"
              type="text"
              value={clientInput}
              onChange={(e) => handleClientChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyFilters())}
              placeholder="Filter by client..."
              className="filter-input"
            />
          </div>

          {/* Tags Filter */}
          <div className="filter-section">
            <label htmlFor="filter-tags">Tags</label>
            <div className="filter-tag-input">
              <input
                id="filter-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="filter-input"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="filter-add-btn"
                disabled={!tagInput.trim()}
              >
                Add
              </button>
            </div>
            {selectedTags.length > 0 && (
              <div className="filter-tags-list">
                {selectedTags.map((tag) => (
                  <span key={tag} className="filter-tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="filter-tag-remove"
                      aria-label={`Remove ${tag}`}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="filter-actions">
            <button
              type="button"
              onClick={applyFilters}
              className="filter-apply-btn"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

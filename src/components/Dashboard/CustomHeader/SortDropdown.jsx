import { MdOutlineSort } from "react-icons/md";
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function SortDropdown({ onSort, currentSort }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name', order: 'asc' },
    { label: 'Name (Z-A)', value: 'name', order: 'desc' },
    { label: 'Date (Newest)', value: 'created_at', order: 'desc' },
    { label: 'Date (Oldest)', value: 'created_at', order: 'asc' },
  ];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }, [isOpen]);

  const handleSelect = (sortBy, sortOrder) => {
    onSort(sortBy, sortOrder);
    setIsOpen(false);
  };

  const currentLabel = sortOptions.find(
    opt => opt.value === currentSort.sortBy && opt.order === currentSort.sortOrder
  )?.label || 'Sort';

  return (
    <div className="header-sort">
      <button 
        ref={buttonRef}
        className="sort-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sort options"
      >
        <MdOutlineSort />
        <span>{currentLabel}</span>
      </button>

      {isOpen && createPortal(
        <>
          <div className="sort-backdrop" onClick={() => setIsOpen(false)} />
          <div 
            className="sort-dropdown"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            {sortOptions.map((option, index) => (
              <button
                key={index}
                className={`sort-option ${
                  currentSort.sortBy === option.value && 
                  currentSort.sortOrder === option.order ? 'active' : ''
                }`}
                onClick={() => handleSelect(option.value, option.order)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

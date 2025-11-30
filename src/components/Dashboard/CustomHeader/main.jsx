import { FaRegMap, FaPlus } from "react-icons/fa"; 
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import React from 'react';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';

export function CustomHeader({ view, setView, onSearch, onSort, currentSort, onFilter, filters, onCreateProject }) {
  return (
    <div className="header-controls">
      <div className="header-left">
        <button className="create-project-btn" onClick={onCreateProject} aria-label="Create new project">
          <FaPlus />
          <span>New Project</span>
        </button>
        <SortDropdown onSort={onSort} currentSort={currentSort} />
        <SearchBar onSearch={onSearch} onFilter={onFilter} filters={filters} />
      </div>
      
      <div className="hdr-toggles">
        <button 
          onClick={() => setView('map')}
          className={view === 'map' ? 'active' : ''}
          aria-label="Map view"
        >
          <FaRegMap />
        </button>

        <button 
          onClick={() => setView('card')}
          className={view === 'card' ? 'active' : ''}
          aria-label="Card view"
        >
          <IoGrid />
        </button>

        <button 
          onClick={() => setView('list')}
          className={view === 'list' ? 'active' : ''}
          aria-label="List view"
        >
          <FaListUl />
        </button>
      </div>
    </div>
  );
}


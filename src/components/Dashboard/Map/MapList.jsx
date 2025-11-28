import { useState } from 'react';
import { FaEllipsisVertical, FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { GoArrowUpRight } from 'react-icons/go';
import '../../../styles/map-list.css';

function MapListItem({ project, isSelected, isHighlighted, onSelect, onNavigate, onHover }) {
  const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      className={`map-list-item ${isHighlighted ? 'highlighted' : ''}`}
      onMouseEnter={() => onHover(project._id)}
      onMouseLeave={() => onHover(null)}
    >
      <input 
        type="checkbox" 
        checked={isSelected}
        onChange={() => onSelect(project._id)}
        className="map-list-checkbox"
        aria-label={`Select ${project.name}`}
      />
      
      <div className="map-list-content" onClick={() => onNavigate(project)}>
        <div className="map-list-name">{project.name}</div>
        <div className="map-list-date">{formattedDate}</div>
      </div>
      
      <button 
        className="map-list-nav-btn" 
        onClick={() => onNavigate(project)}
        aria-label="Navigate to project"
      >
        <GoArrowUpRight />
      </button>
      
      <button 
        className="map-list-menu-btn" 
        aria-label="More options"
      >
        <FaEllipsisVertical />
      </button>
    </div>
  );
}

export function MapList({ projects, selectedIds, onSelect, onNavigate, highlightedId, onHover }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`map-list-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="map-list-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="map-list-header-content">
          <h3>Projects</h3>
          <span className="map-list-count">{projects.length}</span>
        </div>
        <button className="map-list-toggle" aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="map-list-scroll">
          {projects.map((project) => (
            <MapListItem
              key={project._id}
              project={project}
              isSelected={selectedIds.has(project._id)}
              isHighlighted={highlightedId === project._id}
              onSelect={onSelect}
              onNavigate={onNavigate}
              onHover={onHover}
            />
          ))}
        </div>
      )}
    </div>
  );
}

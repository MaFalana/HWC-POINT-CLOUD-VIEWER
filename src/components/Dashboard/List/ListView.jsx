import { FaEllipsis } from "react-icons/fa6";
import { useState } from "react";
import '../../../styles/list.css';
import '../../../styles/project-menu.css';
import { ProjectMenu } from '../ProjectMenu';

function TableRow({ project, isSelected, onSelect, onEditProject }) {
  const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <tr className="table-row">
      <td className="table-cell-checkbox">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onSelect(project._id)}
          aria-label={`Select ${project.name}`}
        />
      </td>
      <td className="table-cell-id">{project._id}</td>
      <td className="table-cell-name">{project.name}</td>
      <td className="table-cell-client">{project.client}</td>
      <td className="table-cell-tags">
        {project.tags && project.tags.length > 0 ? (
          <div className="table-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="table-tag">{tag}</span>
            ))}
          </div>
        ) : (
          <span className="table-empty">—</span>
        )}
      </td>
      <td className="table-cell-date">{formattedDate}</td>
      <td className="table-cell-actions">
        <ProjectMenu
          projectId={project._id}
          projectName={project.name}
          project={project}
          onEdit={onEditProject}
          triggerButton={{
            className: "table-menu-btn",
            ariaLabel: "More options",
            icon: <FaEllipsis />
          }}
        />
      </td>
    </tr>
  );
}

export function ListView({ projects, onEditProject }) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(projects.map(p => p._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const allSelected = projects.length > 0 && selectedIds.size === projects.length;

  return (
    <div className="list-view-container">
      {projects.length > 0 ? (
        <table className="list-table">
          <thead>
            <tr>
              <th className="table-header-checkbox">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="table-header">ID</th>
              <th className="table-header">Name</th>
              <th className="table-header">Client</th>
              <th className="table-header">Tags</th>
              <th className="table-header">Date</th>
              <th className="table-header-actions"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <TableRow 
                key={project._id} 
                project={project}
                isSelected={selectedIds.has(project._id)}
                onSelect={handleSelect}
                onEditProject={onEditProject}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
}

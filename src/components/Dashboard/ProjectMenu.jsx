import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function ProjectMenu({ projectId, projectName, project, triggerButton, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 160;
      
      // Position menu to the left of the button to avoid overflow
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - menuWidth
      });
    }
  }, [isOpen]);

  const handleEdit = () => {
    if (onEdit && project) {
      onEdit(project);
    } else {
      console.log('Edit project:', projectId);
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
      console.log('Delete project:', projectId);
      // TODO: Implement delete functionality
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={triggerButton.className}
        aria-label={triggerButton.ariaLabel}
      >
        {triggerButton.icon}
      </button>

      {isOpen && createPortal(
        <>
          <div className="project-menu-backdrop" onClick={() => setIsOpen(false)} />
          <div
            className="project-menu-dropdown"
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            <button className="project-menu-option" onClick={handleEdit}>
              <FaEdit />
              <span>Edit</span>
            </button>
            <button className="project-menu-option delete" onClick={handleDelete}>
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

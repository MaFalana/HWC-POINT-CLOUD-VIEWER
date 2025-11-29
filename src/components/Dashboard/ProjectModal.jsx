import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import crsOptions from '../../data/epsg/Indiana.json';
import '../../styles/project-modal.css';

export function ProjectModal({ isOpen, onClose, project = null, onSave }) {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    description: '',
    crs: null
  });
  
  const [tagInput, setTagInput] = useState('');
  const [crsSearch, setCrsSearch] = useState('');
  const [showCrsDropdown, setShowCrsDropdown] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const crsInputRef = useRef(null);

  // Initialize form data when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Edit mode
        setFormData({
          _id: project._id,
          name: project.name || '',
          client: project.client || '',
          date: project.date ? new Date(project.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          tags: project.tags || [],
          description: project.description || '',
          crs: project.crs || null
        });
        setCrsSearch(project.crs?.name || '');
      } else {
        // Create mode
        setFormData({
          _id: '',
          name: '',
          client: '',
          date: new Date().toISOString().split('T')[0],
          tags: [],
          description: '',
          crs: null
        });
        setCrsSearch('');
      }
      setHasChanges(false);
    }
  }, [isOpen, project]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, hasChanges]);

  // Handle click outside CRS dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (crsInputRef.current && !crsInputRef.current.contains(e.target)) {
        setShowCrsDropdown(false);
      }
    };
    
    if (showCrsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCrsDropdown]);

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleCrsSearch = (value) => {
    setCrsSearch(value);
    setShowCrsDropdown(true);
    setHasChanges(true);
  };

  const handleSelectCrs = (crs) => {
    handleInputChange('crs', crs);
    setCrsSearch(crs.name);
    setShowCrsDropdown(false);
  };

  const filteredCrsOptions = crsOptions.filter(crs => 
    crs.name.toLowerCase().includes(crsSearch.toLowerCase()) ||
    crs._id.toString().includes(crsSearch)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData._id.trim()) {
      alert('Project ID is required');
      return;
    }

    console.log(project ? 'Update project:' : 'Create project:', formData);
    onSave(formData);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* ID Field */}
            <div className="form-group">
              <label htmlFor="project-id">
                Project ID <span className="required">*</span>
              </label>
              <input
                id="project-id"
                type="text"
                value={formData._id}
                onChange={(e) => handleInputChange('_id', e.target.value)}
                disabled={!!project}
                className="form-input"
                placeholder="Enter project ID"
                required
              />
            </div>

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="project-name">Project Name</label>
              <input
                id="project-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input"
                placeholder="Enter project name"
              />
            </div>

            {/* Client Field */}
            <div className="form-group">
              <label htmlFor="project-client">Client</label>
              <input
                id="project-client"
                type="text"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                className="form-input"
                placeholder="Enter client name"
              />
            </div>

            {/* Date Field */}
            <div className="form-group">
              <label htmlFor="project-date">Date</label>
              <input
                id="project-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="form-input"
              />
            </div>

            {/* Tags Field */}
            <div className="form-group">
              <label htmlFor="project-tags">Tags</label>
              <div className="tags-input-container">
                <input
                  id="project-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="form-input"
                  placeholder="Enter a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="add-tag-btn"
                  aria-label="Add tag"
                >
                  <FaPlus />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag-btn"
                        aria-label={`Remove ${tag}`}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CRS Field */}
            <div className="form-group">
              <label htmlFor="project-crs">Coordinate Reference System</label>
              <div className="crs-input-container" ref={crsInputRef}>
                <input
                  id="project-crs"
                  type="text"
                  value={crsSearch}
                  onChange={(e) => handleCrsSearch(e.target.value)}
                  onFocus={() => setShowCrsDropdown(true)}
                  className="form-input"
                  placeholder="Search by name or ID"
                />
                {showCrsDropdown && filteredCrsOptions.length > 0 && (
                  <div className="crs-dropdown">
                    {filteredCrsOptions.slice(0, 10).map((crs) => (
                      <button
                        key={crs._id}
                        type="button"
                        className="crs-option"
                        onClick={() => handleSelectCrs(crs)}
                      >
                        <div className="crs-name">{crs.name}</div>
                        <div className="crs-id">ID: {crs._id} • {crs.unit}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.crs && (
                <div className="crs-selected">
                  Selected: {formData.crs.name} (ID: {formData.crs._id})
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                placeholder="Enter project description"
                rows={4}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

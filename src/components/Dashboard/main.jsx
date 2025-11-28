
import { CardGrid } from "./Card/CardGrid";
import { HWCMap } from "./Map/main";
import { ListView } from "./List/ListView";
import { StickyHeader } from "../StickyHeader/main";
import { CustomHeader } from "./CustomHeader/main";
import { ProjectModal } from "./ProjectModal";
import { useState } from "react";

export function Dashboard({ projects }) {
    const [view, setView] = useState('map');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSort, setCurrentSort] = useState({ sortBy: 'created_at', sortOrder: 'desc' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const handleSearch = (query) => {
        setSearchQuery(query);
        // TODO: Trigger API call with search query
        console.log('Search:', query);
    };

    const handleSort = (sortBy, sortOrder) => {
        setCurrentSort({ sortBy, sortOrder });
        // TODO: Trigger API call with new sort params
        console.log('Sort:', sortBy, sortOrder);
    };

    const handleCreateProject = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleSaveProject = (projectData) => {
        // TODO: API call to save/update project
        console.log('Save project:', projectData);
    };

    return (
        <div>
            <StickyHeader>
                <CustomHeader 
                    view={view} 
                    setView={setView}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    currentSort={currentSort}
                    onCreateProject={handleCreateProject}
                />
            </StickyHeader>

            <div className="hwc-dashboard">
                {view === 'map' && (
                    <>
                        <HWCMap projects={projects} onEditProject={handleEditProject} />
                        <div className="mobile-map-message">
                            Map view is not available on mobile devices. Please use card or list view.
                        </div>
                    </>
                )}
                {view === 'card' && <CardGrid projects={projects} onEditProject={handleEditProject} />}
                {view === 'list' && <ListView projects={projects} onEditProject={handleEditProject} />}
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={editingProject}
                onSave={handleSaveProject}
            />
        </div>
    );
}

import { CardGrid } from "./Card/CardGrid";
import { HWCMap } from "./Map/main";
import { ListView } from "./List/ListView";
import { StickyHeader } from "../StickyHeader/main";
import { CustomHeader } from "./CustomHeader/main";
import { useState } from "react";

export function Dashboard({ projects }) {
    const [view, setView] = useState('map');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSort, setCurrentSort] = useState({ sortBy: 'created_at', sortOrder: 'desc' });

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

    return (
        <div>
            <StickyHeader>
                <CustomHeader 
                    view={view} 
                    setView={setView}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    currentSort={currentSort}
                />
            </StickyHeader>

            <div className="hwc-dashboard">
                {view === 'map' && (
                    <>
                        <HWCMap projects={projects} />
                        <div className="mobile-map-message">
                            Map view is not available on mobile devices. Please use card or list view.
                        </div>
                    </>
                )}
                {view === 'card' && <CardGrid projects={projects} />}
                {view === 'list' && <ListView projects={projects} />}
            </div>
        </div>
    );
}
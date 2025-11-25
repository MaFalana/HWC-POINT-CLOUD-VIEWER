
import { HWCCard } from "./Card/main";
import { HWCMap } from "./Map/main";
import { StickyHeader } from "../StickyHeader/main"
import { ViewToggle } from "./CustomHeader/main"

import { useState, useEffect } from "react";

export function Dashboard({ projects }) {
    const [view, setView] = useState('map');

    return (
        <div>
            <StickyHeader>
                <ViewToggle view={view} setView={setView} />
            </StickyHeader>

            <div className="hwc-dashboard">
                {view === 'map' && <HWCMap projects={projects} />}
                {view === 'card' && <div>Card view coming soon...</div>}
                {view === 'list' && <div>List view coming soon...</div>}
            </div>
        </div>
    );
}

import { CardGrid } from "./Card/CardGrid";
import { HWCMap } from "./Map/main";
import { ListView } from "./List/ListView";
import { StickyHeader } from "../StickyHeader/main";
import { ViewToggle } from "./CustomHeader/main";
import { useState } from "react";

export function Dashboard({ projects }) {
    const [view, setView] = useState('map');

    return (
        <div>
            <StickyHeader>
                <ViewToggle view={view} setView={setView} />
            </StickyHeader>

            <div className="hwc-dashboard">
                {view === 'map' && <HWCMap projects={projects} />}
                {view === 'card' && <CardGrid projects={projects} />}
                {view === 'list' && <ListView projects={projects} />}
            </div>
        </div>
    );
}
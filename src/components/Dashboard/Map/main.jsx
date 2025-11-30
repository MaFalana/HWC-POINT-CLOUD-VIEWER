import '../../../styles/map.css';
import '../../../styles/marker.css';
import 'leaflet/dist/leaflet.css';

import { useState, useEffect } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { LayerToggle, ZoomControls } from './controls';
import { MapAttribution } from './Attribution';
import { MapList } from './MapList';

// Component to handle auto-fitting bounds on initial load
function FitBounds({ projects }) {
    const map = useMap();

    useEffect(() => {
        if (projects && projects.length > 0) {
            const bounds = projects
                .filter(project => project.location?.lat && project.location?.lon)
                .map(project => [project.location.lat, project.location.lon]);
            
            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, []); // Empty dependency array = run once on mount

    return null;
}

// Component to handle zoom controls with map instance
function MapZoomControls({ projects }) {
    const map = useMap();

    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();
    const handleZoomToAll = () => {
        if (projects && projects.length > 0) {
            const bounds = projects
                .filter(project => project.location?.lat && project.location?.lon)
                .map(project => [project.location.lat, project.location.lon]);
            
            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    };

    return <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onZoomToAll={handleZoomToAll} />;
}

// Component to handle navigation to specific project
function MapNavigator({ targetProject }) {
    const map = useMap();

    useEffect(() => {
        if (targetProject && targetProject.location) {
            map.panTo([targetProject.location.lat, targetProject.location.lon], {
                animate: true,
                duration: 1
            });
        }
    }, [targetProject, map]);

    return null;
}

export function HWCMap({ projects = [], onEditProject, onDeleteProject }) {
    const apiKey = import.meta.env.PUBLIC_MAPTILER_API_KEY;
    const [highlightedId, setHighlightedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [targetProject, setTargetProject] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [baseLayer, setBaseLayer] = useState("satellite");

    // Detect mobile on mount
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Create custom icon function
    const createCustomIcon = () => {
        // Use larger icon sizes on mobile for better touch targets
        const size = isMobile ? 32 : 24;

        return divIcon({
            html: `<div>•</div>`,
            className: 'hwc-map-marker',
            iconSize: [size, size]
        });
    };

    // Custom cluster icon
    const createClusterCustomIcon = (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 33 : count < 100 ? 40 : 47;
        return divIcon({
            html: `<div>${count}</div>`,
            className: "hwc-marker-cluster",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });
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

    const handleNavigate = (project) => {
        setTargetProject(project);
    };

    const handleHover = (id) => {
        setHighlightedId(id);
    };

    return (
        <div className="map-wrapper">
            <MapList 
                projects={projects.filter(p => p.location?.lat && p.location?.lon)}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onNavigate={handleNavigate}
                highlightedId={highlightedId}
                onHover={handleHover}
                onEditProject={onEditProject}
                onDeleteProject={onDeleteProject}
            />
            <LayerToggle baseLayer={baseLayer} setBaseLayer={setBaseLayer} />
            <MapAttribution />
            
            <MapContainer
            center={[0, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={18}
            zoomControl={false}
            attributionControl={false}
            worldCopyJump={true}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            fadeAnimation={true}
            markerZoomAnimation={true}
            style={{ height: "100%", width: "100%" }}
        >
            {baseLayer === "streets" && (
                <TileLayer
                    key="streets"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
            )}
            {baseLayer === "satellite" && (
                <TileLayer
                    key="satellite"
                    url={`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${apiKey}`}
                    attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                />
            )}

            <FitBounds projects={projects} />
            <MapZoomControls projects={projects} />
            <MapNavigator targetProject={targetProject} />

            <MarkerClusterGroup
                iconCreateFunction={createClusterCustomIcon}
                showCoverageOnHover={false}
            >
                {projects
                    .filter(project => project.location?.lat && project.location?.lon)
                    .map((project) => (
                        <Marker
                            key={project._id}
                            position={[project.location.lat, project.location.lon]}
                            icon={createCustomIcon()}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                {project.name || project._id}
                            </Tooltip>
                        </Marker>
                    ))}
            </MarkerClusterGroup>
        </MapContainer>
        </div>
    );
}

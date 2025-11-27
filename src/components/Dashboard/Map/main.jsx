import '../../../styles/map.css';
import '../../../styles/marker.css';
import 'leaflet/dist/leaflet.css';

import { useState, useEffect } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { LayerToggle, ZoomControls } from './controls';
import { MapAttribution } from './Attribution';

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

export function HWCMap({ projects = [] }) {
    const apiKey = import.meta.env.PUBLIC_MAPTILER_API_KEY;
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [baseLayer, setBaseLayer] = useState("satellite");

    // Detect mobile on mount
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Create custom icon function that accepts active and selected states
    const createCustomIcon = (projectId) => {
        const isSelected = selectedMarkerId === projectId;

        let className = 'hwc-map-marker';
        if (isSelected) className += ' selected';

        // Use larger icon sizes on mobile for better touch targets
        const baseSize = isMobile ? 32 : 24;
        const selectedSize = isMobile ? 36 : 28;

        const size = isSelected ? selectedSize : baseSize;

        return divIcon({
            html: `<div>•</div>`,
            className: className,
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

    const handleMarkerClick = (projectId) => {
        setSelectedMarkerId(projectId);
        // Add additional logic here (e.g., show project details)
    };

    return (
        <div className="map-wrapper">
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
                            icon={createCustomIcon(project._id)}
                            eventHandlers={{
                                click: () => handleMarkerClick(project._id)
                            }}
                        />
                    ))}
            </MarkerClusterGroup>
        </MapContainer>
        </div>
    );
}

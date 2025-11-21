export function HWCCard({ project }) {
    return (
        <div className="hwc-card">
            <h3>{project.name || project.id}</h3>
            {/* Add your card content here */}
        </div>
    );
}
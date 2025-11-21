import '../../../styles/card.css'

export function HWCCard({ project }) {
    return (
        <div className="hwc-card">
            <img src={project.thumbnail} alt={`${project.name} thumbnail image`} />
            <h1>{project.name}</h1>
            <h2>{project.id}</h2>
            <h3>{project.date}</h3>
            <p>{project.client}</p> {/* Add the tags parameter after client later will be a list that needs to be mapped*/}
            <button>View Project</button> {/* Use a vertical ellipsis icon */}
        </div>
    );
}

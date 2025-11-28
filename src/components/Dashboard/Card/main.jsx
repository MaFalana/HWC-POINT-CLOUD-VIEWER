import '../../../styles/card.css';
import '../../../styles/project-menu.css';
import { FaEllipsisVertical } from "react-icons/fa6";
import { ProjectMenu } from '../ProjectMenu';

export function HWCCard({ project, onEditProject }) {
    const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="hwc-card">
            <div className="card-image">
                {project.thumbnail ? (
                    <img 
                        src={`https://hwctopodot.blob.core.windows.net/hwc-potree/${project._id}/thumbnail.png`} 
                        alt={project.name}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = 'var(--hwc-light-gray)';
                        }}
                    />
                ) : (
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--hwc-medium-gray)'
                    }}>
                        No preview
                    </div>
                )}
            </div>
            
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{project.name}</h3>
                    <ProjectMenu
                        projectId={project._id}
                        projectName={project.name}
                        project={project}
                        onEdit={onEditProject}
                        triggerButton={{
                            className: "card-menu-btn",
                            ariaLabel: "More options",
                            icon: <FaEllipsisVertical />
                        }}
                    />
                </div>
                
                <p className="card-id">{project._id}</p>
                <p className="card-client">{project.client}</p>
                <p className="card-date">{formattedDate}</p>
                
                {project.tags && project.tags.length > 0 && (
                    <div className="card-tags">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="card-tag">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

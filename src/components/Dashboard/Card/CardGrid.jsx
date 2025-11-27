import { HWCCard } from './main';
import '../../../styles/card.css';

export function CardGrid({ projects }) {
  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {projects.map((project) => (
          <HWCCard key={project._id} project={project} />
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="empty-state">
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
}

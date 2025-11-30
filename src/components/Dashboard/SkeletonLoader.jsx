import '../../styles/skeleton.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
        <div className="skeleton-tags">
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton-checkbox"></div></td>
      <td><div className="skeleton-text"></div></td>
      <td><div className="skeleton-text"></div></td>
      <td><div className="skeleton-text"></div></td>
      <td><div className="skeleton-text short"></div></td>
      <td><div className="skeleton-text short"></div></td>
      <td><div className="skeleton-text short"></div></td>
      <td><div className="skeleton-icon"></div></td>
    </tr>
  );
}

export function SkeletonMapItem() {
  return (
    <div className="skeleton-map-item">
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
}

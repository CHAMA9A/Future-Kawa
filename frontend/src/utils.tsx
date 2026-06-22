export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusBadge(status: string) {
  const className = `badge badge-${status.toLowerCase()}`;
  return <span className={className}>{status}</span>;
}

export function alertTypeBadge(type: string) {
  let className = 'badge ';
  switch (type) {
    case 'TEMPERATURE':
      className += 'badge-temperature';
      break;
    case 'HUMIDITY':
      className += 'badge-humidity';
      break;
    case 'EXPIRED_LOT':
      className += 'badge-expired';
      break;
    default:
      className += 'badge-default';
  }
  return <span className={className}>{type}</span>;
}
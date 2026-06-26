import type { Alert } from '../types';
import { formatDate, statusBadge } from '../utils';

interface Props {
  alerts: Alert[];
}

const alertTypeLabels: Record<string, string> = {
  TEMPERATURE: 'Température',
  HUMIDITY: 'Humidité',
  EXPIRED_LOT: 'Lot périmé',
};

const severity: Record<string, number> = {
  EXPIRED_LOT: 0,
  TEMPERATURE: 1,
  HUMIDITY: 2,
};

export default function AlertsTable({ alerts }: Props) {
  if (alerts.length === 0) {
    return <div className="table-empty">Aucune alerte disponible pour ce pays.</div>;
  }

  const sorted = [...alerts].sort((a, b) => {
    const sa = severity[a.type] ?? 99;
    const sb = severity[b.type] ?? 99;
    return sa - sb;
  });

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.id}</td>
              <td>
                <span className={`badge badge-${alert.type.toLowerCase()}`}>
                  {alertTypeLabels[alert.type] ?? alert.type}
                </span>
              </td>
              <td className="alert-message-cell">{alert.message}</td>
              <td>{statusBadge(alert.status)}</td>
              <td>{formatDate(alert.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import type { Alert } from '../types';
import { formatDate, alertTypeBadge } from '../utils';

interface Props {
  alerts: Alert[];
}

export default function AlertsTable({ alerts }: Props) {
  if (alerts.length === 0) {
    return <div className="table-empty">Aucune alerte</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>Statut</th>
            <th>Créé le</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.id}</td>
              <td>{alertTypeBadge(alert.type)}</td>
              <td>{alert.message}</td>
              <td>
                <span className={`badge badge-${alert.status.toLowerCase()}`}>
                  {alert.status}
                </span>
              </td>
              <td>{formatDate(alert.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
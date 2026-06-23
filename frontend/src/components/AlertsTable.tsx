import type { Alert } from '../types';
import { formatDate } from '../utils';

interface Props {
  alerts: Alert[];
}

const alertStyles: Record<string, { label: string }> = {
  TEMPERATURE: { label: 'Température' },
  HUMIDITY: { label: 'Humidité' },
  EXPIRED_LOT: { label: 'Lot périmé' },
};

const severity: Record<string, number> = {
  EXPIRED_LOT: 0,
  TEMPERATURE: 1,
  HUMIDITY: 2,
};

export default function AlertsTable({ alerts }: Props) {
  if (alerts.length === 0) {
    return <div className="table-empty">Aucune donnée disponible pour ce pays.</div>;
  }

  const sorted = [...alerts].sort((a, b) => {
    const sa = severity[a.type] ?? 99;
    const sb = severity[b.type] ?? 99;
    return sa - sb;
  });

  return (
    <div className="alerts-list">
      {sorted.map((alert, i) => {
        const al = alertStyles[alert.type] ?? { label: alert.type };
        return (
          <div key={alert.id} className={`alert-card alert-${alert.type.toLowerCase()}`}>
            <div className="alert-card-header">
              <span className="alert-card-index">#{i + 1}</span>
              <span className="alert-card-type">{al.label}</span>
              <span className="alert-card-date">{formatDate(alert.createdAt)}</span>
              <button className="alert-card-close">&times;</button>
            </div>
            <p className="alert-card-message">{alert.message}</p>
            <span className="alert-card-status">{alert.status}</span>
          </div>
        );
      })}
    </div>
  );
}
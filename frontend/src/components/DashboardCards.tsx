import type { Lot, Measurement, Alert } from '../types';

interface Props {
  lots: Lot[];
  fifoLots: Lot[];
  measurements: Measurement[];
  alerts: Alert[];
  countryName: string;
  serviceStatus: string;
}

export default function DashboardCards({
  lots,
  fifoLots,
  measurements,
  alerts,
  countryName,
  serviceStatus,
}: Props) {
  const cards = [
    {
      title: 'Pays',
      value: countryName,
      color: 'var(--color-brown)',
    },
    {
      title: 'Lots en stock',
      value: lots.length,
      color: 'var(--color-green)',
    },
    {
      title: 'Lots FIFO',
      value: fifoLots.length,
      color: 'var(--color-brown)',
    },
    {
      title: 'Mesures',
      value: measurements.length,
      color: 'var(--color-blue)',
    },
    {
      title: 'Alertes',
      value: alerts.length,
      color: alerts.length > 0 ? 'var(--color-red)' : 'var(--color-green)',
    },
    {
      title: 'Statut service',
      value: serviceStatus === 'online' ? 'En ligne' : 'Hors ligne',
      color: serviceStatus === 'online' ? 'var(--color-green)' : 'var(--color-red)',
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.title} className="dashboard-card" style={{ borderTopColor: card.color }}>
          <span className="card-title">{card.title}</span>
          <span className="card-value">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
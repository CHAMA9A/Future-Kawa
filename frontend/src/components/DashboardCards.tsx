import type { Lot, Measurement, Alert } from '../types';

interface Props {
  lots: Lot[];
  fifoLots: Lot[];
  measurements: Measurement[];
  alerts: Alert[];
  countryName: string;
  serviceOnline: boolean;
}

interface Card {
  key: string;
  title: string;
  hint: string;
  value: string | number;
  accent: string;
}

export default function DashboardCards({
  lots,
  fifoLots,
  measurements,
  alerts,
  countryName,
  serviceOnline,
}: Props) {
  const cards: Card[] = [
    {
      key: 'country',
      title: 'Pays sélectionné',
      hint: 'Zone de production',
      value: countryName,
      accent: '#1565C0',
    },
    {
      key: 'lots',
      title: 'Lots en stock',
      hint: 'Total lots enregistrés',
      value: lots.length,
      accent: '#10B981',
    },
    {
      key: 'fifo',
      title: 'Sortie FIFO',
      hint: 'Lots à sortir en priorité',
      value: fifoLots.length,
      accent: '#1565C0',
    },
    {
      key: 'measures',
      title: 'Mesures IoT',
      hint: 'Relevés capteurs',
      value: measurements.length,
      accent: '#6366F1',
    },
    {
      key: 'alerts',
      title: 'Alertes actives',
      hint: 'Anomalies détectées',
      value: alerts.length,
      accent: alerts.length > 0 ? '#EF4444' : '#10B981',
    },
    {
      key: 'status',
      title: 'Statut service',
      hint: 'Connexion API',
      value: serviceOnline ? 'En ligne' : 'Hors ligne',
      accent: serviceOnline ? '#10B981' : '#EF4444',
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.key} className="dashboard-card">
          <div className="card-dot" style={{ background: card.accent }} />
          <div className="card-body">
            <span className="card-title">{card.title}</span>
            <span className="card-value">{card.value}</span>
            <span className="card-hint">{card.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
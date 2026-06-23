import type { Country, Measurement, Alert } from '../types';

interface Props {
  country: Country | undefined;
  measurements: Measurement[];
  alerts: Alert[];
}

const thresholds: Record<string, { tempMin: number; tempMax: number; humMin: number; humMax: number }> = {
  brazil: { tempMin: 26, tempMax: 32, humMin: 53, humMax: 57 },
  ecuador: { tempMin: 28, tempMax: 34, humMin: 58, humMax: 62 },
  colombia: { tempMin: 23, tempMax: 29, humMin: 78, humMax: 82 },
};

export default function CountryOverview({ country, measurements, alerts }: Props) {
  if (!country) return null;

  const t = thresholds[country.code] ?? { tempMin: 20, tempMax: 30, humMin: 40, humMax: 60 };
  const lastMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const lastMeasurementTime = lastMeasurement
    ? new Date(lastMeasurement.measuredAt).toLocaleString('fr-FR')
    : 'Aucune mesure';

  return (
    <div className="country-overview">
      <h2 className="country-overview-title">
        Country overview — {country.name}
      </h2>
      <div className="country-overview-grid">
        <div className="country-overview-item">
          <span className="co-label">Entrepôt principal</span>
          <span className="co-value">Warehouse-1</span>
        </div>
        <div className="country-overview-item">
          <span className="co-label">Température acceptable</span>
          <span className="co-value">{t.tempMin}°C - {t.tempMax}°C</span>
        </div>
        <div className="country-overview-item">
          <span className="co-label">Humidité acceptable</span>
          <span className="co-value">{t.humMin}% - {t.humMax}%</span>
        </div>
        <div className="country-overview-item">
          <span className="co-label">Alertes actives</span>
          <span className={`co-value ${alerts.length > 0 ? 'co-alert' : ''}`}>
            {alerts.length}
          </span>
        </div>
        <div className="country-overview-item">
          <span className="co-label">Dernière mesure</span>
          <span className="co-value">{lastMeasurementTime}</span>
        </div>
        <div className="country-overview-item">
          <span className="co-label">Statut service</span>
          <span className={`co-value co-status ${country.status === 'online' ? 'co-online' : ''}`}>
            {country.status === 'online' ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>
    </div>
  );
}
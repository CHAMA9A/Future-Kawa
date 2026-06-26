import type { Country, Measurement, Alert, AlertThresholds } from '../types';

interface Props {
  country: Country | undefined;
  measurements: Measurement[];
  alerts: Alert[];
  thresholds: AlertThresholds | null;
}

export default function CountryOverview({ country, measurements, alerts, thresholds }: Props) {
  if (!country) return null;

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
          <span className="co-value">
            {thresholds ? `${thresholds.temperature.min}°C - ${thresholds.temperature.max}°C` : '...'}
          </span>
        </div>
        <div className="country-overview-item">
          <span className="co-label">Humidité acceptable</span>
          <span className="co-value">
            {thresholds ? `${thresholds.humidity.min}% - ${thresholds.humidity.max}%` : '...'}
          </span>
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
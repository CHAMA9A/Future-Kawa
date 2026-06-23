import type { Measurement } from '../types';
import { formatDate } from '../utils';

interface Props {
  measurements: Measurement[];
}

export default function MeasurementsTable({ measurements }: Props) {
  if (measurements.length === 0) {
    return <div className="table-empty">Aucune donnée disponible pour ce pays.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Entrepôt</th>
            <th>Température (°C)</th>
            <th>Humidité (%)</th>
            <th>Mesuré le</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.warehouseName}</td>
              <td className={`value-${m.temperature > 30 ? 'high' : m.temperature < 20 ? 'low' : 'ok'}`}>
                {m.temperature.toFixed(1)} °C
              </td>
              <td className={`value-${m.humidity > 80 ? 'high' : m.humidity < 40 ? 'low' : 'ok'}`}>
                {m.humidity.toFixed(1)} %
              </td>
              <td>{formatDate(m.measuredAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
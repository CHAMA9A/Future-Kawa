import type { Measurement } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  measurements: Measurement[];
}

export default function MeasurementsChart({ measurements }: Props) {
  if (measurements.length === 0) {
    return (
      <div className="chart-empty">
        Aucune mesure disponible pour le graphique.
      </div>
    );
  }

  const data = measurements.map((m, i) => ({
    index: i + 1,
    temperature: m.temperature,
    humidity: m.humidity,
    warehouse: m.warehouseName,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE5" />
          <XAxis dataKey="index" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #D7CCC8',
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#C62828"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Température (°C)"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#1565C0"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Humidité (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
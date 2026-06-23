import type { Alert } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  alerts: Alert[];
}

const COLORS: Record<string, string> = {
  TEMPERATURE: '#C62828',
  HUMIDITY: '#1565C0',
  EXPIRED_LOT: '#6A1B9A',
};

export default function AlertsChart({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="chart-empty">
        Aucune alerte à afficher.
      </div>
    );
  }

  const counts: Record<string, number> = {};
  alerts.forEach((a) => {
    counts[a.type] = (counts[a.type] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || '#BDBDBD'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #D7CCC8',
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: '#3E2723', fontSize: 13 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
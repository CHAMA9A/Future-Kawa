import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LotsTable from '../components/LotsTable';
import MeasurementsTable from '../components/MeasurementsTable';
import AlertsTable from '../components/AlertsTable';
import FifoLotsTable from '../components/FifoLotsTable';

describe('LotsTable with empty data', () => {
  it('shows empty message when no lots', () => {
    render(<LotsTable lots={[]} />);
    expect(screen.getByText('Aucune donnée disponible pour ce pays.')).toBeInTheDocument();
  });

  it('renders rows when lots are provided', () => {
    const lots = [
      { id: 1, lotCode: 'BRA-001', country: 'Brazil', warehouseName: 'W1', storageDate: '2024-01-01T00:00:00.000Z', status: 'CONFORME', createdAt: '2024-01-01T00:00:00.000Z' },
    ];
    render(<LotsTable lots={lots} />);
    expect(screen.getByText('BRA-001')).toBeInTheDocument();
    expect(screen.queryByText('Aucune donnée disponible pour ce pays.')).not.toBeInTheDocument();
  });
});

describe('FifoLotsTable with empty data', () => {
  it('shows empty message when no FIFO lots', () => {
    render(<FifoLotsTable lots={[]} />);
    expect(screen.getByText('Aucune donnée disponible pour ce pays.')).toBeInTheDocument();
  });

  it('renders rows when FIFO lots are provided', () => {
    const lots = [
      { id: 1, lotCode: 'BRA-001', country: 'Brazil', warehouseName: 'W1', storageDate: '2024-01-01T00:00:00.000Z', status: 'CONFORME', createdAt: '2024-01-01T00:00:00.000Z' },
    ];
    render(<FifoLotsTable lots={lots} />);
    expect(screen.getByText('BRA-001')).toBeInTheDocument();
  });
});

describe('MeasurementsTable with empty data', () => {
  it('shows empty message when no measurements', () => {
    render(<MeasurementsTable measurements={[]} />);
    expect(screen.getByText('Aucune donnée disponible pour ce pays.')).toBeInTheDocument();
  });

  it('renders rows when measurements are provided', () => {
    const measurements = [
      { id: 1, warehouseName: 'W1', temperature: 30, humidity: 55, measuredAt: '2024-01-01T00:00:00.000Z' },
    ];
    render(<MeasurementsTable measurements={measurements} />);
    expect(screen.getByText('30.0 °C')).toBeInTheDocument();
    expect(screen.getByText('55.0 %')).toBeInTheDocument();
  });
});

describe('AlertsTable with empty data', () => {
  it('shows empty message when no alerts', () => {
    render(<AlertsTable alerts={[]} />);
    expect(screen.getByText('Aucune donnée disponible pour ce pays.')).toBeInTheDocument();
  });

  it('renders alert cards when alerts are provided', () => {
    const alerts = [
      { id: 1, type: 'TEMPERATURE', message: 'Température élevée', status: 'ACTIVE', createdAt: '2024-01-01T00:00:00.000Z' },
    ];
    render(<AlertsTable alerts={alerts} />);
    expect(screen.getByText('Température')).toBeInTheDocument();
    expect(screen.getByText('Température élevée')).toBeInTheDocument();
  });
});
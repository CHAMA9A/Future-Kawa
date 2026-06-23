import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardCards from '../components/DashboardCards';

describe('DashboardCards', () => {
  const baseProps = {
    lots: [],
    fifoLots: [],
    measurements: [],
    alerts: [],
    countryName: 'Brazil',
    serviceOnline: true,
  };

  it('renders all stat cards', () => {
    render(<DashboardCards {...baseProps} />);

    expect(screen.getByText('Pays sélectionné')).toBeInTheDocument();
    expect(screen.getByText('Lots en stock')).toBeInTheDocument();
    expect(screen.getByText('Sortie FIFO')).toBeInTheDocument();
    expect(screen.getByText('Mesures IoT')).toBeInTheDocument();
    expect(screen.getByText('Alertes actives')).toBeInTheDocument();
    expect(screen.getByText('Statut service')).toBeInTheDocument();
  });

  it('displays the selected country name', () => {
    render(<DashboardCards {...baseProps} countryName="Ecuador" />);
    expect(screen.getByText('Ecuador')).toBeInTheDocument();
  });

  it('shows lot count correctly', () => {
    const lots = [
      { id: 1, lotCode: 'BRA-001', country: 'Brazil', warehouseName: 'W1', storageDate: '2024-01-01', status: 'CONFORME', createdAt: '2024-01-01' },
      { id: 2, lotCode: 'BRA-002', country: 'Brazil', warehouseName: 'W1', storageDate: '2024-02-01', status: 'CONFORME', createdAt: '2024-02-01' },
    ];

    render(<DashboardCards {...baseProps} lots={lots} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows FIFO count correctly', () => {
    const fifoLots = [
      { id: 1, lotCode: 'BRA-001', country: 'Brazil', warehouseName: 'W1', storageDate: '2024-01-01', status: 'CONFORME', createdAt: '2024-01-01' },
    ];

    render(<DashboardCards {...baseProps} fifoLots={fifoLots} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows measurements count correctly', () => {
    const measurements = [
      { id: 1, warehouseName: 'W1', temperature: 30, humidity: 55, measuredAt: '2024-01-01' },
      { id: 2, warehouseName: 'W1', temperature: 31, humidity: 56, measuredAt: '2024-01-02' },
      { id: 3, warehouseName: 'W1', temperature: 29, humidity: 54, measuredAt: '2024-01-03' },
    ];

    render(<DashboardCards {...baseProps} measurements={measurements} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows alerts count correctly', () => {
    const alerts = [
      { id: 1, type: 'TEMPERATURE', message: 'High temp', status: 'ACTIVE', createdAt: '2024-01-01' },
    ];

    render(<DashboardCards {...baseProps} alerts={alerts} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows "En ligne" when service is online', () => {
    render(<DashboardCards {...baseProps} serviceOnline={true} />);
    expect(screen.getByText('En ligne')).toBeInTheDocument();
  });

  it('shows "Hors ligne" when service is offline', () => {
    render(<DashboardCards {...baseProps} serviceOnline={false} />);
    expect(screen.getByText('Hors ligne')).toBeInTheDocument();
  });
});
import { useState, useEffect } from 'react';
import type { Country, Lot, Measurement, Alert } from '../types';
import { fetchCountries, fetchAllDashboardData } from '../api/centralApi';
import CountrySelector from '../components/CountrySelector';
import DashboardCards from '../components/DashboardCards';
import LotsTable from '../components/LotsTable';
import FifoLotsTable from '../components/FifoLotsTable';
import MeasurementsTable from '../components/MeasurementsTable';
import AlertsTable from '../components/AlertsTable';

export default function Dashboard() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('brazil');
  const [lots, setLots] = useState<Lot[]>([]);
  const [fifoLots, setFifoLots] = useState<Lot[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries()
      .then((list) => {
        setCountries(list);
        if (list.length > 0) {
          setSelectedCountry(list[0].code);
        }
      })
      .catch(() => {
        setError('Unable to load data from central backend');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoading(true);
    setError(null);
    fetchAllDashboardData(selectedCountry)
      .then((result) => {
        setLots(result.lots);
        setFifoLots(result.fifoLots);
        setMeasurements(result.measurements);
        setAlerts(result.alerts);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load data from central backend');
        setLoading(false);
      });
  }, [selectedCountry]);

  const currentCountry = countries.find((c) => c.code === selectedCountry);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>FutureKawa</h1>
          <p className="subtitle">Suivi des stocks de café vert</p>
        </div>
        <CountrySelector
          countries={countries}
          selected={selectedCountry}
          onChange={setSelectedCountry}
          disabled={loading}
        />
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p>Chargement des données...</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <DashboardCards
            lots={lots}
            fifoLots={fifoLots}
            measurements={measurements}
            alerts={alerts}
            countryName={currentCountry?.name ?? selectedCountry}
            serviceStatus={currentCountry?.status ?? 'unknown'}
          />

          <section className="data-section">
            <h2>Lots en stock</h2>
            <LotsTable lots={lots} />
          </section>

          <section className="data-section">
            <h2>Sortie FIFO</h2>
            <FifoLotsTable lots={fifoLots} />
          </section>

          <div className="data-grid">
            <section className="data-section">
              <h2>Mesures capteurs</h2>
              <MeasurementsTable measurements={measurements} />
            </section>

            <section className="data-section">
              <h2>Alertes</h2>
              <AlertsTable alerts={alerts} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
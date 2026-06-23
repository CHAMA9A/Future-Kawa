import { useState, useEffect, useRef, useCallback } from 'react';
import type { Country, Lot, Measurement, Alert, Section } from '../types';
import { fetchCountries, fetchAllDashboardData } from '../api/centralApi';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CountryOverview from '../components/CountryOverview';
import DashboardCards from '../components/DashboardCards';
import LotsTable from '../components/LotsTable';
import FifoLotsTable from '../components/FifoLotsTable';
import MeasurementsTable from '../components/MeasurementsTable';
import AlertsTable from '../components/AlertsTable';
import MeasurementsChart from '../components/MeasurementsChart';
import AlertsChart from '../components/AlertsChart';

export default function Dashboard() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('brazil');
  const [lots, setLots] = useState<Lot[]>([]);
  const [fifoLots, setFifoLots] = useState<Lot[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const sectionRefs = {
    dashboard: useRef<HTMLDivElement>(null),
    lots: useRef<HTMLDivElement>(null),
    measurements: useRef<HTMLDivElement>(null),
    alerts: useRef<HTMLDivElement>(null),
  };

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

  const handleNavigate = useCallback((section: Section) => {
    setActiveSection(section);
    const ref = sectionRefs[section];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const currentCountry = countries.find((c) => c.code === selectedCountry);
  const serviceOnline = !loading && !error && countries.length > 0;

  return (
    <div className="app-layout">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        serviceOnline={serviceOnline}
      />
      <main className="main-content">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <p>Chargement des données...</p>
          </div>
        )}

        {!loading && !error && (
          <div className="main-scroll">
            <div ref={sectionRefs.dashboard}>
              <HeroSection />
              <DashboardCards
                lots={lots}
                fifoLots={fifoLots}
                measurements={measurements}
                alerts={alerts}
                countryName={currentCountry?.name ?? selectedCountry}
                serviceOnline={serviceOnline}
              />
              <CountryOverview
                country={currentCountry}
                measurements={measurements}
                alerts={alerts}
              />
              <div className="charts-grid">
                <section className="data-section">
                  <h2>Température & Humidité</h2>
                  <MeasurementsChart measurements={measurements} />
                </section>
                <section className="data-section">
                  <h2>Répartition des alertes</h2>
                  <AlertsChart alerts={alerts} />
                </section>
              </div>
            </div>

            <div ref={sectionRefs.lots}>
              <section className="data-section">
                <h2>Lots en stock</h2>
                <LotsTable lots={lots} />
              </section>
              <section className="data-section">
                <h2>Sortie FIFO</h2>
                <FifoLotsTable lots={fifoLots} />
              </section>
            </div>

            <div ref={sectionRefs.measurements}>
              <section className="data-section">
                <h2>Mesures capteurs</h2>
                <MeasurementsTable measurements={measurements} />
              </section>
            </div>

            <div ref={sectionRefs.alerts}>
              <section className="data-section">
                <h2>Alertes</h2>
                <AlertsTable alerts={alerts} />
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
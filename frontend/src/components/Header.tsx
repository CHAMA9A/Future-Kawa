import type { Country } from '../types';
import CountrySelector from './CountrySelector';

interface Props {
  title: string;
  subtitle: string;
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (code: string) => void;
  loading: boolean;
  serviceOnline: boolean;
}

export default function Header({
  title,
  subtitle,
  countries,
  selectedCountry,
  onCountryChange,
  loading,
  serviceOnline,
}: Props) {
  return (
    <header className="main-header">
      <div className="main-header-left">
        <h1 className="main-header-title">{title}</h1>
        <p className="main-header-subtitle">{subtitle}</p>
      </div>
      <div className="main-header-right">
        <div className="system-status">
          <span
            className={`status-dot ${serviceOnline ? 'online' : 'offline'}`}
          />
          <span className="status-label">
            {serviceOnline ? 'Système en ligne' : 'Hors ligne'}
          </span>
        </div>
        <CountrySelector
          countries={countries}
          selected={selectedCountry}
          onChange={onCountryChange}
          disabled={loading}
        />
      </div>
    </header>
  );
}
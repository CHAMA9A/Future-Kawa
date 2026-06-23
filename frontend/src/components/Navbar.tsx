import type { Section } from '../types';
import type { Country } from '../types';

interface Props {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (code: string) => void;
  serviceOnline: boolean;
}

const navItems: { id: Section; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'lots', label: 'Lots' },
  { id: 'measurements', label: 'Mesures IoT' },
  { id: 'alerts', label: 'Alertes' },
];

export default function Navbar({
  activeSection,
  onNavigate,
  countries,
  selectedCountry,
  onCountryChange,
  serviceOnline,
}: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="/logo.png" alt="FutureKawa" className="navbar-logo-img" />
          
        </div>

        <div className="navbar-tabs">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`navbar-tab ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-country">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="navbar-select"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="navbar-status">
          <span className={`status-indicator ${serviceOnline ? 'online' : 'offline'}`} />
          <span className="status-text">{serviceOnline ? 'En ligne' : 'Hors ligne'}</span>
        </div>

        <div className="navbar-user">
          <div className="navbar-avatar">AD</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">Admin</span>
            <span className="navbar-user-role">Super Admin</span>
          </div>
          <button className="navbar-logout" title="Déconnexion">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
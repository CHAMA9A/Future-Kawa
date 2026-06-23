export type Section = 'dashboard' | 'lots' | 'measurements' | 'alerts';

interface Props {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'lots', label: 'Lots', icon: '📦' },
  { id: 'measurements', label: 'Mesures IoT', icon: '📡' },
  { id: 'alerts', label: 'Alertes', icon: '🔔' },
];

export default function Sidebar({ activeSection, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">☕</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">FutureKawa</span>
          <span className="sidebar-logo-sub">Supervision IoT</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-nav-title">Navigation</span>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-text">FutureKawa v1.0</span>
        <span className="sidebar-footer-sub">Multi-country IoT</span>
      </div>
    </aside>
  );
}
export default function HeroSection() {
  return (
    <div className="hero-section">
      <img src="/logo.png" alt="" className="hero-logo-watermark" />
      <div className="hero-content">
        <h2>Supervision des stocks de café vert</h2>
        <p>Monitoring centralisé des entrepôts, capteurs IoT et alertes qualité.</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">3</span>
            <span className="hero-stat-label">Pays connectés</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">1</span>
            <span className="hero-stat-label">Backend central</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">MQTT</span>
            <span className="hero-stat-label">Protocole IoT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
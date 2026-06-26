import { useState, useEffect, useCallback } from 'react';
import type { AlertThresholds } from '../types';
import { getThresholds, updateThresholds, resetThresholds } from '../api/centralApi';

interface Props {
  country: string;
  onThresholdsChange?: (thresholds: AlertThresholds) => void;
}

const defaultThresholds: AlertThresholds = {
  temperature: { min: 0, max: 0 },
  humidity: { min: 0, max: 0 },
};

export default function ThresholdSettings({ country, onThresholdsChange }: Props) {
  const [thresholds, setThresholds] = useState<AlertThresholds>(defaultThresholds);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadThresholds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getThresholds(country);
      setThresholds(data);
    } catch {
      setError('Impossible de charger les seuils.');
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    loadThresholds();
  }, [loadThresholds]);

  const handleChange = (field: 'temperature' | 'humidity', sub: 'min' | 'max', value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setThresholds((prev) => ({
        ...prev,
        [field]: { ...prev[field], [sub]: num },
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const result = await updateThresholds(country, thresholds);
      setThresholds(result);
      setSuccess('Seuils mis à jour avec succès.');
      onThresholdsChange?.(result);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour des seuils.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const result = await resetThresholds(country);
      setThresholds(result);
      setSuccess('Seuils réinitialisés aux valeurs par défaut.');
      onThresholdsChange?.(result);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="threshold-settings">
      <h2>Réglage des seuils d'alerte</h2>

      {loading && <p className="threshold-loading">Chargement des seuils...</p>}

      {error && <div className="threshold-error">{error}</div>}
      {success && <div className="threshold-success">{success}</div>}

      {!loading && (
        <div className="threshold-fields">
          <div className="threshold-group">
            <label className="threshold-label">Température min (°C)</label>
            <input
              className="threshold-input"
              type="number"
              step="0.1"
              value={thresholds.temperature.min}
              onChange={(e) => handleChange('temperature', 'min', e.target.value)}
            />
          </div>
          <div className="threshold-group">
            <label className="threshold-label">Température max (°C)</label>
            <input
              className="threshold-input"
              type="number"
              step="0.1"
              value={thresholds.temperature.max}
              onChange={(e) => handleChange('temperature', 'max', e.target.value)}
            />
          </div>
          <div className="threshold-group">
            <label className="threshold-label">Humidité min (%)</label>
            <input
              className="threshold-input"
              type="number"
              step="0.1"
              value={thresholds.humidity.min}
              onChange={(e) => handleChange('humidity', 'min', e.target.value)}
            />
          </div>
          <div className="threshold-group">
            <label className="threshold-label">Humidité max (%)</label>
            <input
              className="threshold-input"
              type="number"
              step="0.1"
              value={thresholds.humidity.max}
              onChange={(e) => handleChange('humidity', 'max', e.target.value)}
            />
          </div>
          <div className="threshold-actions">
            <button
              className="threshold-btn threshold-btn-save"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Save thresholds'}
            </button>
            <button
              className="threshold-btn threshold-btn-reset"
              onClick={handleReset}
              disabled={saving}
            >
              Reset defaults
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

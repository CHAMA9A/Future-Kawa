import type { Country, Lot, Measurement, Alert, AlertThresholds } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export function fetchCountries(): Promise<Country[]> {
  return fetchJson<Country[]>(`${API_BASE}/api/central/countries`);
}

export function fetchLots(country: string): Promise<Lot[]> {
  return fetchJson<Lot[]>(`${API_BASE}/api/central/${country}/lots`);
}

export function fetchFifoLots(country: string): Promise<Lot[]> {
  return fetchJson<Lot[]>(`${API_BASE}/api/central/${country}/lots/fifo`);
}

export function fetchMeasurements(country: string): Promise<Measurement[]> {
  return fetchJson<Measurement[]>(`${API_BASE}/api/central/${country}/measurements`);
}

export function fetchAlerts(country: string): Promise<Alert[]> {
  return fetchJson<Alert[]>(`${API_BASE}/api/central/${country}/alerts`);
}

export function getThresholds(country: string): Promise<AlertThresholds> {
  return fetchJson<AlertThresholds>(`${API_BASE}/api/central/${country}/thresholds`);
}

export async function updateThresholds(country: string, thresholds: AlertThresholds): Promise<AlertThresholds> {
  const response = await fetch(`${API_BASE}/api/central/${country}/thresholds`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(thresholds),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function resetThresholds(country: string): Promise<AlertThresholds> {
  const response = await fetch(`${API_BASE}/api/central/${country}/thresholds/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAllDashboardData(country: string) {
  const [lots, fifoLots, measurements, alerts] = await Promise.all([
    fetchLots(country),
    fetchFifoLots(country),
    fetchMeasurements(country),
    fetchAlerts(country),
  ]);
  return { lots, fifoLots, measurements, alerts };
}

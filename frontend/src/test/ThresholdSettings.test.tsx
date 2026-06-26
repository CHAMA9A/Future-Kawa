import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThresholdSettings from '../components/ThresholdSettings';

const mockGetThresholds = vi.fn();
const mockUpdateThresholds = vi.fn();
const mockResetThresholds = vi.fn();

vi.mock('../api/centralApi', () => ({
  getThresholds: (...args: any[]) => mockGetThresholds(...args),
  updateThresholds: (...args: any[]) => mockUpdateThresholds(...args),
  resetThresholds: (...args: any[]) => mockResetThresholds(...args),
}));

const defaultThresholds = {
  temperature: { min: 30, max: 36 },
  humidity: { min: 30, max: 45 },
};

describe('ThresholdSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetThresholds.mockResolvedValue(defaultThresholds);
  });

  it('shows loading state then displays thresholds', async () => {
    render(<ThresholdSettings country="colombia" />);

    expect(screen.getByText('Chargement des seuils...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByDisplayValue('30')).toHaveLength(2);
    });

    expect(screen.getByDisplayValue('36')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45')).toBeInTheDocument();
  });

  it('displays the title', async () => {
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByText('Réglage des seuils d\'alerte')).toBeInTheDocument();
    });
  });

  it('has Save thresholds button', async () => {
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByText('Save thresholds')).toBeInTheDocument();
    });
  });

  it('has Reset defaults button', async () => {
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByText('Reset defaults')).toBeInTheDocument();
    });
  });

  it('calls getThresholds on mount with the country', async () => {
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(mockGetThresholds).toHaveBeenCalledWith('colombia');
    });
  });

  it('calls updateThresholds when save is clicked', async () => {
    mockUpdateThresholds.mockResolvedValue(defaultThresholds);
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('36')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save thresholds'));

    await waitFor(() => {
      expect(mockUpdateThresholds).toHaveBeenCalledWith('colombia', defaultThresholds);
    });
  });

  it('calls resetThresholds when reset is clicked', async () => {
    mockResetThresholds.mockResolvedValue(defaultThresholds);
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('36')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset defaults'));

    await waitFor(() => {
      expect(mockResetThresholds).toHaveBeenCalledWith('colombia');
    });
  });

  it('shows success message after saving', async () => {
    mockUpdateThresholds.mockResolvedValue(defaultThresholds);
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('36')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save thresholds'));

    await waitFor(() => {
      expect(screen.getByText('Seuils mis à jour avec succès.')).toBeInTheDocument();
    });
  });

  it('shows error message when save fails', async () => {
    mockUpdateThresholds.mockRejectedValue(new Error('Invalid thresholds'));
    render(<ThresholdSettings country="colombia" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('36')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save thresholds'));

    await waitFor(() => {
      expect(screen.getByText('Invalid thresholds')).toBeInTheDocument();
    });
  });
});
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

describe('Dashboard error handling', () => {
  it('renders loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
  });
});
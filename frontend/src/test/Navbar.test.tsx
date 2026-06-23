import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';

const countries = [
  { code: 'brazil', name: 'Brazil', status: 'available', serviceUrl: 'http://localhost:3001' },
  { code: 'ecuador', name: 'Ecuador', status: 'available', serviceUrl: 'http://localhost:3011' },
  { code: 'colombia', name: 'Colombia', status: 'available', serviceUrl: 'http://localhost:3012' },
];

describe('Navbar (CountrySelector)', () => {
  it('renders all countries in the select dropdown', () => {
    render(
      <Navbar
        activeSection="dashboard"
        onNavigate={() => {}}
        countries={countries}
        selectedCountry="brazil"
        onCountryChange={() => {}}
        serviceOnline={true}
      />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Brazil');
    expect(options[1]).toHaveTextContent('Ecuador');
    expect(options[2]).toHaveTextContent('Colombia');
  });

  it('shows the currently selected country', () => {
    render(
      <Navbar
        activeSection="dashboard"
        onNavigate={() => {}}
        countries={countries}
        selectedCountry="colombia"
        onCountryChange={() => {}}
        serviceOnline={true}
      />,
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('colombia');
  });

  it('calls onCountryChange when a different country is selected', () => {
    const onCountryChange = vi.fn();

    render(
      <Navbar
        activeSection="dashboard"
        onNavigate={() => {}}
        countries={countries}
        selectedCountry="brazil"
        onCountryChange={onCountryChange}
        serviceOnline={true}
      />,
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'ecuador' } });

    expect(onCountryChange).toHaveBeenCalledWith('ecuador');
  });

  it('displays online status indicator when service is online', () => {
    render(
      <Navbar
        activeSection="dashboard"
        onNavigate={() => {}}
        countries={countries}
        selectedCountry="brazil"
        onCountryChange={() => {}}
        serviceOnline={true}
      />,
    );

    expect(screen.getByText('En ligne')).toBeInTheDocument();
  });

  it('displays offline status indicator when service is offline', () => {
    render(
      <Navbar
        activeSection="dashboard"
        onNavigate={() => {}}
        countries={countries}
        selectedCountry="brazil"
        onCountryChange={() => {}}
        serviceOnline={false}
      />,
    );

    expect(screen.getByText('Hors ligne')).toBeInTheDocument();
  });
});
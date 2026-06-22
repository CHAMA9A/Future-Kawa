import { type Country } from '../types';

interface Props {
  countries: Country[];
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export default function CountrySelector({ countries, selected, onChange, disabled }: Props) {
  return (
    <div className="country-selector">
      <label htmlFor="country-select">Sélectionner un pays</label>
      <select
        id="country-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} {c.status !== 'online' ? '(hors ligne)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
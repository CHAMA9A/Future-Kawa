import type { Lot } from '../types';
import { formatDate, statusBadge } from '../utils';

interface Props {
  lots: Lot[];
}

export default function LotsTable({ lots }: Props) {
  if (lots.length === 0) {
    return <div className="table-empty">Aucune donnée disponible pour ce pays.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code lot</th>
            <th>Pays</th>
            <th>Entrepôt</th>
            <th>Date stockage</th>
            <th>Statut</th>
            <th>Créé le</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.id}>
              <td>{lot.id}</td>
              <td className="lot-code">{lot.lotCode}</td>
              <td>{lot.country}</td>
              <td>{lot.warehouseName}</td>
              <td>{formatDate(lot.storageDate)}</td>
              <td>{statusBadge(lot.status)}</td>
              <td>{formatDate(lot.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
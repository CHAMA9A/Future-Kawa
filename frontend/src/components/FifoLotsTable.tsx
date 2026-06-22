import type { Lot } from '../types';
import { formatDate, statusBadge } from '../utils';

interface Props {
  lots: Lot[];
}

export default function FifoLotsTable({ lots }: Props) {
  if (lots.length === 0) {
    return <div className="table-empty">Aucun lot FIFO</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Code lot</th>
            <th>Date stockage</th>
            <th>Entrepôt</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot, i) => (
            <tr key={`${lot.lotCode}-${i}`}>
              <td className="lot-code">{lot.lotCode}</td>
              <td>{formatDate(lot.storageDate)}</td>
              <td>{lot.warehouseName}</td>
              <td>{statusBadge(lot.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
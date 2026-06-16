import type {
  MedicationCatalogItem,
  MedicationInventoryItem,
} from "../types/medication";

export type DashboardTarget =
  | "caducados"
  | "30"
  | "60"
  | "90"
  | "inventario"
  | "catalogo";

interface Props {
  catalog: MedicationCatalogItem[];
  inventory: MedicationInventoryItem[];
  onDashboardClick?: (target: DashboardTarget) => void;
}

function getDaysUntilExpiration(expirationDate: string): number {
  const today = new Date();
  const expiration = new Date(expirationDate);

  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function SummaryCards({
  catalog,
  inventory,
  onDashboardClick,
}: Props) {
  const activeInventory = inventory.filter((item) => item.status === "active");

  const expired = activeInventory.filter(
    (item) => getDaysUntilExpiration(item.expirationDate) < 0
  ).length;

  const expiring30 = activeInventory.filter((item) => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days >= 0 && days <= 30;
  }).length;

  const expiring60 = activeInventory.filter((item) => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days > 30 && days <= 60;
  }).length;

  const expiring90 = activeInventory.filter((item) => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days > 60 && days <= 90;
  }).length;

  return (
    <div className="space-y-3">
      {(expired > 0 || expiring30 > 0) && (
        <button
          onClick={() => onDashboardClick?.("caducados")}
          className="w-full text-left bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm"
        >
          <p className="font-semibold text-red-700">🚨 Revisión necesaria</p>
          <p className="text-sm text-red-600">
            {expired > 0 && `${expired} caducado(s). `}
            {expiring30 > 0 && `${expiring30} caduca(n) en 30 días.`}
          </p>
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onDashboardClick?.("caducados")}
          className="bg-white rounded-xl shadow p-4 text-left"
        >
          <p className="text-sm text-gray-500">Caducados</p>
          <p className="text-2xl font-bold text-red-600">{expired}</p>
        </button>

        <button
          onClick={() => onDashboardClick?.("30")}
          className="bg-white rounded-xl shadow p-4 text-left"
        >
          <p className="text-sm text-gray-500">30 días</p>
          <p className="text-2xl font-bold text-orange-600">{expiring30}</p>
        </button>

        <button
          onClick={() => onDashboardClick?.("60")}
          className="bg-white rounded-xl shadow p-4 text-left"
        >
          <p className="text-sm text-gray-500">60 días</p>
          <p className="text-2xl font-bold text-yellow-600">{expiring60}</p>
        </button>

        <button
          onClick={() => onDashboardClick?.("inventario")}
          className="bg-white rounded-xl shadow p-4 text-left"
        >
          <p className="text-sm text-gray-500">Existencias</p>
          <p className="text-2xl font-bold">{activeInventory.length}</p>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onDashboardClick?.("90")}
          className="bg-white rounded-xl shadow p-4 text-left"
        >
          <p className="text-sm text-gray-500">90 días</p>
          <p className="text-2xl font-bold text-amber-600">{expiring90}</p>
        </button>

        <button
          onClick={() => onDashboardClick?.("catalogo")}
          className="bg-white rounded-xl shadow p-4 text-left"
        >
          <p className="text-sm text-gray-500">Catálogo</p>
          <p className="text-2xl font-bold">{catalog.length}</p>
        </button>
      </div>
    </div>
  );
}
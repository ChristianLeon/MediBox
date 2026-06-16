import { useState } from "react";

import type {
  MedicationCatalogItem,
  MedicationInventoryItem,
} from "../types/medication";

import {
  getMedicationStatus,
  getMedicationStatusBadgeClass,
  getMedicationStatusLabel,
} from "../utils/medicationStatus";

interface Props {
  catalog: MedicationCatalogItem[];
  inventory: MedicationInventoryItem[];
  onRemoveInventory: (inventoryId: string) => void;
  onEditInventory: (inventoryId: string) => void;
}

function getDaysUntilExpiration(expirationDate: string): number | null {
  if (!expirationDate) return null;

  const today = new Date();
  const expiration = new Date(expirationDate);

  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function MedicationList({
  catalog,
  inventory,
  onRemoveInventory,
  onEditInventory,
}: Props) {
  const [search, setSearch] = useState("");

  const activeInventory = inventory
    .filter((item) => item.status === "active")
    .filter((item) => {
      const medication = catalog.find((m) => m.id === item.catalogId);
      if (!medication) return false;

      const value = search.toLowerCase();

    return (
  medication.name.toLowerCase().includes(value) ||
  medication.activeIngredient.toLowerCase().includes(value) ||
  (medication.strength ?? "").toLowerCase().includes(value) ||
  medication.purpose.toLowerCase().includes(value) ||
  item.location.toLowerCase().includes(value)
);
    })
    .sort(
      (a, b) =>
        new Date(a.expirationDate).getTime() -
        new Date(b.expirationDate).getTime()
    );

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Inventario activo</h2>
        <p className="text-sm text-gray-500">
          Busca por medicamento, uso o ubicación.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar medicamento..."
        className="w-full border rounded-xl p-3 bg-white shadow-sm"
      />

      {activeInventory.length === 0 && (
        <div className="bg-white rounded-xl shadow p-4 text-gray-500">
          No hay medicamentos que coincidan con la búsqueda.
        </div>
      )}

      {activeInventory.map((item) => {
        const medication = catalog.find((m) => m.id === item.catalogId);

        if (!medication) return null;

        const status = getMedicationStatus(item.expirationDate);
        const daysLeft = getDaysUntilExpiration(item.expirationDate);

        return (
          <div key={item.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-semibold text-lg">
  {medication.name}
  {medication.strength ? ` (${medication.strength})` : ""}
</h3>

                <p className="text-sm text-gray-600">
                  {medication.purpose ||
                    "Uso pendiente de completar en catálogo"}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${getMedicationStatusBadgeClass(
                  status
                )}`}
              >
                {getMedicationStatusLabel(status)}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Existencias:</strong> {item.quantity}
              </p>

              <p>
                <strong>Ubicación:</strong> {item.location}
              </p>

              <p>
                <strong>Caducidad:</strong> {item.expirationDate || "Sin fecha"}
              </p>

              <p>
                <strong>Días:</strong>{" "}
                {daysLeft === null
                  ? "Sin dato"
                  : daysLeft < 0
                  ? `Caducó hace ${Math.abs(daysLeft)} días`
                  : daysLeft === 0
                  ? "Caduca hoy"
                  : `${daysLeft} días`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => onEditInventory(item.id)}
                className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg"
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => onRemoveInventory(item.id)}
                className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg"
              >
                🗑️ Depurar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
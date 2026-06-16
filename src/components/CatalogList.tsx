import { useMemo, useState } from "react";

import type {
  MedicationCatalogItem,
  MedicationInventoryItem,
} from "../types/medication";

import CatalogDetailModal from "./CatalogDetailModal";

interface Props {
  catalog: MedicationCatalogItem[];
  inventory: MedicationInventoryItem[];
  onEditCatalog: (catalogId: string) => void;
}

export default function CatalogList({
  catalog,
  inventory,
  onEditCatalog,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    null
  );

  const filteredCatalog = useMemo(() => {
  const value = search.toLowerCase();

  return [...catalog]
    .filter((item) => {
      return (
        item.name.toLowerCase().includes(value) ||
        item.purpose.toLowerCase().includes(value) ||
        item.activeIngredient.toLowerCase().includes(value)
      );
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, "es", {
        sensitivity: "base",
      })
    );
}, [catalog, search]);

  const getActiveInventory = (catalogId: string) => {
    return inventory.filter(
      (item) => item.catalogId === catalogId && item.status === "active"
    );
  };

  const getNextExpiration = (catalogId: string): string | null => {
    const activeItems = getActiveInventory(catalogId);

    if (activeItems.length === 0) return null;

    const sorted = [...activeItems].sort(
      (a, b) =>
        new Date(a.expirationDate).getTime() -
        new Date(b.expirationDate).getTime()
    );

    return sorted[0].expirationDate;
  };

  const selectedCatalogItem =
    selectedCatalogId === null
      ? null
      : catalog.find((item) => item.id === selectedCatalogId) || null;

  const handleEditFromDetail = (catalogId: string) => {
    setSelectedCatalogId(null);
    onEditCatalog(catalogId);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold">Catálogo</h2>

        <p className="text-sm text-gray-500">
          Todos los medicamentos registrados.
        </p>

        <input
          type="text"
          placeholder="Buscar medicamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mt-3"
        />
      </div>

      {filteredCatalog.map((item) => {
        const activeInventory = getActiveInventory(item.id);
        const nextExpiration = getNextExpiration(item.id);

        return (
          <button
            key={item.id}
            onClick={() => setSelectedCatalogId(item.id)}
            className="w-full text-left bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-semibold text-lg">💊 {item.name}</h3>

                <p className="text-sm text-gray-600 mt-1">
                  {item.purpose || "Uso pendiente de completar"}
                </p>
              </div>

              <span className="text-gray-400">›</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Existencias</p>
                <p className="font-semibold">{activeInventory.length}</p>
              </div>

              <div>
                <p className="text-gray-500">Próxima caducidad</p>
                <p className="font-semibold">
                  {nextExpiration ?? "Sin inventario"}
                </p>
              </div>
            </div>
          </button>
        );
      })}

      {filteredCatalog.length === 0 && (
        <div className="bg-white rounded-xl shadow p-4 text-center text-gray-500">
          No se encontraron medicamentos.
        </div>
      )}

      {selectedCatalogItem && (
        <CatalogDetailModal
          catalogItem={selectedCatalogItem}
          inventory={inventory}
          onClose={() => setSelectedCatalogId(null)}
          onEditCatalog={handleEditFromDetail}
        />
      )}
    </div>
  );
}
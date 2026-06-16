import type {
  MedicationCatalogItem,
  MedicationInventoryItem,
} from "../types/medication";

interface Props {
  catalogItem: MedicationCatalogItem;
  inventory: MedicationInventoryItem[];
  onClose: () => void;
  onEditCatalog: (catalogId: string) => void;
}

export default function CatalogDetailModal({
  catalogItem,
  inventory,
  onClose,
  onEditCatalog,
}: Props) {
  const activeInventory = inventory
    .filter((item) => item.catalogId === catalogItem.id && item.status === "active")
    .sort(
      (a, b) =>
        new Date(a.expirationDate).getTime() -
        new Date(b.expirationDate).getTime()
    );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl p-4 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-2xl font-bold">💊 {catalogItem.name}</h2>
            <p className="text-sm text-gray-500">Detalle del medicamento</p>
          </div>

          <button onClick={onClose} className="text-gray-500 text-2xl">
            ×
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500">Sustancia activa</p>
            <p className="font-medium">
              {catalogItem.activeIngredient || "Pendiente de completar"}
            </p>
          </div>
<div>
  <p className="text-sm text-gray-500">Concentración</p>
  <p className="font-medium">
    {catalogItem.strength || "Pendiente de completar"}
  </p>
</div>
          <div>
            <p className="text-sm text-gray-500">¿Para qué sirve?</p>
            <p className="font-medium">
              {catalogItem.purpose || "Pendiente de completar"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Presentación</p>
            <p className="font-medium">
              {catalogItem.presentation || "Pendiente de completar"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Notas</p>
            <p className="font-medium">{catalogItem.notes || "Sin notas"}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Existencias activas</h3>

          {activeInventory.length === 0 ? (
            <div className="mt-2 bg-slate-50 rounded-xl p-4 text-gray-500">
              No hay existencias activas en el botiquín.
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {activeInventory.map((item) => (
                <div key={item.id} className="border rounded-xl p-3 text-sm">
                  <p>
                    <strong>Existencias:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {item.location}
                  </p>
                  <p>
                    <strong>Caducidad:</strong> {item.expirationDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 py-2 rounded-lg"
          >
            Cerrar
          </button>

          <button
            onClick={() => onEditCatalog(catalogItem.id)}
            className="bg-blue-600 text-white py-2 rounded-lg"
          >
            Editar catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
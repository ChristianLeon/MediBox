import { useState } from "react";

import type {
  MedicationCatalogItem,
  MedicationInventoryItem,
} from "../types/medication";

interface Props {
  inventoryItem: MedicationInventoryItem;
  catalogItem: MedicationCatalogItem;
  onClose: () => void;
  onSave: (
    inventoryId: string,
    quantity: number,
    location: string,
    expirationDate: string
  ) => void;
}

export default function EditInventoryModal({
  inventoryItem,
  catalogItem,
  onClose,
  onSave,
}: Props) {
  const [quantity, setQuantity] = useState(inventoryItem.quantity);
  const [location, setLocation] = useState(inventoryItem.location);
  const [expirationDate, setExpirationDate] = useState(
    inventoryItem.expirationDate
  );

  const handleSave = () => {
    onSave(inventoryItem.id, quantity, location, expirationDate);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Editar existencia</h2>
            <p className="text-sm text-gray-500">{catalogItem.name}</p>
          </div>

          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Existencias</label>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option>Baño</option>
            <option>Recámara principal</option>
            <option>Cocina</option>
            <option>Mochila</option>
            <option>Coche</option>
            <option>Oficina</option>
            <option>Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha de caducidad
          </label>

          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 py-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 rounded-lg"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
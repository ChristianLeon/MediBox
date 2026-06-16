import { useMemo, useRef, useState } from "react";
import type { MedicationCatalogItem } from "../types/medication";

interface Props {
  catalog: MedicationCatalogItem[];
  onAddMedication: (
    name: string,
    purpose: string,
    expirationDate: string,
    quantity: number,
    location: string,
    strength: string
  ) => void;
}

export default function MedicationForm({ catalog, onAddMedication }: Props) {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("Baño");
  const [strength, setStrength] = useState("");
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    null
  );

  const nameInputRef = useRef<HTMLInputElement>(null);
  const normalizedName = name.trim().toLowerCase();

  const exactMatch = catalog.find(
    (item) => item.name.toLowerCase() === normalizedName
  );

  const suggestions = useMemo(() => {
    if (name.trim().length < 2) return [];

    return catalog
      .filter((item) => item.name.toLowerCase().includes(normalizedName))
      .slice(0, 5);
  }, [catalog, name, normalizedName]);

  const selectedCatalog = catalog.find((item) => item.id === selectedCatalogId);

  const clearForm = () => {
    setName("");
    setStrength("");
    setExpirationDate("");
    setQuantity(1);
    setSelectedCatalogId(null);

    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  const handleSelectSuggestion = (item: MedicationCatalogItem) => {
    setName(item.name);
    setStrength(item.strength ?? "");
    setSelectedCatalogId(item.id);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    onAddMedication(
      name.trim(),
      "",
      expirationDate,
      quantity,
      location,
      strength.trim()
    );

    clearForm();
  };

  const isExistingMedication = Boolean(exactMatch || selectedCatalog);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Agregar medicamento</h2>
        <p className="text-sm text-gray-500">
          Busca en tu catálogo o crea uno nuevo automáticamente.
        </p>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium mb-1">
          Nombre del medicamento *
        </label>

        <input
          ref={nameInputRef}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSelectedCatalogId(null);
          }}
          placeholder="Ej. Paracetamol"
          className="w-full border rounded-lg p-3"
        />

        {suggestions.length > 0 && !exactMatch && !selectedCatalog && (
          <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">💊</span>

                  <div>
                    <p className="font-medium">
                      {item.name}
                      {item.strength ? ` (${item.strength})` : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.purpose || "Uso pendiente de completar"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {name.trim().length >= 2 && (
          <div
            className={`mt-2 text-sm rounded-lg px-3 py-2 ${
              isExistingMedication
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {isExistingMedication
              ? "✓ Medicamento encontrado en catálogo. Se agregará una nueva existencia."
              : "➕ Medicamento nuevo. Se creará en catálogo automáticamente."}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Concentración
        </label>

        <input
          type="text"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
          placeholder="Ej. 500 mg, 600 mg, 120 mg/5 mL"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Fecha de caducidad *
        </label>

        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Existencias</label>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ubicación</label>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-lg p-3"
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

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
      >
        Agregar al inventario
      </button>
    </div>
  );
}
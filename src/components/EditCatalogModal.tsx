import { useState } from "react";

import type { MedicationCatalogItem } from "../types/medication"; 
import { medicationKnowledgeBase } from "../data/medicationKnowledgeBase";

interface Props {
  catalogItem: MedicationCatalogItem;
  onClose: () => void;
  onSave: (
    catalogId: string,
    name: string,
    activeIngredient: string,
    purpose: string,
    presentation: string,
    notes: string
  ) => void;
}

function findMedicationKnowledge(name: string) {
  const normalized = name.trim().toLowerCase();

  return medicationKnowledgeBase.find((item) =>
    item.names.some((alias) => alias.toLowerCase() === normalized)
  );
}

export default function EditCatalogModal({
  catalogItem,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(catalogItem.name);
  const [activeIngredient, setActiveIngredient] = useState(
    catalogItem.activeIngredient
  );
  const [purpose, setPurpose] = useState(catalogItem.purpose);
  const [presentation, setPresentation] = useState(catalogItem.presentation);
  const [notes, setNotes] = useState(catalogItem.notes);
  const [message, setMessage] = useState("");

  const handleSearchInfo = () => {
    const knowledge = findMedicationKnowledge(name);

    if (!knowledge) {
      setMessage(
        "No encontré este medicamento en la base local. Puedes agregar la información manualmente."
      );
      return;
    }

    setActiveIngredient(knowledge.activeIngredient);
    setPurpose(knowledge.purpose);
    setPresentation(knowledge.presentation);
    setNotes(knowledge.notes);
    setMessage("Información encontrada. Revisa y guarda si es correcta.");
  };

  const handleSave = () => {
    if (!name.trim()) return;

    onSave(
      catalogItem.id,
      name.trim(),
      activeIngredient.trim(),
      purpose.trim(),
      presentation.trim(),
      notes.trim()
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Editar medicamento</h2>
            <p className="text-sm text-gray-500">Información del catálogo</p>
          </div>

          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        <button
          onClick={handleSearchInfo}
          className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded-lg font-medium"
        >
          🔎 Buscar información
        </button>

        {message && (
          <div className="text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-3">
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del medicamento
          </label>

          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("");
            }}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sustancia activa
          </label>

          <input
            value={activeIngredient}
            onChange={(e) => setActiveIngredient(e.target.value)}
            placeholder="Ej. Paracetamol"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ¿Para qué sirve?
          </label>

          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Ej. Dolor y fiebre"
            className="w-full border rounded-lg p-2 min-h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Presentación</label>

          <input
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
            placeholder="Ej. Tabletas, jarabe, crema"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notas</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas personales"
            className="w-full border rounded-lg p-2 min-h-20"
          />
        </div>

        <div className="text-xs text-gray-500 bg-slate-50 rounded-lg p-3">
          Información orientativa. No sustituye indicación médica ni diagnóstico
          profesional.
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
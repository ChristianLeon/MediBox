import { useEffect, useState } from "react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import type { DashboardTarget } from "./components/SummaryCards";
import MedicationForm from "./components/MedicationForm";
import MedicationList from "./components/MedicationList";
import BottomNav from "./components/BottomNav";
import EditInventoryModal from "./components/EditInventoryModal";
import EditCatalogModal from "./components/EditCatalogModal";
import CatalogList from "./components/CatalogList";

import type {
  MedicationCatalogItem,
  MedicationData,
  MedicationInventoryItem,
} from "./types/medication";

import { initialMedications } from "./data/initialMedications";
import { medicationKnowledgeBase } from "./data/medicationKnowledgeBase";

const STORAGE_KEY = "medicasa-data";

type Tab = "inventario" | "agregar" | "alertas" | "catalogo";
type AlertSection = "caducados" | "30" | "60" | "90";

function getInitialData(): MedicationData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialMedications;

    const parsed = JSON.parse(saved);

    if (!parsed.catalog || !parsed.inventory) {
      return initialMedications;
    }
<div className="bg-red-500 text-white p-10 text-4xl">
  TEST TAILWIND
</div>
    return parsed;
  } catch {
    return initialMedications;
  }
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

function findMedicationKnowledge(name: string) {
  const normalized = name.trim().toLowerCase();

  return medicationKnowledgeBase.find((item) =>
    item.names.some((alias) => alias.toLowerCase() === normalized)
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("inventario");
  const [activeAlertSection, setActiveAlertSection] =
    useState<AlertSection | null>(null);

  const [data, setData] = useState<MedicationData>(getInitialData);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(
    null
  );
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleDashboardClick = (target: DashboardTarget) => {
    if (target === "inventario") {
      setActiveTab("inventario");
      return;
    }

    if (target === "catalogo") {
      setActiveTab("catalogo");
      return;
    }

    setActiveAlertSection(target);
    setActiveTab("alertas");
  };

  const addMedication = (
  name: string,
  purpose: string,
  expirationDate: string,
  quantity: number,
  location: string,
  strength: string
) => {
    const now = new Date().toISOString();

    let catalogItem = data.catalog.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (!catalogItem) {
      const knowledge = findMedicationKnowledge(name);

     catalogItem = {
  id: crypto.randomUUID(),
  name,
  activeIngredient: knowledge?.activeIngredient ?? "",
  strength: strength || knowledge?.strength || "",
  purpose: knowledge?.purpose ?? purpose,
  presentation: knowledge?.presentation ?? "",
  notes: knowledge?.notes ?? "",
  createdAt: now,
  updatedAt: now,
} satisfies MedicationCatalogItem;
    }

    const inventoryItem: MedicationInventoryItem = {
      id: crypto.randomUUID(),
      catalogId: catalogItem.id,
      quantity,
      location,
      expirationDate,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    setData((prev) => ({
      catalog: prev.catalog.some((c) => c.id === catalogItem!.id)
        ? prev.catalog
        : [...prev.catalog, catalogItem!],
      inventory: [inventoryItem, ...prev.inventory],
    }));

    setActiveTab("inventario");
  };

  const removeInventory = (inventoryId: string) => {
    setData((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === inventoryId
          ? {
              ...item,
              status: "removed",
              removedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    }));
  };

  const updateInventory = (
    inventoryId: string,
    quantity: number,
    location: string,
    expirationDate: string
  ) => {
    setData((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === inventoryId
          ? {
              ...item,
              quantity,
              location,
              expirationDate,
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    }));

    setEditingInventoryId(null);
  };

  const updateCatalog = (
    catalogId: string,
    name: string,
    activeIngredient: string,
    purpose: string,
    presentation: string,
    notes: string
  ) => {
    setData((prev) => ({
      ...prev,
      catalog: prev.catalog.map((item) =>
        item.id === catalogId
          ? {
              ...item,
              name,
              activeIngredient,
              purpose,
              presentation,
              notes,
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    }));

    setEditingCatalogId(null);
  };

  const activeInventory = data.inventory.filter(
    (item) => item.status === "active"
  );

  const expiredInventory = activeInventory.filter(
    (item) => getDaysUntilExpiration(item.expirationDate) < 0
  );

  const expiring30Inventory = activeInventory.filter((item) => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days >= 0 && days <= 30;
  });

  const expiring60Inventory = activeInventory.filter((item) => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days > 30 && days <= 60;
  });

  const expiring90Inventory = activeInventory.filter((item) => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days > 60 && days <= 90;
  });

  const renderMedicationName = (catalogId: string) => {
    return (
      data.catalog.find((item) => item.id === catalogId)?.name ||
      "Medicamento sin catálogo"
    );
  };

  const renderAlertItem = (
    item: MedicationInventoryItem,
    showButton = false
  ) => (
    <div key={item.id} className="bg-white rounded-lg p-3">
      <p className="font-semibold">{renderMedicationName(item.catalogId)}</p>
      <p className="text-sm text-gray-600">Caducidad: {item.expirationDate}</p>
      <p className="text-sm text-gray-600">Ubicación: {item.location}</p>

      {showButton && (
        <button
          onClick={() => removeInventory(item.id)}
          className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg"
        >
          Depurar
        </button>
      )}
    </div>
  );

  const renderAlertSection = (
    id: AlertSection,
    title: string,
    description: string,
    items: MedicationInventoryItem[],
    colorClass: string,
    emptyClass: string,
    showButton = false
  ) => {
    if (activeAlertSection && activeAlertSection !== id) {
      return null;
    }

    return (
      <div className={`${colorClass} rounded-xl p-4`}>
        <h3 className="font-semibold">
          {title} ({items.length})
        </h3>

        <div className="mt-3 space-y-2">
          {items.length === 0 ? (
            <p className={`text-sm ${emptyClass}`}>{description}</p>
          ) : (
            items.map((item) => renderAlertItem(item, showButton))
          )}
        </div>
      </div>
    );
  };

  const editingInventoryItem =
    editingInventoryId === null
      ? null
      : data.inventory.find((item) => item.id === editingInventoryId) || null;

  const editingInventoryCatalogItem =
    editingInventoryItem === null
      ? null
      : data.catalog.find(
          (item) => item.id === editingInventoryItem.catalogId
        ) || null;

  const editingCatalogItem =
    editingCatalogId === null
      ? null
      : data.catalog.find((item) => item.id === editingCatalogId) || null;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <Header />

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <SummaryCards
          catalog={data.catalog}
          inventory={data.inventory}
          onDashboardClick={handleDashboardClick}
        />

        {activeTab === "inventario" && (
          <MedicationList
            catalog={data.catalog}
            inventory={data.inventory}
            onRemoveInventory={removeInventory}
            onEditInventory={setEditingInventoryId}
          />
        )}

        {activeTab === "agregar" && (
          <MedicationForm
            catalog={data.catalog}
            onAddMedication={addMedication}
          />
        )}

        {activeTab === "alertas" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Alertas</h2>
                  <p className="text-sm text-gray-500">
                    Medicamentos caducados o próximos a caducar.
                  </p>
                </div>

                {activeAlertSection && (
                  <button
                    onClick={() => setActiveAlertSection(null)}
                    className="text-sm text-blue-600 font-medium"
                  >
                    Ver todas
                  </button>
                )}
              </div>
            </div>

            {renderAlertSection(
              "caducados",
              "Caducados",
              "No tienes medicamentos caducados.",
              expiredInventory,
              "bg-red-50 border border-red-200 text-red-700",
              "text-red-600",
              true
            )}

            {renderAlertSection(
              "30",
              "Caducan en 30 días",
              "No tienes medicamentos que caduquen en los próximos 30 días.",
              expiring30Inventory,
              "bg-orange-50 border border-orange-200 text-orange-700",
              "text-orange-600"
            )}

            {renderAlertSection(
              "60",
              "Caducan entre 31 y 60 días",
              "No tienes medicamentos que caduquen entre 31 y 60 días.",
              expiring60Inventory,
              "bg-yellow-50 border border-yellow-200 text-yellow-700",
              "text-yellow-600"
            )}

            {renderAlertSection(
              "90",
              "Caducan entre 61 y 90 días",
              "No tienes medicamentos que caduquen entre 61 y 90 días.",
              expiring90Inventory,
              "bg-amber-50 border border-amber-200 text-amber-700",
              "text-amber-600"
            )}
          </div>
        )}

        {activeTab === "catalogo" && (
          <CatalogList
            catalog={data.catalog}
            inventory={data.inventory}
            onEditCatalog={setEditingCatalogId}
          />
        )}
      </div>

      {editingInventoryItem && editingInventoryCatalogItem && (
        <EditInventoryModal
          inventoryItem={editingInventoryItem}
          catalogItem={editingInventoryCatalogItem}
          onClose={() => setEditingInventoryId(null)}
          onSave={updateInventory}
        />
      )}

      {editingCatalogItem && (
        <EditCatalogModal
          catalogItem={editingCatalogItem}
          onClose={() => setEditingCatalogId(null)}
          onSave={updateCatalog}
        />
      )}

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export default App;
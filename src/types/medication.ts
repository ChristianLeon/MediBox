export interface MedicationCatalogItem {
  id: string;
  name: string;
  activeIngredient: string;
  purpose: string;
  presentation: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationCatalogItem {
  id: string;
  name: string;
  activeIngredient: string;
  strength: string; // NUEVO
  purpose: string;
  presentation: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}


export interface MedicationData {
  catalog: MedicationCatalogItem[];
  inventory: MedicationInventoryItem[];
}
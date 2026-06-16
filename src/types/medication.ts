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

export interface MedicationInventoryItem {
  id: string;
  catalogId: string;
  quantity: number;
  location: string;
  expirationDate: string;
  status: "active" | "removed";
  removedAt?: string;
  removalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationData {
  catalog: MedicationCatalogItem[];
  inventory: MedicationInventoryItem[];
}
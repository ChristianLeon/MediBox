import type { MedicationData } from "../types/medication";

const now = new Date().toISOString();

export const initialMedications: MedicationData = {
  catalog: [
    {
      id: "cat-1",
      name: "Paracetamol",
      activeIngredient: "Paracetamol / Acetaminofén",
      purpose: "Uso común: dolor y fiebre.",
      presentation: "Tabletas, cápsulas, suspensión o gotas.",
      notes: "Información orientativa. No sustituye indicación médica.",
      createdAt: now,
      updatedAt: now,
    },
  ],
  inventory: [
    {
      id: "inv-1",
      catalogId: "cat-1",
      quantity: 1,
      location: "Baño",
      expirationDate: "2027-01-01",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
};
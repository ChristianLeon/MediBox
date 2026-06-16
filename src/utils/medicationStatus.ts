export type MedicationExpirationStatus = "vigente" | "por_caducar" | "caducado";

export function getMedicationStatus(
  expirationDate: string
): MedicationExpirationStatus {
  if (!expirationDate) return "vigente";

  const today = new Date();
  const expiration = new Date(expirationDate);

  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "caducado";
  if (diffDays <= 90) return "por_caducar";

  return "vigente";
}

export function getMedicationStatusLabel(status: MedicationExpirationStatus) {
  switch (status) {
    case "vigente":
      return "Vigente";
    case "por_caducar":
      return "Por caducar";
    case "caducado":
      return "Caducado";
  }
}

export function getMedicationStatusBadgeClass(status: MedicationExpirationStatus) {
  switch (status) {
    case "vigente":
      return "bg-green-100 text-green-700 border border-green-200";
    case "por_caducar":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "caducado":
      return "bg-red-100 text-red-700 border border-red-200";
  }
}
// features/data-entry/data-entry.utils.ts
import type {
  AvailableServiceDto,
  CreateServiceJobPayload,
  ServiceJobDraft,
} from "./data-entry.types";

export const normalizePlate = (plate: string) => plate.trim().toUpperCase();

export const normalizePhone = (phone: string) => phone.replace(/[\s-]/g, "");

export const newKey = () => Math.random().toString(36).slice(2, 10);

export function todayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates total estimated cost from basePrice of selected services.
 * Returns null if any selected service does not have a basePrice provided.
 */
export function estimateCost(
  draft: ServiceJobDraft,
  services: AvailableServiceDto[] = []
): number | null {
  const selected = services.filter((s) => draft.services[s.id]);
  if (selected.length === 0) return 0;
  if (selected.some((s) => s.basePrice === null)) return null;
  return selected.reduce((sum, s) => sum + Number(s.basePrice), 0);
}

/**
 * Checks if any selected service that requires part selection has missing brand picks.
 */
export function hasMissingPartSelections(
  draft: ServiceJobDraft,
  services: AvailableServiceDto[] = []
): boolean {
  return services.some(
    (s) =>
      draft.services[s.id] &&
      s.requiresPartSelection &&
      s.components.some((c) => !draft.services[s.id].partIdsByComponent[c.id])
  );
}

export type DraftErrors = Partial<
  Record<
    | "plate"
    | "vehicleType"
    | "name"
    | "phones"
    | "date"
    | "meterReading"
    | "package"
    | "services"
    | "parts"
    | "price",
    string
  >
>;

/**
 * Validates the draft before sending to backend.
 */
export function validateDraft(
  draft: ServiceJobDraft,
  services: AvailableServiceDto[] = []
): DraftErrors {
  const errors: DraftErrors = {};

  if (draft.vehicle.numberPlate.length < 2) {
    errors.plate = "Enter a valid number plate";
  }

  if (!draft.vehicle.vehicleTypeId) {
    errors.vehicleType = "Select a vehicle type";
  }

  if (!draft.customer.name.trim()) {
    errors.name = "Enter customer name";
  }

  const validPhones = draft.customer.phones.filter((p) => p.number.trim());
  if (validPhones.length === 0) {
    errors.phones = "Add at least one phone number";
  }

  if (draft.jobDate > todayString()) {
    errors.date = "Date cannot be in the future";
  }

  if (draft.meterReading && draft.nextMeterReading) {
    if (Number(draft.nextMeterReading) <= Number(draft.meterReading)) {
      errors.meterReading = "Next reading must be greater than current reading";
    }
  }

  if (!draft.servicePackageId) {
    errors.package = "Select a service package";
  }

  if (Object.keys(draft.services).length === 0) {
    errors.services = "Select at least one service";
  }

  if (hasMissingPartSelections(draft, services)) {
    errors.parts = "Choose a brand for all required service parts";
  }

  if (
    draft.isPriceEdited &&
    (isNaN(Number(draft.totalCost)) || Number(draft.totalCost) < 0)
  ) {
    errors.price = "Enter a valid total price amount";
  }

  return errors;
}

/**
 * Builds the exact JSON payload expected by POST /service-jobs.
 */
export function buildCreatePayload(
  draft: ServiceJobDraft
): CreateServiceJobPayload {
  return {
    vehicle: {
      id: draft.vehicle.id,
      numberPlate: draft.vehicle.numberPlate,
      vehicleTypeId: draft.vehicle.vehicleTypeId!,
    },
    customer: {
      id: draft.customer.id,
      name: draft.customer.name.trim(),
      phones: draft.customer.phones
        .map((p) => normalizePhone(p.number))
        .filter(Boolean),
    },
    jobDate: draft.jobDate,
    meterReading: draft.meterReading ? Number(draft.meterReading) : undefined,
    nextMeterReading: draft.nextMeterReading
      ? Number(draft.nextMeterReading)
      : undefined,
    servicePackageId: draft.servicePackageId!,
    services: Object.entries(draft.services).map(([serviceId, s]) => ({
      serviceId,
      partIds: Object.values(s.partIdsByComponent),
    })),
    totalCost: draft.isPriceEdited ? Number(draft.totalCost) : undefined,
  };
}

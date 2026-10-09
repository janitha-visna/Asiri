// features/data-entry/data-entry.types.ts

// 1. Fields that have their own modal screen/card:
export type DataEntryModalKey =
  | "vehicleNumber"
  | "telephoneNumber"
  | "date"
  | "totalPrice"
  | "serviceType"
  | "odometerReading";

// 2. All stored values in state (includes subfields like vehicleType, nextOdometerReading):
export type DataEntryFieldKey =
  DataEntryModalKey | "vehicleType" | "nextOdometerReading";

export type DataEntryField = {
  key: DataEntryModalKey;
  label: string;
};

export type DataEntryValues = Partial<Record<DataEntryFieldKey, string>>;

// features/data-entry/data-entry.types.ts

/**
 * All database BIGINT IDs are represented as strings
 * in JavaScript to prevent precision loss.
 */
export type Id = string;

// ============================================================================
// 1. BACKEND API DTOs (Mirrors the Backend Response / Request Shapes)
// ============================================================================

export type VehicleCategoryDto = {
  id: Id;
  name: string;
};

export type VehicleTypeDto = {
  id: Id;
  name: string;
  categoryId: Id;
};

export type PhoneDto = {
  id: Id;
  phoneNumber: string;
  isPrimary: boolean;
};

export type CustomerDto = {
  id: Id;
  name: string;
  phones: PhoneDto[];
};

export type VehicleDto = {
  id: Id;
  numberPlate: string;
  category: VehicleCategoryDto;
  vehicleType: VehicleTypeDto;
  customer: CustomerDto;
};

export type VehicleLookupResponse = {
  exactMatch: VehicleDto | null;
  suggestions: { id: Id; numberPlate: string }[];
};

export type ServicePackageDto = {
  id: Id;
  name: string;
  isActive?: boolean;
};

export type ComponentDto = {
  id: Id;
  name: string;
};

export type AvailableServiceDto = {
  id: Id;
  name: string;
  basePrice: string | null; // NUMERIC from DB comes back as a string
  requiresPartSelection: boolean;
  components: ComponentDto[];
};

export type PartDto = {
  id: Id;
  brand: string;
  partNumber: string;
  name: string;
};

export type CreateServiceJobPayload = {
  vehicle: {
    id: Id | null;
    numberPlate: string;
    vehicleTypeId: Id;
  };
  customer: {
    id: Id | null;
    name: string;
    phones: string[];
  };
  jobDate: string;
  meterReading?: number; // Current odometer reading
  nextMeterReading?: number; // 👈 Added: Next service meter reading due
  servicePackageId: Id;
  services: {
    serviceId: Id;
    partIds: Id[];
  }[];
  totalCost?: number;
};

export type ServiceJobResponse = {
  id: Id;
  calculatedCost: string;
  totalCost: string;
  isPriceOverridden: boolean;
};

// ============================================================================
// 2. FRONTEND DRAFT STATE (The state being edited by the user)
// ============================================================================

export type VehicleMode = "idle" | "registered" | "new";

export type DraftPhone = {
  key: string; // Stable local ID for React list rendering (never uses array index)
  id?: Id; // DB ID (only present for registered customers)
  number: string; // Phone number string
  isPrimary: boolean;
};

export type ServiceJobDraft = {
  vehicle: {
    mode: VehicleMode;
    id: Id | null; // null if vehicle is new
    numberPlate: string; // Normalized uppercase string
    categoryId: Id | null;
    vehicleTypeId: Id | null;
  };
  customer: {
    id: Id | null; // null if customer is new
    name: string;
    phones: DraftPhone[];
  };
  jobDate: string; // "YYYY-MM-DD"
  meterReading: string; // 👈 Current meter reading input (e.g. "45000")
  nextMeterReading: string; // 👈 Next meter reading due input (e.g. "50000")
  servicePackageId: Id | null;
  /**
   * Selected services map:
   * serviceId -> { partIdsByComponent: { componentId: partId } }
   */
  services: Record<
    Id, // serviceId
    {
      partIdsByComponent: Record<Id, Id>; // componentId -> partId
    }
  >;
  totalCost: string; // The price displayed & edited by staff
  isPriceEdited: boolean; // true if staff manually changed the price
};

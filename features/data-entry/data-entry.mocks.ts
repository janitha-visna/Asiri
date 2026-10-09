// features/data-entry/data-entry.mocks.ts
import { ApiError } from "@/lib/api/client";
import type * as T from "./data-entry.types";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// MOCK DATABASE SEED DATA
// ============================================================================

export const MOCK_CATEGORIES: T.VehicleCategoryDto[] = [
  { id: "cat-1", name: "Passenger Cars" },
  { id: "cat-2", name: "SUVs & 4x4" },
  { id: "cat-3", name: "Commercial & Vans" },
  { id: "cat-4", name: "Motorcycles" },
];

export const MOCK_VEHICLE_TYPES: T.VehicleTypeDto[] = [
  // Passenger Cars
  { id: "vt-1", name: "Sedan (e.g. Corolla, Civic)", categoryId: "cat-1" },
  { id: "vt-2", name: "Hatchback (e.g. Swift, Aqua)", categoryId: "cat-1" },
  { id: "vt-3", name: "Luxury Sedan (e.g. Mercedes C, BMW 3)", categoryId: "cat-1" },

  // SUVs
  { id: "vt-4", name: "Compact SUV (e.g. Vezel, Raize)", categoryId: "cat-2" },
  { id: "vt-5", name: "Full-size SUV (e.g. Land Cruiser, Prado)", categoryId: "cat-2" },

  // Vans
  { id: "vt-6", name: "Passenger Van (e.g. KDH, HiAce)", categoryId: "cat-3" },

  // Bikes
  { id: "vt-7", name: "Standard Motorcycle", categoryId: "cat-4" },
];

export const MOCK_SERVICE_PACKAGES: T.ServicePackageDto[] = [
  { id: "pkg-1", name: "Full Service" },
  { id: "pkg-2", name: "Body Wash & Vacuum" },
  { id: "pkg-3", name: "Lubrication & Inspection" },
  { id: "pkg-4", name: "Normal Wash" },
];

export const MOCK_COMPONENTS: Record<string, T.ComponentDto> = {
  engineOil: { id: "comp-1", name: "Engine Oil" },
  oilFilter: { id: "comp-2", name: "Oil Filter" },
  airFilter: { id: "comp-3", name: "Air Filter" },
  cabinFilter: { id: "comp-4", name: "Cabin A/C Filter" },
  coolant: { id: "comp-5", name: "Engine Coolant" },
};

export const MOCK_SERVICES: Record<string, T.AvailableServiceDto[]> = {
  // Keyed by packageId: services offered under each package
  "pkg-1": [
    {
      id: "srv-1",
      name: "Engine Oil & Filter Change",
      basePrice: "4500.00",
      requiresPartSelection: true,
      components: [MOCK_COMPONENTS.engineOil, MOCK_COMPONENTS.oilFilter],
    },
    {
      id: "srv-2",
      name: "Air Filter Replacement",
      basePrice: "1500.00",
      requiresPartSelection: true,
      components: [MOCK_COMPONENTS.airFilter],
    },
    {
      id: "srv-3",
      name: "Cabin A/C Filter Replacement",
      basePrice: "1800.00",
      requiresPartSelection: true,
      components: [MOCK_COMPONENTS.cabinFilter],
    },
    {
      id: "srv-4",
      name: "Complete Undercarriage Wash & Greasing",
      basePrice: "3000.00",
      requiresPartSelection: false,
      components: [],
    },
    {
      id: "srv-5",
      name: "Brake Pad Inspection & Cleaning",
      basePrice: "2500.00",
      requiresPartSelection: false,
      components: [],
    },
  ],
  "pkg-2": [
    {
      id: "srv-6",
      name: "Body Wash with Snow Foam",
      basePrice: "2000.00",
      requiresPartSelection: false,
      components: [],
    },
    {
      id: "srv-7",
      name: "Interior Vacuum & Dashboard Polish",
      basePrice: "1500.00",
      requiresPartSelection: false,
      components: [],
    },
  ],
  "pkg-3": [
    {
      id: "srv-1",
      name: "Engine Oil & Filter Change",
      basePrice: "4500.00",
      requiresPartSelection: true,
      components: [MOCK_COMPONENTS.engineOil, MOCK_COMPONENTS.oilFilter],
    },
    {
      id: "srv-8",
      name: "Coolant Top-up & Flush",
      basePrice: "2200.00",
      requiresPartSelection: true,
      components: [MOCK_COMPONENTS.coolant],
    },
  ],
  "pkg-4": [
    {
      id: "srv-6",
      name: "Body Wash with Snow Foam",
      basePrice: "2000.00",
      requiresPartSelection: false,
      components: [],
    },
  ],
};

export const MOCK_PARTS: Record<string, T.PartDto[]> = {
  // Keyed by componentId: parts compatible with this component
  "comp-1": [
    { id: "part-101", brand: "Mobil 1", partNumber: "M1-5W30", name: "Synthetic 5W-30 (4L)" },
    { id: "part-102", brand: "Castrol", partNumber: "MAG-10W40", name: "Magnatec 10W-40 (4L)" },
    { id: "part-103", brand: "Shell", partNumber: "HX7-5W30", name: "Helix Ultra 5W-30 (4L)" },
    { id: "part-104", brand: "Toyota Genuine", partNumber: "TG-0W20", name: "Motor Oil 0W-20 (4L)" },
  ],
  "comp-2": [
    { id: "part-201", brand: "Vic", partNumber: "C-110", name: "Oil Filter Element" },
    { id: "part-202", brand: "Toyota Genuine", partNumber: "90915-YZZE1", name: "OEM Oil Filter" },
    { id: "part-203", brand: "Bosch", partNumber: "P3300", name: "Premium Oil Filter" },
  ],
  "comp-3": [
    { id: "part-301", brand: "Denso", partNumber: "D-AF102", name: "Air Cleaner Element" },
    { id: "part-302", brand: "Vic", partNumber: "A-198", name: "Air Filter Standard" },
    { id: "part-303", brand: "Sakura", partNumber: "A-3301", name: "Heavy Duty Air Filter" },
  ],
  "comp-4": [
    { id: "part-401", brand: "Bosch", partNumber: "C302", name: "Active Carbon Cabin Filter" },
    { id: "part-402", brand: "Denso", partNumber: "D-CF05", name: "Anti-Bacterial Cabin Filter" },
  ],
  "comp-5": [
    { id: "part-501", brand: "Toyota Genuine", partNumber: "SLLC-50", name: "Super Long Life Coolant (4L)" },
    { id: "part-502", brand: "Castrol", partNumber: "RAD-COOL", name: "Radicool Premix (4L)" },
  ],
};

// Registered seed vehicles for lookup demo
export const MOCK_REGISTERED_VEHICLES: T.VehicleDto[] = [
  {
    id: "veh-1",
    numberPlate: "CB-1234",
    category: MOCK_CATEGORIES[0], // Passenger Cars
    vehicleType: MOCK_VEHICLE_TYPES[0], // Sedan
    customer: {
      id: "cust-1",
      name: "Nimal Perera",
      phones: [
        { id: "ph-1", phoneNumber: "0771234567", isPrimary: true },
        { id: "ph-2", phoneNumber: "0112345678", isPrimary: false },
      ],
    },
  },
  {
    id: "veh-2",
    numberPlate: "WP CAD-5678",
    category: MOCK_CATEGORIES[1], // SUV
    vehicleType: MOCK_VEHICLE_TYPES[3], // Compact SUV
    customer: {
      id: "cust-2",
      name: "Sunil Jayawardena",
      phones: [{ id: "ph-3", phoneNumber: "0719876543", isPrimary: true }],
    },
  },
  {
    id: "veh-3",
    numberPlate: "SP BAA-9012",
    category: MOCK_CATEGORIES[0], // Passenger Cars
    vehicleType: MOCK_VEHICLE_TYPES[1], // Hatchback
    customer: {
      id: "cust-3",
      name: "Kamal Wickramasinghe",
      phones: [{ id: "ph-4", phoneNumber: "0765554433", isPrimary: true }],
    },
  },
];

// ============================================================================
// SIMULATED ENDPOINT HANDLERS
// ============================================================================

export async function lookupVehicles(plate: string): Promise<T.VehicleLookupResponse> {
  await delay(300);
  const normalized = plate.trim().toUpperCase();

  const exactMatch =
    MOCK_REGISTERED_VEHICLES.find((v) => v.numberPlate === normalized) ?? null;

  const suggestions = MOCK_REGISTERED_VEHICLES.filter(
    (v) => v.numberPlate.startsWith(normalized) || v.numberPlate.includes(normalized)
  ).map((v) => ({ id: v.id, numberPlate: v.numberPlate }));

  return { exactMatch, suggestions };
}

export async function getVehicleCategories(): Promise<T.VehicleCategoryDto[]> {
  await delay(200);
  return MOCK_CATEGORIES;
}

export async function getVehicleTypes(categoryId: string): Promise<T.VehicleTypeDto[]> {
  await delay(200);
  return MOCK_VEHICLE_TYPES.filter((vt) => vt.categoryId === categoryId);
}

export async function getServicePackages(): Promise<T.ServicePackageDto[]> {
  await delay(200);
  return MOCK_SERVICE_PACKAGES;
}

export async function getAvailableServices(
  _typeId: string,
  packageId: string
): Promise<T.AvailableServiceDto[]> {
  await delay(300);
  return MOCK_SERVICES[packageId] ?? [];
}

export async function getCompatibleParts(
  _typeId: string,
  componentId: string
): Promise<T.PartDto[]> {
  await delay(250);
  return MOCK_PARTS[componentId] ?? [];
}

export async function createServiceJob(
  payload: T.CreateServiceJobPayload
): Promise<T.ServiceJobResponse> {
  await delay(600);

  // Simulated 409 Conflict test condition:
  // If the user attempts to register "CONFLICT-99" as a new car
  if (payload.vehicle.numberPlate === "CONFLICT-99" && !payload.vehicle.id) {
    throw new ApiError(
      409,
      "Vehicle plate CONFLICT-99 was already registered by another staff member."
    );
  }

  // Calculate mock cost
  const calculatedCost = payload.totalCost !== undefined ? payload.totalCost : 12500;

  return {
    id: String(Math.floor(Math.random() * 90000) + 10000),
    calculatedCost: calculatedCost.toFixed(2),
    totalCost: (payload.totalCost ?? calculatedCost).toFixed(2),
    isPriceOverridden: payload.totalCost !== undefined,
  };
}

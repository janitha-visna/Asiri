// features/data-entry/data-entry.mocks.ts
import { ApiError } from "@/lib/api/client";
import type * as T from "./data-entry.types";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// MOCK DATABASE SEED DATA
// ============================================================================

export const MOCK_CATEGORIES: T.VehicleCategoryDto[] = [
  { id: "cat-1", name: "Motorcycle" },
  { id: "cat-2", name: "Car" },
  { id: "cat-3", name: "Cab" },
  { id: "cat-4", name: "Van" },
  { id: "cat-5", name: "Bus" },
  { id: "cat-6", name: "Lorry" },
  { id: "cat-7", name: "Commercial Vehicle" },
  { id: "cat-8", name: "Tipper" },
];

export const MOCK_VEHICLE_TYPES: T.VehicleTypeDto[] = [
  // Motorcycles
  {
    id: "vt-1",
    name: "Motorcycle",
    categoryId: "cat-1",
    description: "Examples: Bajaj Pulsar, Honda Dio, TVS Apache",
  },

  // Cars
  {
    id: "vt-2",
    name: "Small Car",
    categoryId: "cat-2",
    description: "Examples: Suzuki Alto, Suzuki Celerio, Perodua Axia",
  },
  {
    id: "vt-3",
    name: "Regular Car",
    categoryId: "cat-2",
    description: "Examples: Toyota Corolla, Honda Civic, Toyota Axio",
  },

  // Cabs
  {
    id: "vt-4",
    name: "Single Cab",
    categoryId: "cat-3",
    description: "Examples: Toyota Hilux Single Cab, Isuzu D-Max Single Cab",
  },
  {
    id: "vt-5",
    name: "Double Cab",
    categoryId: "cat-3",
    description: "Examples: Toyota Hilux Double Cab, Isuzu D-Max Double Cab",
  },

  // Vans
  {
    id: "vt-6",
    name: "Regular Van",
    categoryId: "cat-4",
    description: "Examples: Toyota HiAce, Nissan Caravan",
  },
  {
    id: "vt-7",
    name: "High Roof Van",
    categoryId: "cat-4",
    description: "Examples: Toyota HiAce High Roof, Nissan Caravan High Roof",
  },
  {
    id: "vt-8",
    name: "Mini Van",
    categoryId: "cat-4",
    description: "Example: Suzuki Every (Buddy Van)",
  },

  // Buses
  {
    id: "vt-9",
    name: "Small Bus",
    categoryId: "cat-5",
    description: "Example: Mitsubishi Rosa",
  },
  {
    id: "vt-10",
    name: "Tata Long Bus",
    categoryId: "cat-5",
    description: "Example: Tata Marcopolo long bus",
  },
  {
    id: "vt-11",
    name: "Leyland Bus",
    categoryId: "cat-5",
    description: "Examples: Ashok Leyland Viking, Ashok Leyland Lynx",
  },

  // Lorries
  {
    id: "vt-12",
    name: "10 1/2 Lorry",
    categoryId: "cat-6",
    description: "Example: 10.5-foot-class goods lorry",
  },
  {
    id: "vt-13",
    name: "14 1/2 Lorry",
    categoryId: "cat-6",
    description: "Example: 14.5-foot-class goods lorry",
  },

  // Commercial Vehicles
  {
    id: "vt-14",
    name: "Demo Batta",
    categoryId: "cat-7",
    description: "Example: Commercial delivery vehicle (Dimo Batta)",
  },

  // Tippers
  {
    id: "vt-16",
    name: "Small Tipper",
    categoryId: "cat-8",
    description: "Example: Small tipper truck used for sand and soil transport",
  },
  {
    id: "vt-17",
    name: "Long Tipper",
    categoryId: "cat-8",
    description: "Example: Large tipper truck used for construction materials",
  },
];

export const MOCK_SERVICE_PACKAGES: T.ServicePackageDto[] = [
  { id: "pkg-1", name: "Full Service" },
  { id: "pkg-2", name: "Normal Service" },
  { id: "pkg-3", name: "Body Wash" },
];

export const MOCK_COMPONENTS: Record<string, T.ComponentDto> = {
  engineOil: { id: "comp-1", name: "Engine Oil" },
  oilFilter: { id: "comp-2", name: "Oil Filter" },
  airFilter: { id: "comp-3", name: "Air Filter" },
  cabinFilter: { id: "comp-4", name: "Cabin A/C Filter" },
  coolant: { id: "comp-5", name: "Engine Coolant" },
};

export type VehicleClass = "motorcycle" | "car" | "van_cab" | "heavy";

export function getVehicleClass(typeId?: string): VehicleClass {
  if (!typeId) return "car";
  if (typeId === "vt-1") return "motorcycle";
  if (typeId === "vt-2" || typeId === "vt-3") return "car";
  if (["vt-4", "vt-5", "vt-6", "vt-7", "vt-8"].includes(typeId)) return "van_cab";
  return "heavy"; // vt-9 to vt-17
}

export function getServicesForVehicle(typeId: string): T.AvailableServiceDto[] {
  const vehicleClass = getVehicleClass(typeId);

  switch (vehicleClass) {
    case "motorcycle":
      return [
        {
          id: "srv-moto-1",
          name: "Engine Oil & Filter Change (Motorcycle)",
          basePrice: "1200.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.engineOil, MOCK_COMPONENTS.oilFilter],
        },
        {
          id: "srv-moto-2",
          name: "Air Filter Replacement",
          basePrice: "800.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.airFilter],
        },
        {
          id: "srv-moto-3",
          name: "Chain Lubrication & Tension Adjustment",
          basePrice: "600.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-moto-4",
          name: "Chain Degreasing, Greasing & Sprocket Check",
          basePrice: "1000.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-moto-5",
          name: "Brake Pad Inspection & Bleeding",
          basePrice: "1200.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-moto-6",
          name: "Motorcycle Pressure Wash & Chain Degreasing",
          basePrice: "800.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-moto-7",
          name: "Foam Polish & Tyre Shine",
          basePrice: "500.00",
          requiresPartSelection: false,
          components: [],
        },
      ];

    case "car":
      return [
        {
          id: "srv-car-1",
          name: "Engine Oil & Filter Change",
          basePrice: "3500.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.engineOil, MOCK_COMPONENTS.oilFilter],
        },
        {
          id: "srv-car-2",
          name: "Air Filter Replacement",
          basePrice: "1200.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.airFilter],
        },
        {
          id: "srv-car-3",
          name: "Cabin A/C Filter Replacement",
          basePrice: "1800.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.cabinFilter],
        },
        {
          id: "srv-car-4",
          name: "Engine Coolant Flush & Top-up",
          basePrice: "2200.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.coolant],
        },
        {
          id: "srv-car-5",
          name: "Body Wash with Snow Foam",
          basePrice: "1800.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-car-6",
          name: "Under-Chassis Pressure Wash",
          basePrice: "1200.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-car-7",
          name: "Complete Undercarriage Wash & Greasing",
          basePrice: "3000.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-car-8",
          name: "Interior Vacuum & Dashboard Polish",
          basePrice: "1500.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-car-9",
          name: "Brake Pad Inspection & Cleaning",
          basePrice: "2500.00",
          requiresPartSelection: false,
          components: [],
        },
      ];

    case "van_cab":
      return [
        {
          id: "srv-van-1",
          name: "Diesel Engine Oil & Filter Change",
          basePrice: "4500.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.engineOil, MOCK_COMPONENTS.oilFilter],
        },
        {
          id: "srv-van-2",
          name: "Air Filter Replacement",
          basePrice: "1500.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.airFilter],
        },
        {
          id: "srv-van-3",
          name: "Cabin A/C Filter Replacement",
          basePrice: "2000.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.cabinFilter],
        },
        {
          id: "srv-van-4",
          name: "Engine Coolant Flush & Top-up",
          basePrice: "2500.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.coolant],
        },
        {
          id: "srv-van-5",
          name: "Body Wash with Snow Foam (Van/Cab)",
          basePrice: "2400.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-van-6",
          name: "Under-Chassis Mud Blaster Wash",
          basePrice: "1800.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-van-7",
          name: "Full Undercarriage Wash & Greasing",
          basePrice: "3500.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-van-8",
          name: "Interior Vacuum & Mat Cleaning",
          basePrice: "1800.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-van-9",
          name: "Brake Inspection & Adjustment",
          basePrice: "2800.00",
          requiresPartSelection: false,
          components: [],
        },
      ];

    case "heavy":
      return [
        {
          id: "srv-hvy-1",
          name: "Heavy Duty Engine Oil & Filter Change",
          basePrice: "7500.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.engineOil, MOCK_COMPONENTS.oilFilter],
        },
        {
          id: "srv-hvy-2",
          name: "Heavy Duty Air Filter Replacement",
          basePrice: "2500.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.airFilter],
        },
        {
          id: "srv-hvy-3",
          name: "Heavy Duty Coolant Flush & Top-up",
          basePrice: "4000.00",
          requiresPartSelection: true,
          components: [MOCK_COMPONENTS.coolant],
        },
        {
          id: "srv-hvy-4",
          name: "Full Chassis Greasing (24 Points)",
          basePrice: "5000.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-hvy-5",
          name: "Commercial High-Pressure Body Wash",
          basePrice: "4500.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-hvy-6",
          name: "Under-Chassis & Tipper Bed Washout",
          basePrice: "3500.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-hvy-7",
          name: "Commercial High-Pressure Wash & Chassis Blast",
          basePrice: "5500.00",
          requiresPartSelection: false,
          components: [],
        },
        {
          id: "srv-hvy-8",
          name: "Air Brake System Inspection & Purge",
          basePrice: "4000.00",
          requiresPartSelection: false,
          components: [],
        },
      ];
  }
}

// Fallback compatibility map for static lookups
export const MOCK_SERVICES: Record<string, T.AvailableServiceDto[]> = {
  default: getServicesForVehicle("vt-3"),
};

// Parts catalog partitioned by vehicle classification and component
export const MOCK_PARTS_BY_CLASS: Record<
  VehicleClass,
  Record<string, T.PartDto[]>
> = {
  motorcycle: {
    "comp-1": [
      {
        id: "part-m101",
        brand: "Motul",
        partNumber: "7100-10W40",
        name: "7100 4T 10W-40 Synthetic (1L)",
      },
      {
        id: "part-m102",
        brand: "Castrol",
        partNumber: "ACT-20W40",
        name: "Activ 4T 20W-40 (1L)",
      },
      {
        id: "part-m103",
        brand: "Yamalube",
        partNumber: "YAM-10W40",
        name: "Performance 4T 10W-40 (1L)",
      },
    ],
    "comp-2": [
      {
        id: "part-m201",
        brand: "Bajaj Genuine",
        partNumber: "BJ-OF-100",
        name: "Pulsar / Discover OEM Oil Filter",
      },
      {
        id: "part-m202",
        brand: "TVS Genuine",
        partNumber: "TVS-OF-200",
        name: "Apache RTR OEM Oil Filter",
      },
      {
        id: "part-m203",
        brand: "Yamaha Genuine",
        partNumber: "YAM-OF-300",
        name: "FZ / R15 OEM Oil Filter",
      },
    ],
    "comp-3": [
      {
        id: "part-m301",
        brand: "OEM",
        partNumber: "MOTO-AF-01",
        name: "Motorcycle Foam Air Element",
      },
      {
        id: "part-m302",
        brand: "K&N",
        partNumber: "KN-MOTO-AF",
        name: "High-Flow Bike Air Filter",
      },
    ],
    "comp-4": [],
    "comp-5": [
      {
        id: "part-m501",
        brand: "Motul",
        partNumber: "MO-COOL-1L",
        name: "Motocool Expert Coolant (1L)",
      },
    ],
  },
  car: {
    "comp-1": [
      {
        id: "part-101",
        brand: "Mobil 1",
        partNumber: "M1-5W30",
        name: "Synthetic 5W-30 (4L)",
      },
      {
        id: "part-102",
        brand: "Castrol",
        partNumber: "MAG-10W40",
        name: "Magnatec 10W-40 (4L)",
      },
      {
        id: "part-103",
        brand: "Shell",
        partNumber: "HX7-5W30",
        name: "Helix Ultra 5W-30 (4L)",
      },
      {
        id: "part-104",
        brand: "Toyota Genuine",
        partNumber: "TG-0W20",
        name: "Motor Oil 0W-20 (4L)",
      },
    ],
    "comp-2": [
      {
        id: "part-201",
        brand: "Vic",
        partNumber: "C-110",
        name: "Oil Filter Element (Car)",
      },
      {
        id: "part-202",
        brand: "Toyota Genuine",
        partNumber: "90915-YZZE1",
        name: "OEM Oil Filter",
      },
      {
        id: "part-203",
        brand: "Bosch",
        partNumber: "P3300",
        name: "Premium Oil Filter",
      },
    ],
    "comp-3": [
      {
        id: "part-301",
        brand: "Denso",
        partNumber: "D-AF102",
        name: "Air Cleaner Element",
      },
      {
        id: "part-302",
        brand: "Vic",
        partNumber: "A-198",
        name: "Air Filter Standard",
      },
      {
        id: "part-303",
        brand: "Sakura",
        partNumber: "A-3301",
        name: "Heavy Duty Air Filter",
      },
    ],
    "comp-4": [
      {
        id: "part-401",
        brand: "Bosch",
        partNumber: "C302",
        name: "Active Carbon Cabin Filter",
      },
      {
        id: "part-402",
        brand: "Denso",
        partNumber: "D-CF05",
        name: "Anti-Bacterial Cabin Filter",
      },
    ],
    "comp-5": [
      {
        id: "part-501",
        brand: "Toyota Genuine",
        partNumber: "SLLC-50",
        name: "Super Long Life Coolant (4L)",
      },
      {
        id: "part-502",
        brand: "Castrol",
        partNumber: "RAD-COOL",
        name: "Radicool Premix (4L)",
      },
    ],
  },
  van_cab: {
    "comp-1": [
      {
        id: "part-v101",
        brand: "Shell",
        partNumber: "RIM-15W40",
        name: "Rimula R4 X 15W-40 (6L)",
      },
      {
        id: "part-v102",
        brand: "Mobil",
        partNumber: "DEL-15W40",
        name: "Delvac MX 15W-40 (6L)",
      },
      {
        id: "part-v103",
        brand: "Toyota Genuine",
        partNumber: "TG-DSL-10W30",
        name: "Diesel RV Special 10W-30 (6L)",
      },
    ],
    "comp-2": [
      {
        id: "part-v201",
        brand: "Vic",
        partNumber: "C-111",
        name: "Van & Cab Oil Filter",
      },
      {
        id: "part-v202",
        brand: "Toyota Genuine",
        partNumber: "90915-20003",
        name: "HiAce OEM Oil Filter",
      },
      {
        id: "part-v203",
        brand: "Denso",
        partNumber: "D-OF-VAN",
        name: "Commercial Grade Oil Filter",
      },
    ],
    "comp-3": [
      {
        id: "part-v301",
        brand: "Sakura",
        partNumber: "A-1172",
        name: "High Airflow Van Air Cleaner",
      },
      {
        id: "part-v302",
        brand: "Vic",
        partNumber: "A-188",
        name: "Commercial Air Filter Element",
      },
    ],
    "comp-4": [
      {
        id: "part-v401",
        brand: "Denso",
        partNumber: "D-CF-VAN",
        name: "HiAce / Caravan Cabin Filter",
      },
    ],
    "comp-5": [
      {
        id: "part-501",
        brand: "Toyota Genuine",
        partNumber: "SLLC-50",
        name: "Super Long Life Coolant (4L)",
      },
      {
        id: "part-v502",
        brand: "Caltex",
        partNumber: "CAL-XL-COOL",
        name: "Extended Life Coolant Premix (5L)",
      },
    ],
  },
  heavy: {
    "comp-1": [
      {
        id: "part-h101",
        brand: "Castrol",
        partNumber: "CRB-15W40",
        name: "CRB Turbomax Heavy Diesel (10L)",
      },
      {
        id: "part-h102",
        brand: "Mobil",
        partNumber: "DEL-MOD-15W40",
        name: "Delvac Modern 15W-40 (15L)",
      },
      {
        id: "part-h103",
        brand: "Caltex",
        partNumber: "DELO-400-15W40",
        name: "Delo 400 MGX 15W-40 (10L)",
      },
    ],
    "comp-2": [
      {
        id: "part-h201",
        brand: "Donaldson",
        partNumber: "P550008",
        name: "Heavy Duty Lube Filter",
      },
      {
        id: "part-h202",
        brand: "Fleetguard",
        partNumber: "LF16015",
        name: "Full-Flow Spin-On Oil Filter",
      },
      {
        id: "part-h203",
        brand: "Sakura",
        partNumber: "C-5801",
        name: "Commercial Bus & Lorry Oil Filter",
      },
    ],
    "comp-3": [
      {
        id: "part-h301",
        brand: "Donaldson",
        partNumber: "P777868",
        name: "Primary RadialSeal Heavy Air Filter",
      },
      {
        id: "part-h302",
        brand: "Fleetguard",
        partNumber: "AF25557",
        name: "PowerCore Commercial Air Cleaner",
      },
    ],
    "comp-4": [
      {
        id: "part-h401",
        brand: "Fleetguard",
        partNumber: "AF26427",
        name: "Heavy Duty Cab Air Filter",
      },
    ],
    "comp-5": [
      {
        id: "part-h501",
        brand: "Fleetguard",
        partNumber: "CC2825",
        name: "Compleat EG Heavy Duty Coolant (20L)",
      },
      {
        id: "part-h502",
        brand: "Caltex",
        partNumber: "DELO-XLC-10L",
        name: "Delo XLC Antifreeze/Coolant (10L)",
      },
    ],
  },
};

// Fallback compatibility map for static lookups
export const MOCK_PARTS: Record<string, T.PartDto[]> = MOCK_PARTS_BY_CLASS.car;

// Registered seed vehicles for lookup demo
export const MOCK_REGISTERED_VEHICLES: T.VehicleDto[] = [
  {
    id: "veh-1",
    numberPlate: "CB-1234",
    category: MOCK_CATEGORIES.find((c) => c.id === "cat-2") ?? MOCK_CATEGORIES[1], // Car
    vehicleType: MOCK_VEHICLE_TYPES.find((vt) => vt.id === "vt-3") ?? MOCK_VEHICLE_TYPES[2], // Regular Car
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
    category: MOCK_CATEGORIES.find((c) => c.id === "cat-4") ?? MOCK_CATEGORIES[3], // Van
    vehicleType: MOCK_VEHICLE_TYPES.find((vt) => vt.id === "vt-6") ?? MOCK_VEHICLE_TYPES[5], // Regular Van
    customer: {
      id: "cust-2",
      name: "Sunil Jayawardena",
      phones: [{ id: "ph-3", phoneNumber: "0719876543", isPrimary: true }],
    },
  },
  {
    id: "veh-3",
    numberPlate: "SP BAA-9012",
    category: MOCK_CATEGORIES.find((c) => c.id === "cat-1") ?? MOCK_CATEGORIES[0], // Motorcycle
    vehicleType: MOCK_VEHICLE_TYPES.find((vt) => vt.id === "vt-1") ?? MOCK_VEHICLE_TYPES[0], // Motorcycle
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

export async function lookupVehicles(
  plate: string,
): Promise<T.VehicleLookupResponse> {
  await delay(300);
  const normalized = plate.trim().toUpperCase();

  const exactMatch =
    MOCK_REGISTERED_VEHICLES.find((v) => v.numberPlate === normalized) ?? null;

  const suggestions = MOCK_REGISTERED_VEHICLES.filter(
    (v) =>
      v.numberPlate.startsWith(normalized) ||
      v.numberPlate.includes(normalized),
  ).map((v) => ({
    id: v.id,
    numberPlate: v.numberPlate,
    vehicleTypeName: v.vehicleType.name,
    customerName: v.customer.name,
  }));

  return {
    isRegistered: exactMatch !== null,
    exactMatch,
    suggestions,
  };
}

export async function getVehicleCategories(): Promise<T.VehicleCategoryDto[]> {
  await delay(200);
  return MOCK_CATEGORIES;
}

export async function getVehicleTypes(
  categoryId: string,
): Promise<T.VehicleTypeDto[]> {
  await delay(200);
  return MOCK_VEHICLE_TYPES.filter((vt) => vt.categoryId === categoryId);
}

export async function getServicePackages(): Promise<T.ServicePackageDto[]> {
  await delay(200);
  return MOCK_SERVICE_PACKAGES;
}

export async function getAvailableServices(
  typeId: string,
  _packageId?: string,
): Promise<T.AvailableServiceDto[]> {
  await delay(300);
  return getServicesForVehicle(typeId);
}

export async function getCompatibleParts(
  typeId: string,
  componentId: string,
): Promise<T.PartDto[]> {
  await delay(250);
  const vehicleClass = getVehicleClass(typeId);
  const classParts = MOCK_PARTS_BY_CLASS[vehicleClass] ?? MOCK_PARTS_BY_CLASS.car;
  return classParts[componentId] ?? [];
}

export async function createServiceJob(
  payload: T.CreateServiceJobPayload,
): Promise<T.ServiceJobResponse> {
  await delay(600);

  // Simulated 409 Conflict test condition:
  // If the user attempts to register "CONFLICT-99" as a new car
  if (payload.vehicle.numberPlate === "CONFLICT-99" && !payload.vehicle.id) {
    throw new ApiError(
      409,
      "Vehicle plate CONFLICT-99 was already registered by another staff member.",
    );
  }

  // Calculate mock cost
  const calculatedCost =
    payload.totalCost !== undefined ? payload.totalCost : 12500;

  return {
    id: String(Math.floor(Math.random() * 90000) + 10000),
    calculatedCost: calculatedCost.toFixed(2),
    totalCost: (payload.totalCost ?? calculatedCost).toFixed(2),
    isPriceOverridden: payload.totalCost !== undefined,
  };
}

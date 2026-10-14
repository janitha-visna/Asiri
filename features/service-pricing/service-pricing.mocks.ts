// features/service-pricing/service-pricing.mocks.ts
import type {
  VehicleCategory,
  VehicleType,
  ServicePackage,
} from "./service-pricing.types";

/**
 * 1. Vehicle Categories
 */
export const MOCK_PRICING_CATEGORIES: VehicleCategory[] = [
  { id: "cat-motorcycle", name: "Motorcycle" },
  { id: "cat-car", name: "Car" },
  { id: "cat-cab", name: "Cab" },
  { id: "cat-van", name: "Van" },
  { id: "cat-bus", name: "Bus" },
  { id: "cat-lorry", name: "Lorry" },
  { id: "cat-commercial", name: "Commercial Vehicle" },
  { id: "cat-tipper", name: "Tipper" },
];

/**
 * 2. Vehicle Types (by Category)
 */
export const MOCK_PRICING_VEHICLE_TYPES: VehicleType[] = [
  // Motorcycle
  {
    id: "vt-motorcycle",
    categoryId: "cat-motorcycle",
    name: "Motorcycle",
    description: "Bajaj Pulsar, Honda Dio, TVS Apache",
  },

  // Car
  {
    id: "vt-small-car",
    categoryId: "cat-car",
    name: "Small Car",
    description: "Suzuki Alto, Celerio, Perodua Axia",
  },
  {
    id: "vt-regular-car",
    categoryId: "cat-car",
    name: "Regular Car",
    description: "Toyota Corolla, Premio, Honda Civic",
  },

  // Cab
  {
    id: "vt-single-cab",
    categoryId: "cat-cab",
    name: "Single Cab",
    description: "Toyota Hilux Single Cab, Isuzu D-Max",
  },
  {
    id: "vt-double-cab",
    categoryId: "cat-cab",
    name: "Double Cab",
    description: "Toyota Hilux Double Cab, Isuzu D-Max",
  },

  // Van
  {
    id: "vt-regular-van",
    categoryId: "cat-van",
    name: "Regular Van",
    description: "Toyota HiAce Standard, Nissan Caravan",
  },
  {
    id: "vt-high-roof-van",
    categoryId: "cat-van",
    name: "High Roof Van",
    description: "Toyota HiAce High Roof / Commuter",
  },
  {
    id: "vt-mini-van",
    categoryId: "cat-van",
    name: "Mini Van",
    description: "Suzuki Every (Buddy Van), Daihatsu Hijet",
  },

  // Bus
  {
    id: "vt-small-bus",
    categoryId: "cat-bus",
    name: "Small Bus",
    description: "Mitsubishi Rosa, Toyota Coaster",
  },
  {
    id: "vt-tata-long-bus",
    categoryId: "cat-bus",
    name: "Tata Long Bus",
    description: "Tata Marcopolo / LP series long bus",
  },
  {
    id: "vt-leyland-bus",
    categoryId: "cat-bus",
    name: "Leyland Bus",
    description: "Ashok Leyland Viking, Lynx",
  },

  // Lorry
  {
    id: "vt-10-half-lorry",
    categoryId: "cat-lorry",
    name: "10½-Foot Lorry",
    description: "10.5-ft class light cargo lorry",
  },
  {
    id: "vt-14-half-lorry",
    categoryId: "cat-lorry",
    name: "14½-Foot Lorry",
    description: "14.5-ft class medium cargo lorry",
  },

  // Commercial Vehicle
  {
    id: "vt-dimo-batta",
    categoryId: "cat-commercial",
    name: "Dimo Batta",
    description: "Tata Ace / Dimo Batta commercial delivery",
  },

  // Tipper
  {
    id: "vt-small-tipper",
    categoryId: "cat-tipper",
    name: "Small Tipper",
    description: "Small sand and soil transport tipper",
  },
  {
    id: "vt-long-tipper",
    categoryId: "cat-tipper",
    name: "Long Tipper",
    description: "Large heavy construction tipper",
  },
];

/**
 * 3. Supported Service Packages
 */
export const MOCK_SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "pkg-full",
    name: "Full Service",
    description: "A comprehensive vehicle servicing package",
  },
  {
    id: "pkg-normal",
    name: "Normal Service",
    description: "A standard vehicle servicing package",
  },
  {
    id: "pkg-wash",
    name: "Body Wash",
    description: "A vehicle exterior cleaning package",
  },
];

/**
 * 4. Initial Package Base Prices (in LKR)
 * Key format: `${vehicleTypeId}:${servicePackageId}`
 *
 * Full Service has pre-defined base prices from spec.
 * Normal Service & Body Wash are initially unspecified (null).
 * Motorcycle is initially unspecified (null) for all packages.
 */
export const INITIAL_PACKAGE_PRICES: Record<string, string | null> = {
  // Car
  "vt-small-car:pkg-full": "4000.00",
  "vt-small-car:pkg-normal": "3500.00",
  "vt-small-car:pkg-wash": "850.00",

  "vt-regular-car:pkg-full": "4500.00",
  "vt-regular-car:pkg-normal": "4000.00",
  "vt-regular-car:pkg-wash": "850.00",

  // Cab
  "vt-single-cab:pkg-full": "5500.00",
  "vt-single-cab:pkg-normal": "5000.00",
  "vt-single-cab:pkg-wash": "1000.00",

  "vt-double-cab:pkg-full": "6000.00",
  "vt-double-cab:pkg-normal": "5500.00",
  "vt-double-cab:pkg-wash": "1200.00",

  // Van
  "vt-regular-van:pkg-full": "5000.00",
  "vt-regular-van:pkg-normal": "4500.00",
  "vt-regular-van:pkg-wash": "1200.00",

  "vt-high-roof-van:pkg-full": "6000.00",
  "vt-high-roof-van:pkg-normal": "5500.00",
  "vt-high-roof-van:pkg-wash": "1500.00",

  "vt-mini-van:pkg-full": "4500.00",
  "vt-mini-van:pkg-normal": "4000.00",
  "vt-mini-van:pkg-wash": "1000.00",

  // Bus
  "vt-small-bus:pkg-full": "9500.00",
  "vt-small-bus:pkg-normal": "8500.00",
  "vt-small-bus:pkg-wash": "2500.00",

  "vt-tata-long-bus:pkg-full": "9000.00",
  "vt-tata-long-bus:pkg-normal": "8000.00",
  "vt-tata-long-bus:pkg-wash": "2500.00",

  "vt-leyland-bus:pkg-full": "13000.00",
  "vt-leyland-bus:pkg-normal": "11500.00",
  "vt-leyland-bus:pkg-wash": "3500.00",

  // Lorry
  "vt-10-half-lorry:pkg-full": "6500.00",
  "vt-10-half-lorry:pkg-normal": "5500.00",
  "vt-10-half-lorry:pkg-wash": "1800.00",

  "vt-14-half-lorry:pkg-full": "7000.00",
  "vt-14-half-lorry:pkg-normal": "6000.00",
  "vt-14-half-lorry:pkg-wash": "2000.00",

  // Commercial Vehicle
  "vt-dimo-batta:pkg-full": "4500.00",
  "vt-dimo-batta:pkg-normal": "4000.00",
  "vt-dimo-batta:pkg-wash": "1000.00",

  // Tipper
  "vt-small-tipper:pkg-full": "7500.00",
  "vt-small-tipper:pkg-normal": "6500.00",
  "vt-small-tipper:pkg-wash": "2000.00",

  "vt-long-tipper:pkg-full": "9000.00",
  "vt-long-tipper:pkg-normal": "8000.00",
  "vt-long-tipper:pkg-wash": "2500.00",

  // Motorcycle
  "vt-motorcycle:pkg-full": "2000.00",
  "vt-motorcycle:pkg-normal": "1500.00",
  "vt-motorcycle:pkg-wash": "500.00",
};

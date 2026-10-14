// features/service-pricing/service-pricing.types.ts

export type VehicleCategory = {
  id: string;
  name: string;
};

export type VehicleType = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
};

export type ServicePackage = {
  id: string;
  name: string;
  description: string;
};

export type ServicePackagePrice = {
  vehicleTypeId: string;
  servicePackageId: string;
  basePrice: string | null; // e.g. "4000.00", or null if not yet defined
};

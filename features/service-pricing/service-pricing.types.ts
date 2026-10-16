// features/service-pricing/service-pricing.types.ts

export type MatrixVehicleType = {
  id: string;
  name: string;
};

export type MatrixCategory = {
  categoryId: string;
  categoryName: string;
  vehicleTypes: MatrixVehicleType[];
};

export type MatrixService = {
  id: string;
  name: string;
};

export type ServicePricesMatrixResponse = {
  categories: MatrixCategory[];
  services: MatrixService[];
  prices: Record<string, number | null>; // Format: `${serviceId}_${vehicleTypeId}`: price
};

export type UpdatePriceItem = {
  serviceId: string;
  vehicleTypeId: string;
  price: number;
};

export type UpdateServicePricesPayload = {
  prices: UpdatePriceItem[];
};


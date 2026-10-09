// features/data-entry/data-entry.api.ts
import { apiRequest } from "@/lib/api/client";
import * as mocks from "./data-entry.mocks";
import type * as T from "./data-entry.types";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

/**
 * 1. Plate Lookup: Prefix search for suggestions & exact match auto-fill
 */
export async function lookupVehicles(
  plate: string,
  signal?: AbortSignal
): Promise<T.VehicleLookupResponse> {
  if (USE_MOCKS) return mocks.lookupVehicles(plate);
  return apiRequest<T.VehicleLookupResponse>(
    `/vehicles/lookup?plate=${encodeURIComponent(plate)}`,
    { signal }
  );
}

/**
 * 2. Vehicle Categories
 */
export async function getVehicleCategories(): Promise<T.VehicleCategoryDto[]> {
  if (USE_MOCKS) return mocks.getVehicleCategories();
  return apiRequest<T.VehicleCategoryDto[]>("/vehicle-categories");
}

/**
 * 3. Vehicle Types for a Category
 */
export async function getVehicleTypes(
  categoryId: string
): Promise<T.VehicleTypeDto[]> {
  if (USE_MOCKS) return mocks.getVehicleTypes(categoryId);
  return apiRequest<T.VehicleTypeDto[]>(
    `/vehicle-categories/${categoryId}/vehicle-types`
  );
}

/**
 * 4. Primary Service Packages (Full Service, Body Wash, etc.)
 */
export async function getServicePackages(): Promise<T.ServicePackageDto[]> {
  if (USE_MOCKS) return mocks.getServicePackages();
  return apiRequest<T.ServicePackageDto[]>("/service-packages");
}

/**
 * 5. Available Specific Services for vehicleType + packageId
 */
export async function getAvailableServices(
  typeId: string,
  packageId: string
): Promise<T.AvailableServiceDto[]> {
  if (USE_MOCKS) return mocks.getAvailableServices(typeId, packageId);
  return apiRequest<T.AvailableServiceDto[]>(
    `/vehicle-types/${typeId}/services?packageId=${encodeURIComponent(packageId)}`
  );
}

/**
 * 6. Compatible Parts for a Component on this Vehicle Type
 */
export async function getCompatibleParts(
  typeId: string,
  componentId: string
): Promise<T.PartDto[]> {
  if (USE_MOCKS) return mocks.getCompatibleParts(typeId, componentId);
  return apiRequest<T.PartDto[]>(
    `/vehicle-types/${typeId}/components/${componentId}/parts`
  );
}

/**
 * 7. Registered Customer Phone Operations
 */
export async function addCustomerPhone(
  customerId: string,
  phoneNumber: string
): Promise<T.PhoneDto> {
  if (USE_MOCKS) {
    return { id: `ph-${Date.now()}`, phoneNumber, isPrimary: false };
  }
  return apiRequest<T.PhoneDto>(`/customers/${customerId}/phones`, {
    method: "POST",
    body: { phoneNumber },
  });
}

export async function deleteCustomerPhone(
  customerId: string,
  phoneId: string
): Promise<void> {
  if (USE_MOCKS) return;
  return apiRequest<void>(`/customers/${customerId}/phones/${phoneId}`, {
    method: "DELETE",
  });
}

export async function setPrimaryCustomerPhone(
  customerId: string,
  phoneId: string
): Promise<T.PhoneDto> {
  if (USE_MOCKS) {
    return { id: phoneId, phoneNumber: "", isPrimary: true };
  }
  return apiRequest<T.PhoneDto>(`/customers/${customerId}/phones/${phoneId}`, {
    method: "PATCH",
    body: { isPrimary: true },
  });
}

/**
 * 8. Save Service Job (All-in-one transactional creation)
 */
export async function createServiceJob(
  payload: T.CreateServiceJobPayload
): Promise<T.ServiceJobResponse> {
  if (USE_MOCKS) return mocks.createServiceJob(payload);
  return apiRequest<T.ServiceJobResponse>("/service-jobs", {
    method: "POST",
    body: payload,
  });
}

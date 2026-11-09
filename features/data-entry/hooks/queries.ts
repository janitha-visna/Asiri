// features/data-entry/hooks/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../data-entry.api";
import type * as T from "../data-entry.types";
import { getServicePricesMatrix } from "@/features/service-pricing/service-pricing.api";
import { servicePricingKeys } from "@/features/service-pricing/hooks/useServicePricing";

/**
 * Query Keys factory for predictable caching and invalidation
 */
export const dataEntryKeys = {
  all: ["data-entry"] as const,
  vehicleLookup: (plate: string) =>
    [...dataEntryKeys.all, "vehicle-lookup", plate] as const,
  categories: () => [...dataEntryKeys.all, "vehicle-categories"] as const,
  vehicleTypes: (categoryId: string) =>
    [...dataEntryKeys.all, "vehicle-types", categoryId] as const,
  servicePackages: () => [...dataEntryKeys.all, "service-packages"] as const,
  availableServices: (typeId: string, _packageId?: string) =>
    [...dataEntryKeys.all, "available-services", typeId] as const,
  compatibleParts: (typeId: string, componentId: string) =>
    [...dataEntryKeys.all, "compatible-parts", typeId, componentId] as const,
};

/**
 * 1. Vehicle Plate Lookup Query
 * Only runs if plate has at least 2 characters.
 */
export function useVehicleLookup(debouncedPlate: string) {
  const cleanPlate = debouncedPlate.trim().toUpperCase();

  const queryResult = useQuery({
    queryKey: dataEntryKeys.vehicleLookup(cleanPlate),
    queryFn: ({ signal }) => api.lookupVehicles(cleanPlate, signal),
    enabled: cleanPlate.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  return queryResult;
}

/**
 * 2. Vehicle Categories Query (derived from GET /service-prices/matrix)
 * Only runs when the vehicle is NOT already registered.
 */
export function useVehicleCategories(enabled = true) {
  return useQuery({
    queryKey: servicePricingKeys.matrix(),
    queryFn: ({ signal }) => getServicePricesMatrix(signal),
    enabled,
    staleTime: 1000 * 60 * 15,
    select: (matrix): T.VehicleCategoryDto[] =>
      matrix.categories.map((c) => ({
        id: c.categoryId,
        name: c.categoryName,
      })),
  });
}

/**
 * 3. Vehicle Types for Selected Category (derived from GET /service-prices/matrix)
 * Zero extra API calls when switching category!
 */
export function useVehicleTypes(categoryId?: string, enabled = true) {
  return useQuery({
    queryKey: servicePricingKeys.matrix(),
    queryFn: ({ signal }) => getServicePricesMatrix(signal),
    enabled: enabled && Boolean(categoryId),
    staleTime: 1000 * 60 * 15,
    select: (matrix): T.VehicleTypeDto[] => {
      const category = matrix.categories.find(
        (c) => c.categoryId === categoryId,
      );
      if (!category) return [];
      return category.vehicleTypes.map((vt) => ({
        id: vt.id,
        name: vt.name,
        categoryId: category.categoryId,
      }));
    },
  });
}
/**
 * 4. Primary Service Packages Query
 */
export function useServicePackages() {
  const queryResult = useQuery({
    queryKey: dataEntryKeys.servicePackages(),
    queryFn: api.getServicePackages,
    staleTime: 1000 * 60 * 15,
  });

  return queryResult;
}

/**
 * 5. Available Specific Services for Vehicle Type
 */
export function useAvailableServices(typeId?: string, _packageId?: string) {
  const queryResult = useQuery({
    queryKey: dataEntryKeys.availableServices(typeId ?? ""),
    queryFn: ({ signal }) => api.getAvailableServices(typeId!, undefined, signal),
    enabled: Boolean(typeId),
    staleTime: 1000 * 60 * 10,
  });

  return queryResult;
}

/**
 * 6. Compatible Part Brands for a Component on a Vehicle Type
 */
export function useCompatibleParts(typeId?: string, componentId?: string) {
  const queryResult = useQuery({
    queryKey: dataEntryKeys.compatibleParts(typeId ?? "", componentId ?? ""),
    queryFn: () => api.getCompatibleParts(typeId!, componentId!),
    enabled: Boolean(typeId && componentId),
    staleTime: 1000 * 60 * 10,
  });

  return queryResult;
}

/**
 * 7. Create Service Job Mutation
 * Handles the transactional submission of the entire draft
 */
export function useCreateServiceJobMutation() {
  const queryClient = useQueryClient();

  const mutationResult = useMutation<
    T.ServiceJobResponse,
    Error,
    T.CreateServiceJobPayload
  >({
    mutationFn: (payload) => api.createServiceJob(payload),
    onSuccess: (data) => {
      // Invalidate relevant vehicle lookups so new vehicle/job is immediately discoverable
      queryClient.invalidateQueries({ queryKey: dataEntryKeys.all });
    },
  });

  return mutationResult;
}

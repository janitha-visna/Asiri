// features/data-entry/hooks/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../data-entry.api";
import type * as T from "../data-entry.types";

/**
 * Query Keys factory for predictable caching and invalidation
 */
export const dataEntryKeys = {
  all: ["data-entry"] as const,
  vehicleLookup: (plate: string) => [...dataEntryKeys.all, "vehicle-lookup", plate] as const,
  categories: () => [...dataEntryKeys.all, "vehicle-categories"] as const,
  vehicleTypes: (categoryId: string) => [...dataEntryKeys.all, "vehicle-types", categoryId] as const,
  servicePackages: () => [...dataEntryKeys.all, "service-packages"] as const,
  availableServices: (typeId: string, packageId: string) =>
    [...dataEntryKeys.all, "available-services", typeId, packageId] as const,
  compatibleParts: (typeId: string, componentId: string) =>
    [...dataEntryKeys.all, "compatible-parts", typeId, componentId] as const,
};

/**
 * 1. Vehicle Plate Lookup Query
 * Only runs if plate has at least 2 characters.
 */
export function useVehicleLookup(debouncedPlate: string) {
  const cleanPlate = debouncedPlate.trim().toUpperCase();

  return useQuery({
    queryKey: dataEntryKeys.vehicleLookup(cleanPlate),
    queryFn: ({ signal }) => api.lookupVehicles(cleanPlate, signal),
    enabled: cleanPlate.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
}

/**
 * 2. Vehicle Categories Query
 */
export function useVehicleCategories() {
  return useQuery({
    queryKey: dataEntryKeys.categories(),
    queryFn: api.getVehicleCategories,
    staleTime: 1000 * 60 * 15, // 15 minutes (static catalog)
  });
}

/**
 * 3. Vehicle Types for Selected Category (Cascading)
 */
export function useVehicleTypes(categoryId?: string) {
  return useQuery({
    queryKey: dataEntryKeys.vehicleTypes(categoryId ?? ""),
    queryFn: () => api.getVehicleTypes(categoryId!),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * 4. Primary Service Packages Query
 */
export function useServicePackages() {
  return useQuery({
    queryKey: dataEntryKeys.servicePackages(),
    queryFn: api.getServicePackages,
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * 5. Available Specific Services for Vehicle Type + Package
 */
export function useAvailableServices(typeId?: string, packageId?: string) {
  return useQuery({
    queryKey: dataEntryKeys.availableServices(typeId ?? "", packageId ?? ""),
    queryFn: () => api.getAvailableServices(typeId!, packageId!),
    enabled: Boolean(typeId && packageId),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * 6. Compatible Part Brands for a Component on a Vehicle Type
 */
export function useCompatibleParts(typeId?: string, componentId?: string) {
  return useQuery({
    queryKey: dataEntryKeys.compatibleParts(typeId ?? "", componentId ?? ""),
    queryFn: () => api.getCompatibleParts(typeId!, componentId!),
    enabled: Boolean(typeId && componentId),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * 7. Create Service Job Mutation
 * Handles the transactional submission of the entire draft
 */
export function useCreateServiceJobMutation() {
  const queryClient = useQueryClient();

  return useMutation<T.ServiceJobResponse, Error, T.CreateServiceJobPayload>({
    mutationFn: (payload) => api.createServiceJob(payload),
    onSuccess: (data) => {
      // Invalidate relevant vehicle lookups so new vehicle/job is immediately discoverable
      queryClient.invalidateQueries({ queryKey: dataEntryKeys.all });
    },
  });
}

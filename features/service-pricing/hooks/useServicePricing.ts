// features/service-pricing/hooks/useServicePricing.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../service-pricing.api";
import type {
  ServicePricesMatrixResponse,
  UpdateServicePricesPayload,
} from "../service-pricing.types";

export const servicePricingKeys = {
  all: ["service-pricing"] as const,
  matrix: () => [...servicePricingKeys.all, "matrix"] as const,
};

/**
 * Hook to fetch the complete pricing matrix (categories, vehicle types, services, prices)
 */
export function useServicePricesMatrix() {
  const queryResult = useQuery({
    queryKey: servicePricingKeys.matrix(),
    queryFn: ({ signal }) => api.getServicePricesMatrix(signal),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return queryResult;
}

/**
 * Hook to update service base prices via PUT /service-prices
 */
export function useUpdateServicePrices() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: UpdateServicePricesPayload) =>
      api.updateServicePrices(payload),

    onSuccess: (_, variables) => {
      // Optimistically / immediately update the React Query cache
      queryClient.setQueryData<ServicePricesMatrixResponse>(
        servicePricingKeys.matrix(),
        (old) => {
          if (!old) return old;
          const nextPrices = { ...old.prices };
          for (const item of variables.prices) {
            const key = `${item.serviceId}_${item.vehicleTypeId}`;
            nextPrices[key] = item.price;
          }
          return {
            ...old,
            prices: nextPrices,
          };
        }
      );

      // Invalidate to ensure background sync
      queryClient.invalidateQueries({ queryKey: servicePricingKeys.matrix() });
    },
  });

  return mutation;
}

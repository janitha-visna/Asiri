// features/service-pricing/service-pricing.api.ts
import { apiRequest } from "@/lib/api/client";
import * as mocks from "./service-pricing.mocks";
import type {
  ServicePricesMatrixResponse,
  UpdateServicePricesPayload,
} from "./service-pricing.types";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

/**
 * Fetch complete service pricing matrix
 * GET /service-prices/matrix
 */
export async function getServicePricesMatrix(
  signal?: AbortSignal
): Promise<ServicePricesMatrixResponse> {
  if (USE_MOCKS) {
    return mocks.getMockServicePricesMatrix();
  }

  try {
    return await apiRequest<ServicePricesMatrixResponse>(
      "/service-prices/matrix",
      { signal }
    );
  } catch (err) {
    // If running in development without a live backend, gracefully fallback to mock
    if (__DEV__) {
      console.warn(
        "[service-pricing.api] /service-prices/matrix failed, falling back to mock:",
        err
      );
      return mocks.getMockServicePricesMatrix();
    }
    throw err;
  }
}

/**
 * Update service base prices
 * PUT /service-prices
 */
export async function updateServicePrices(
  payload: UpdateServicePricesPayload,
  signal?: AbortSignal
): Promise<unknown> {
  if (USE_MOCKS) {
    return mocks.updateMockServicePrices(payload);
  }

  try {
    return await apiRequest("/service-prices", {
      method: "PUT",
      body: payload,
      signal,
    });
  } catch (err) {
    if (__DEV__) {
      console.warn(
        "[service-pricing.api] PUT /service-prices failed, updating mock state:",
        err
      );
      return mocks.updateMockServicePrices(payload);
    }
    throw err;
  }
}

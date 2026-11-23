import { apiRequest } from "@/lib/api/client";
import type { AnalyticsResponse } from "./analytics.types";

type RepeatByCategoryApiResponse = {
  year: number;
  categories: {
    categoryId: number;
    categoryName: string;
    totalVehicles: number;
    repeatVehicles: number;
    nonRepeatVehicles: number;
  }[];
};

/**
 * Fetches repeat vs non-repeat vehicle analytics per vehicle category
 * from GET /service-jobs/vehicles/repeat-by-category?year=...
 */
export async function fetchAnalytics(
  year: number = new Date().getFullYear()
): Promise<AnalyticsResponse> {
  const res = await apiRequest<RepeatByCategoryApiResponse>(
    `/service-jobs/vehicles/repeat-by-category?year=${year}`
  );

  const data = res.categories.map((c) => ({
    vehicleType: c.categoryName,
    repeatCount: c.repeatVehicles,
    nonRepeatCount: c.nonRepeatVehicles,
  }));

  const repeatVehicles = res.categories.reduce(
    (sum, c) => sum + c.repeatVehicles,
    0
  );
  const nonRepeatVehicles = res.categories.reduce(
    (sum, c) => sum + c.nonRepeatVehicles,
    0
  );
  const totalVehicles = res.categories.reduce(
    (sum, c) => sum + c.totalVehicles,
    0
  );

  return {
    totalVehicles,
    repeatVehicles,
    nonRepeatVehicles,
    repeatPercentage:
      totalVehicles > 0 ? (repeatVehicles / totalVehicles) * 100 : 0,
    data,
  };
}

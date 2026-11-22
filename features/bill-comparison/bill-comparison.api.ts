import { apiRequest } from "@/lib/api/client";
import type { BillComparisonResponse } from "./bill-comparison.types";

type AverageBillByCategoryApiResponse = {
  currentYear: number;
  previousYear: number;
  categories: {
    categoryId: number;
    categoryName: string;
    currentYearAvg: number;
    previousYearAvg: number;
  }[];
};

/**
 * Fetches average bill comparison data (previous vs current year) per vehicle category
 * from GET /service-jobs/revenue/average-bill-by-category.
 */
export async function fetchBillComparison(): Promise<BillComparisonResponse> {
  const res = await apiRequest<AverageBillByCategoryApiResponse>(
    "/service-jobs/revenue/average-bill-by-category"
  );

  return {
    year: res.currentYear,
    currentMonth: String(res.currentYear),
    previousMonth: String(res.previousYear),
    currency: "LKR",
    data: res.categories.map((c) => ({
      vehicleType: c.categoryName,
      previousMonthAverage: c.previousYearAvg,
      currentMonthAverage: c.currentYearAvg,
    })),
  };
}

import { apiRequest } from "@/lib/api/client";
import { MONTH_LABELS } from "./revenue-chart.constants";
import type { MonthlyRevenuePoint } from "./revenue-chart.types";

type MonthlyRevenueApiResponse = {
  year: number;
  totalRevenue: number;
  months: {
    month: number;
    label: string;
    revenue: number;
  }[];
};

/**
 * Fetches monthly revenue totals for a given year from
 * GET /service-jobs/revenue/monthly?year=...
 * Resolves to exactly 12 points (Jan-Dec); missing months are null.
 */
export async function fetchYearlyRevenue(
  year: number
): Promise<MonthlyRevenuePoint[]> {
  const res = await apiRequest<MonthlyRevenueApiResponse>(
    `/service-jobs/revenue/monthly?year=${year}`
  );

  const byMonth = new Map(res.months.map((m) => [m.month, m]));

  return MONTH_LABELS.map((fallbackLabel, index) => {
    const entry = byMonth.get(index + 1);
    return {
      month: entry?.label ?? fallbackLabel,
      value: entry?.revenue ?? null,
    };
  });
}

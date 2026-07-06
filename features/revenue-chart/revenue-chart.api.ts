import { MONTH_LABELS } from "./revenue-chart.constants";
import type { MonthlyRevenuePoint } from "./revenue-chart.types";

/**
 * Fetches monthly revenue totals for a given year.
 * Replace this mock with a real API call (e.g. fetch("/api/revenue?year=...")).
 * Must resolve to exactly 12 points (Jan-Dec); missing months should be null.
 */
export async function fetchYearlyRevenue(
  year: number
): Promise<MonthlyRevenuePoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load revenue data");
  }

  return MONTH_LABELS.map((month, index) => {
    const base = 200_000 + index * 15_000;
    const variance = Math.round((Math.random() - 0.5) * 120_000);
    const value = Math.max(0, base + variance);
    return { month, value };
  });
}

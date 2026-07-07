import type {
  RevenueAnalyticsResponse,
  WeeklyRevenueResponse,
} from "./revenue-analytics.types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const SAMPLE_REVENUE = [
  120000, 135000, 148000, 142000, 165000, 170000,
  158000, 180000, 176000, 190000, 210000, 225000,
];

/**
 * Fetches yearly revenue analytics (monthly totals) for a given year.
 * Replace this mock with a real API call, e.g.
 * fetch(`/api/analytics/revenue?year=${year}&granularity=monthly`).
 */
export async function fetchRevenueAnalytics(
  year: number
): Promise<RevenueAnalyticsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load revenue analytics");
  }

  return {
    year,
    currency: "LKR",
    months: MONTHS,
    revenue: SAMPLE_REVENUE,
  };
}

/**
 * Fetches weekly revenue analytics for a single month of a given year.
 * Replace this mock with a real API call, e.g.
 * fetch(`/api/analytics/revenue?year=${year}&month=${monthIndex + 1}&granularity=weekly`).
 */
export async function fetchWeeklyRevenueAnalytics(
  year: number,
  monthIndex: number
): Promise<WeeklyRevenueResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load weekly revenue analytics");
  }

  const monthTotal = SAMPLE_REVENUE[monthIndex] ?? 0;
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const baseShare = monthTotal / weeks.length;

  const revenue = weeks.map((_, index) => {
    const variance = (Math.random() - 0.5) * baseShare * 0.3;
    return Math.max(0, Math.round(baseShare + variance));
  });

  return {
    year,
    month: MONTHS[monthIndex] ?? MONTHS[0],
    currency: "LKR",
    weeks,
    revenue,
  };
}

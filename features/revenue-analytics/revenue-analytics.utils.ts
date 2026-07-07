import type {
  RevenueAnalyticsResponse,
  RevenueAnalyticsSummary,
  RevenueTrend,
} from "./revenue-analytics.types";

const TREND_THRESHOLD = 0.05;

function detectTrend(revenue: number[]): RevenueTrend {
  if (revenue.length < 2) return "Stable";

  const midpoint = Math.floor(revenue.length / 2);
  const firstHalf = revenue.slice(0, midpoint);
  const secondHalf = revenue.slice(revenue.length - midpoint);

  const average = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length;

  const firstAverage = average(firstHalf);
  const secondAverage = average(secondHalf);

  if (firstAverage === 0) return "Stable";

  const change = (secondAverage - firstAverage) / firstAverage;
  if (change > TREND_THRESHOLD) return "Increasing";
  if (change < -TREND_THRESHOLD) return "Decreasing";
  return "Stable";
}

export function summarizeRevenueAnalytics(
  response: RevenueAnalyticsResponse
): RevenueAnalyticsSummary {
  const { months, revenue } = response;

  const totalRevenue = revenue.reduce((sum, value) => sum + value, 0);
  const averageMonthlyRevenue =
    revenue.length > 0 ? totalRevenue / revenue.length : 0;

  let highestIndex = 0;
  let lowestIndex = 0;
  revenue.forEach((value, index) => {
    if (value > revenue[highestIndex]) highestIndex = index;
    if (value < revenue[lowestIndex]) lowestIndex = index;
  });

  return {
    totalRevenue,
    averageMonthlyRevenue,
    highestMonth: months[highestIndex] ?? "—",
    highestRevenue: revenue[highestIndex] ?? 0,
    lowestMonth: months[lowestIndex] ?? "—",
    lowestRevenue: revenue[lowestIndex] ?? 0,
    trend: detectTrend(revenue),
  };
}

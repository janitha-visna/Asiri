import { apiRequest } from "@/lib/api/client";
import type { ServiceTrendsResponse } from "./service-trends.types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type DemandByMonthApiResponse = {
  year: number;
  services: string[];
  months: {
    month: number;
    label: string;
    counts: Record<string, number>;
  }[];
};

/**
 * Fetches monthly service demand trends (per service type) for a given year
 * from GET /service-jobs/services/demand-by-month?year=...
 */
export async function fetchServiceTrends(
  year: number
): Promise<ServiceTrendsResponse> {
  const res = await apiRequest<DemandByMonthApiResponse>(
    `/service-jobs/services/demand-by-month?year=${year}`
  );

  const byMonth = new Map(res.months.map((m) => [m.month, m]));

  return {
    year: res.year,
    months: MONTHS.map((fallback, idx) => byMonth.get(idx + 1)?.label ?? fallback),
    data: res.services.map((serviceType) => ({
      serviceType,
      values: MONTHS.map(
        (_, idx) => byMonth.get(idx + 1)?.counts?.[serviceType] ?? 0
      ),
    })),
  };
}

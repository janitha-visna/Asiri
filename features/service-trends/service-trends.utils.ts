import type { ServiceTrendsResponse } from "./service-trends.types";

export type ServiceTrendsSummary = {
  totalServices: number;
  mostRequestedService: string;
  leastRequestedService: string;
  categoryCount: number;
};

export function summarizeServiceTrends(
  response: ServiceTrendsResponse
): ServiceTrendsSummary {
  const totals = response.data.map((series) => ({
    serviceType: series.serviceType,
    total: series.values.reduce((sum, value) => sum + value, 0),
  }));

  const totalServices = totals.reduce((sum, item) => sum + item.total, 0);

  const sorted = [...totals].sort((a, b) => b.total - a.total);
  const mostRequestedService = sorted[0]?.serviceType ?? "—";
  const leastRequestedService = sorted[sorted.length - 1]?.serviceType ?? "—";

  return {
    totalServices,
    mostRequestedService,
    leastRequestedService,
    categoryCount: response.data.length,
  };
}

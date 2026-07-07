import type { ServiceTrendsResponse } from "./service-trends.types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Fetches monthly service demand trends (per service type) for a given year.
 * Replace this mock with a real API call, e.g. fetch(`/api/service-trends?year=${year}`).
 */
export async function fetchServiceTrends(year: number): Promise<ServiceTrendsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load service demand trends");
  }

  return {
    year,
    months: MONTHS,
    data: [
      {
        serviceType: "Oil Change",
        values: [30, 35, 40, 42, 38, 45, 48, 50, 46, 44, 41, 39],
      },
      {
        serviceType: "Brake Service",
        values: [20, 18, 25, 24, 26, 28, 30, 29, 27, 26, 24, 22],
      },
      {
        serviceType: "Tire Replacement",
        values: [12, 14, 16, 15, 18, 20, 22, 21, 19, 17, 15, 13],
      },
    ],
  };
}

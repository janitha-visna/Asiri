import type { AnalyticsResponse } from "./analytics.types";

/**
 * Fetches repeat vs non-repeat vehicle analytics per vehicle type.
 * Replace this mock with a real API call, e.g. fetch("/api/analytics/repeat-vehicles").
 */
export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load analytics data");
  }

  const data = [
    { vehicleType: "Cars", repeatCount: 62, nonRepeatCount: 38 },
    { vehicleType: "Vans", repeatCount: 34, nonRepeatCount: 22 },
    { vehicleType: "SUV", repeatCount: 28, nonRepeatCount: 24 },
    { vehicleType: "Motorcycle", repeatCount: 15, nonRepeatCount: 20 },
  ];

  const repeatVehicles = data.reduce((sum, item) => sum + item.repeatCount, 0);
  const nonRepeatVehicles = data.reduce((sum, item) => sum + item.nonRepeatCount, 0);
  const totalVehicles = repeatVehicles + nonRepeatVehicles;

  return {
    totalVehicles,
    repeatVehicles,
    nonRepeatVehicles,
    repeatPercentage: totalVehicles > 0 ? (repeatVehicles / totalVehicles) * 100 : 0,
    data,
  };
}

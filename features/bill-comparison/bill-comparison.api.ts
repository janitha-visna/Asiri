import type { BillComparisonResponse } from "./bill-comparison.types";

/**
 * Fetches average bill comparison data (previous vs current month) per vehicle type.
 * Replace this mock with a real API call, e.g. fetch("/api/bill-comparison").
 */
export async function fetchBillComparison(): Promise<BillComparisonResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load bill comparison data");
  }

  return {
    year: 2026,
    currentMonth: "Jul",
    previousMonth: "Jun",
    currency: "LKR",
    data: [
      { vehicleType: "Car", previousMonthAverage: 6200, currentMonthAverage: 6900 },
      { vehicleType: "Bike", previousMonthAverage: 3200, currentMonthAverage: 3500 },
      { vehicleType: "Lorry", previousMonthAverage: 8600, currentMonthAverage: 8100 },
      { vehicleType: "Bus", previousMonthAverage: 9200, currentMonthAverage: 9600 },
    ],
  };
}

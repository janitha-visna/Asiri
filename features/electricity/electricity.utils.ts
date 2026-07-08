import type {
  ElectricityAnalyticsResponse,
  ElectricitySummary,
} from "./electricity.types";

export function summarizeElectricityAnalytics(
  response: ElectricityAnalyticsResponse
): ElectricitySummary {
  const { data, total, averageMonthly } = response;

  let highestIndex = 0;
  let lowestIndex = 0;
  data.forEach((item, index) => {
    if (item.consumption > data[highestIndex].consumption) highestIndex = index;
    if (item.consumption < data[lowestIndex].consumption) lowestIndex = index;
  });

  return {
    total,
    averageMonthly,
    highestMonth: data[highestIndex]?.month ?? "—",
    highestConsumption: data[highestIndex]?.consumption ?? 0,
    lowestMonth: data[lowestIndex]?.month ?? "—",
    lowestConsumption: data[lowestIndex]?.consumption ?? 0,
  };
}

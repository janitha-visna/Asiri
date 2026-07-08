import { formatDateKey, formatDateLabel } from "./electricity.constants";
import type {
  ElectricityAnalyticsResponse,
  MeterReading,
  MeterReadingInput,
} from "./electricity.types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const SAMPLE_CONSUMPTION = [320, 280, 310, 400, 450, 500, 480, 460, 430, 410, 390, 370];

/**
 * Fetches monthly electricity consumption analytics for a given year.
 * Replace this mock with a real API call, e.g. fetch(`/api/analytics/electricity?year=${year}`).
 */
export async function fetchElectricityAnalytics(
  year: number
): Promise<ElectricityAnalyticsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load electricity analytics");
  }

  const total = SAMPLE_CONSUMPTION.reduce((sum, value) => sum + value, 0);

  return {
    year,
    unit: "kWh",
    months: MONTHS,
    data: MONTHS.map((month, index) => ({
      month,
      consumption: SAMPLE_CONSUMPTION[index],
    })),
    total,
    averageMonthly: Math.round(total / SAMPLE_CONSUMPTION.length),
  };
}

let mockReadings: MeterReading[] | null = null;

function seedMockReadings(): MeterReading[] {
  const readings: MeterReading[] = [];
  let end = 12520;

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dailyConsumption = 55 + Math.round(Math.random() * 20);
    const start = end - dailyConsumption;

    readings.push({
      id: formatDateKey(date),
      date: formatDateKey(date),
      dateLabel: formatDateLabel(date),
      start,
      end,
      consumption: end - start,
    });

    end = start;
  }

  return readings;
}

/**
 * Fetches the last 7 days of recorded meter readings.
 * Replace this mock with a real API call, e.g. fetch("/api/electricity/readings?days=7").
 */
export async function fetchRecentReadings(): Promise<MeterReading[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Simulated failure for demo/testing of the error state.
  if (Math.random() < 0.1) {
    throw new Error("Failed to load recent readings");
  }

  if (!mockReadings) {
    mockReadings = seedMockReadings();
  }

  return mockReadings;
}

/**
 * Saves today's meter reading.
 * Replace this mock with a real API call, e.g. POST /api/electricity/readings.
 */
export async function saveMeterReading(
  input: MeterReadingInput
): Promise<MeterReading> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const reading: MeterReading = {
    id: input.date,
    date: input.date,
    dateLabel: formatDateLabel(new Date(input.date)),
    start: input.start,
    end: input.end,
    consumption: input.end - input.start,
  };

  if (!mockReadings) {
    mockReadings = seedMockReadings();
  }
  mockReadings = [reading, ...mockReadings.filter((r) => r.date !== input.date)];

  return reading;
}

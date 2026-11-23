import { apiRequest } from "@/lib/api/client";
import { formatDateKey, formatDateLabel } from "./electricity.constants";
import type {
  ElectricityAnalyticsResponse,
  MeterReading,
  MeterReadingInput,
} from "./electricity.types";

type MonthlyElectricityApiResponse = {
  year: number;
  totalConsumption: number;
  months: {
    month: number;
    label: string;
    consumption: number;
  }[];
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const SAMPLE_CONSUMPTION = [320, 280, 310, 400, 450, 500, 480, 460, 430, 410, 390, 370];

/**
 * Fetches monthly electricity consumption analytics for a given year
 * from GET /electricity-usage/monthly?year=...
 */
export async function fetchElectricityAnalytics(
  year: number
): Promise<ElectricityAnalyticsResponse> {
  const res = await apiRequest<MonthlyElectricityApiResponse>(
    `/electricity-usage/monthly?year=${year}`
  );

  const byMonth = new Map(res.months.map((m) => [m.month, m]));
  const data = MONTHS.map((fallback, idx) => {
    const entry = byMonth.get(idx + 1);
    return {
      month: entry?.label ?? fallback,
      consumption: entry?.consumption ?? 0,
    };
  });

  return {
    year: res.year,
    unit: "kWh",
    months: data.map((d) => d.month),
    data,
    total: res.totalConsumption,
    averageMonthly: Math.round(res.totalConsumption / 12),
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
 * Saves today's meter reading via POST /electricity-usage.
 */
export async function saveMeterReading(
  input: MeterReadingInput
): Promise<MeterReading> {
  await apiRequest<unknown>("/electricity-usage", {
    method: "POST",
    body: {
      readingDate: input.date,
      startReading: input.start,
      endReading: input.end,
    },
  });

  return {
    id: input.date,
    date: input.date,
    dateLabel: formatDateLabel(new Date(input.date)),
    start: input.start,
    end: input.end,
    consumption: input.end - input.start,
  };
}

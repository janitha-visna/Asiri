export type MonthlyConsumption = {
  month: string;
  consumption: number;
};

export type ElectricityAnalyticsResponse = {
  year: number;
  unit: string;
  months: string[];
  data: MonthlyConsumption[];
  total: number;
  averageMonthly: number;
};

export type ElectricityStatus = "loading" | "error" | "empty" | "success";

export type ElectricityAnalyticsState = {
  status: ElectricityStatus;
  response: ElectricityAnalyticsResponse | null;
  retry: () => void;
};

export type ElectricitySummary = {
  total: number;
  averageMonthly: number;
  highestMonth: string;
  highestConsumption: number;
  lowestMonth: string;
  lowestConsumption: number;
};

export type MeterReading = {
  id: string;
  date: string;
  dateLabel: string;
  start: number;
  end: number;
  consumption: number;
};

export type MeterReadingInput = {
  date: string;
  start: number;
  end: number;
};

export type RecentReadingsState = {
  status: ElectricityStatus;
  readings: MeterReading[];
  retry: () => void;
  addReading: (input: MeterReadingInput) => Promise<void>;
  isSaving: boolean;
};

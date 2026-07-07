export type RevenueAnalyticsResponse = {
  year: number;
  currency: string;
  months: string[];
  revenue: number[];
};

export type RevenueAnalyticsStatus = "loading" | "error" | "empty" | "success";

export type RevenueAnalyticsState = {
  status: RevenueAnalyticsStatus;
  response: RevenueAnalyticsResponse | null;
  year: number;
  setYear: (year: number) => void;
  retry: () => void;
};

export type RevenueTrend = "Increasing" | "Decreasing" | "Stable";

export type RevenueAnalyticsSummary = {
  totalRevenue: number;
  averageMonthlyRevenue: number;
  highestMonth: string;
  highestRevenue: number;
  lowestMonth: string;
  lowestRevenue: number;
  trend: RevenueTrend;
};

export type SelectedRevenuePoint = {
  month: string;
  revenue: number;
  year: number;
};

export type RevenueGranularity = "yearly" | "weekly";

export type WeeklyRevenueResponse = {
  year: number;
  month: string;
  currency: string;
  weeks: string[];
  revenue: number[];
};

export type WeeklyRevenueState = {
  status: RevenueAnalyticsStatus;
  response: WeeklyRevenueResponse | null;
  retry: () => void;
};

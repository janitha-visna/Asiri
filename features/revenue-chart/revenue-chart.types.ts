export type RevenueChartStatus = "loading" | "error" | "empty" | "success";

export type MonthlyRevenuePoint = {
  month: string;
  value: number | null;
};

export type RevenueChartState = {
  status: RevenueChartStatus;
  data: MonthlyRevenuePoint[];
  year: number;
  retry: () => void;
};

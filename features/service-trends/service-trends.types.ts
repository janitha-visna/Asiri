export type ServiceTypeTrend = {
  serviceType: string;
  values: number[];
};

export type ServiceTrendsResponse = {
  year: number;
  months: string[];
  data: ServiceTypeTrend[];
};

export type ServiceTrendsStatus = "loading" | "error" | "empty" | "success";

export type ServiceTrendsState = {
  status: ServiceTrendsStatus;
  response: ServiceTrendsResponse | null;
  retry: () => void;
};

export type SelectedServicePoint = {
  serviceType: string;
  month: string;
  count: number;
};

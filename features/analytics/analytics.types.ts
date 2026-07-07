export type VehicleTypeRepeatCount = {
  vehicleType: string;
  repeatCount: number;
  nonRepeatCount: number;
};

export type AnalyticsResponse = {
  totalVehicles: number;
  repeatVehicles: number;
  nonRepeatVehicles: number;
  repeatPercentage: number;
  data: VehicleTypeRepeatCount[];
};

export type AnalyticsStatus = "loading" | "error" | "empty" | "success";

export type AnalyticsState = {
  status: AnalyticsStatus;
  response: AnalyticsResponse | null;
  retry: () => void;
};

export type VehicleType = "Car" | "Bike" | "Lorry" | "Bus";

export type VehicleBillAverage = {
  vehicleType: VehicleType;
  previousMonthAverage: number;
  currentMonthAverage: number;
};

export type BillComparisonResponse = {
  year: number;
  currentMonth: string;
  previousMonth: string;
  currency: string;
  data: VehicleBillAverage[];
};

export type BillComparisonStatus = "loading" | "error" | "empty" | "success";

export type BillComparisonState = {
  status: BillComparisonStatus;
  response: BillComparisonResponse | null;
  retry: () => void;
};

export type SelectedBar = {
  vehicleType: VehicleType;
  period: "previous" | "current";
  value: number;
};

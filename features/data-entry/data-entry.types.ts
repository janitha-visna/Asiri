// features/data-entry/data-entry.types.ts

// 1. Fields that have their own modal screen/card:
export type DataEntryModalKey =
  | "vehicleNumber"
  | "telephoneNumber"
  | "date"
  | "totalPrice"
  | "serviceType"
  | "odometerReading";

// 2. All stored values in state (includes subfields like vehicleType):
export type DataEntryFieldKey = DataEntryModalKey | "vehicleType";

export type DataEntryField = {
  key: DataEntryModalKey;
  label: string;
};

export type DataEntryValues = Partial<Record<DataEntryFieldKey, string>>;

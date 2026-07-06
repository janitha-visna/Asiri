export type DataEntryFieldKey =
  | "vehicleNumber"
  | "telephoneNumber"
  | "date"
  | "totalPrice"
  | "serviceType"
  | "odometerReading";

export type DataEntryField = {
  key: DataEntryFieldKey;
  label: string;
};

export type DataEntryValues = Partial<Record<DataEntryFieldKey, string>>;

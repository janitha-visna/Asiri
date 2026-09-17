import { createContext, useContext, useState, type ReactNode } from "react";
import type { DataEntryFieldKey, DataEntryValues } from "./data-entry.types";

type DataEntryContextValue = {
  values: DataEntryValues;
  saveField: (key: DataEntryFieldKey, value: string) => void;
  getDisplayValue: (key: DataEntryFieldKey) => string | undefined;
};

const DataEntryContext = createContext<DataEntryContextValue | null>(null);

/**
 * Formats today's date as YYYY-MM-DD
 */
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DataEntryProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<DataEntryValues>({
    date: getTodayDateString(),
  });

  function saveField(key: DataEntryFieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }
  // ✨ Clean Formatter Function:
  function getDisplayValue(key: DataEntryFieldKey): string | undefined {
    if (key === "vehicleNumber" && values.vehicleNumber) {
      return values.vehicleType
        ? `${values.vehicleNumber} • ${values.vehicleType}`
        : values.vehicleNumber;
    }
    return values[key];
  }

  return (
    <DataEntryContext.Provider value={{ values, saveField, getDisplayValue }}>
      {children}
    </DataEntryContext.Provider>
  );
}

export function useDataEntryContext() {
  const context = useContext(DataEntryContext);
  if (!context) {
    throw new Error(
      "useDataEntryContext must be used within a DataEntryProvider",
    );
  }
  return context;
}

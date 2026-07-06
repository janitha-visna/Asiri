import { useState } from "react";
import type { DataEntryField, DataEntryFieldKey, DataEntryValues } from "./data-entry.types";

export function useDataEntry() {
  const [values, setValues] = useState<DataEntryValues>({});
  const [activeField, setActiveField] = useState<DataEntryField | null>(null);

  function openField(field: DataEntryField) {
    setActiveField(field);
  }

  function closeField() {
    setActiveField(null);
  }

  function saveField(key: DataEntryFieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    closeField();
  }

  return { values, activeField, openField, closeField, saveField };
}

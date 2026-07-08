import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRecentReadings, saveMeterReading } from "./electricity.api";
import type {
  ElectricityStatus,
  MeterReading,
  MeterReadingInput,
  RecentReadingsState,
} from "./electricity.types";

export function useRecentReadings(): RecentReadingsState {
  const [status, setStatus] = useState<ElectricityStatus>("loading");
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchRecentReadings()
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        setReadings(result);
        setStatus(result.length > 0 ? "success" : "empty");
      })
      .catch(() => {
        if (requestId.current !== currentRequest) return;
        setReadings([]);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addReading = useCallback(async (input: MeterReadingInput) => {
    setIsSaving(true);
    try {
      const reading = await saveMeterReading(input);
      setReadings((prev) => [reading, ...prev.filter((r) => r.date !== reading.date)]);
      setStatus("success");
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { status, readings, retry: load, addReading, isSaving };
}

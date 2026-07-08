import { useCallback, useEffect, useRef, useState } from "react";
import { fetchElectricityAnalytics } from "./electricity.api";
import type {
  ElectricityAnalyticsResponse,
  ElectricityAnalyticsState,
  ElectricityStatus,
} from "./electricity.types";

const CURRENT_YEAR = new Date().getFullYear();

export function useElectricityAnalytics(): ElectricityAnalyticsState {
  const [status, setStatus] = useState<ElectricityStatus>("loading");
  const [response, setResponse] = useState<ElectricityAnalyticsResponse | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchElectricityAnalytics(CURRENT_YEAR)
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        const hasAnyValue = result.data.some((item) => item.consumption > 0);
        setResponse(result);
        setStatus(result.data.length > 0 && hasAnyValue ? "success" : "empty");
      })
      .catch(() => {
        if (requestId.current !== currentRequest) return;
        setResponse(null);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, response, retry: load };
}

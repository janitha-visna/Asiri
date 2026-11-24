import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAnalytics } from "./analytics.api";
import type {
  AnalyticsResponse,
  AnalyticsState,
  AnalyticsStatus,
} from "./analytics.types";

export function useAnalyticsData(year: number): AnalyticsState {
  const [status, setStatus] = useState<AnalyticsStatus>("loading");
  const [response, setResponse] = useState<AnalyticsResponse | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchAnalytics(year)
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        setResponse(result);
        setStatus(result.data.length > 0 && result.totalVehicles > 0 ? "success" : "empty");
      })
      .catch(() => {
        if (requestId.current !== currentRequest) return;
        setResponse(null);
        setStatus("error");
      });
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  return { status, response, retry: load };
}

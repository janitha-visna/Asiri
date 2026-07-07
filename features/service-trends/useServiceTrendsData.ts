import { useCallback, useEffect, useRef, useState } from "react";
import { fetchServiceTrends } from "./service-trends.api";
import type {
  ServiceTrendsResponse,
  ServiceTrendsState,
  ServiceTrendsStatus,
} from "./service-trends.types";

export function useServiceTrendsData(year: number): ServiceTrendsState {
  const [status, setStatus] = useState<ServiceTrendsStatus>("loading");
  const [response, setResponse] = useState<ServiceTrendsResponse | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchServiceTrends(year)
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        const hasAnyValue = result.data.some((series) =>
          series.values.some((value) => value > 0)
        );
        setResponse(result);
        setStatus(result.data.length > 0 && hasAnyValue ? "success" : "empty");
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

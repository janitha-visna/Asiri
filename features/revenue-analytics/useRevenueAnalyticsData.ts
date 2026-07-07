import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRevenueAnalytics } from "./revenue-analytics.api";
import type {
  RevenueAnalyticsResponse,
  RevenueAnalyticsState,
  RevenueAnalyticsStatus,
} from "./revenue-analytics.types";

const CURRENT_YEAR = new Date().getFullYear();

export function useRevenueAnalyticsData(): RevenueAnalyticsState {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [status, setStatus] = useState<RevenueAnalyticsStatus>("loading");
  const [response, setResponse] = useState<RevenueAnalyticsResponse | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchRevenueAnalytics(year)
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        const hasAnyValue = result.revenue.some((value) => value > 0);
        setResponse(result);
        setStatus(result.revenue.length > 0 && hasAnyValue ? "success" : "empty");
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

  return { status, response, year, setYear, retry: load };
}

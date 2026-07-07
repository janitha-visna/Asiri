import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeeklyRevenueAnalytics } from "./revenue-analytics.api";
import type {
  RevenueAnalyticsStatus,
  WeeklyRevenueResponse,
  WeeklyRevenueState,
} from "./revenue-analytics.types";

export function useWeeklyRevenueData(
  year: number,
  monthIndex: number
): WeeklyRevenueState {
  const [status, setStatus] = useState<RevenueAnalyticsStatus>("loading");
  const [response, setResponse] = useState<WeeklyRevenueResponse | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchWeeklyRevenueAnalytics(year, monthIndex)
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
  }, [year, monthIndex]);

  useEffect(() => {
    load();
  }, [load]);

  return { status, response, retry: load };
}

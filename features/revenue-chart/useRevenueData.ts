import { useCallback, useEffect, useRef, useState } from "react";
import { fetchYearlyRevenue } from "./revenue-chart.api";
import type {
  MonthlyRevenuePoint,
  RevenueChartState,
  RevenueChartStatus,
} from "./revenue-chart.types";

export function useRevenueData(year: number): RevenueChartState {
  const [status, setStatus] = useState<RevenueChartStatus>("loading");
  const [data, setData] = useState<MonthlyRevenuePoint[]>([]);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchYearlyRevenue(year)
      .then((points) => {
        if (requestId.current !== currentRequest) return;
        const hasAnyValue = points.some(
          (point) => point.value !== null && point.value > 0
        );
        setData(points);
        setStatus(hasAnyValue ? "success" : "empty");
      })
      .catch(() => {
        if (requestId.current !== currentRequest) return;
        setData([]);
        setStatus("error");
      });
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  return { status, data, year, retry: load };
}

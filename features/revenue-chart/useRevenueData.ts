import { useEffect, useState } from "react";
import { fetchYearlyRevenue } from "./revenue-chart.api";
import type {
  MonthlyRevenuePoint,
  RevenueChartState,
  RevenueChartStatus,
} from "./revenue-chart.types";

export function useRevenueData(year: number): RevenueChartState {
  const [status, setStatus] = useState<RevenueChartStatus>("loading");
  const [data, setData] = useState<MonthlyRevenuePoint[]>([]);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchYearlyRevenue(year)
      .then((points) => {
        if (cancelled) return;
        const hasAnyValue = points.some(
          (point) => point.value !== null && point.value > 0,
        );
        setData(points);
        setStatus(hasAnyValue ? "success" : "empty");
      })
      .catch(() => {
        if (cancelled) return;
        setData([]);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [year, reloadCount]);

  return {
    status,
    data,
    year,
    retry: () => {
      setStatus("loading");
      setReloadCount((c) => c + 1);
    },
  };
}

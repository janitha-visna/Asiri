import { useCallback, useEffect, useRef, useState } from "react";
import { fetchBillComparison } from "./bill-comparison.api";
import type {
  BillComparisonResponse,
  BillComparisonState,
  BillComparisonStatus,
} from "./bill-comparison.types";

export function useBillComparisonData(): BillComparisonState {
  const [status, setStatus] = useState<BillComparisonStatus>("loading");
  const [response, setResponse] = useState<BillComparisonResponse | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus("loading");

    fetchBillComparison()
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        setResponse(result);
        setStatus(result.data.length > 0 ? "success" : "empty");
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

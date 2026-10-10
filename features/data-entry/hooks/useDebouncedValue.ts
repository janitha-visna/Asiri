import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any rapidly changing value (e.g. search input).
 * Waits for the specified delay in milliseconds before updating the debounced value.
 */
export function useDebouncedValue<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

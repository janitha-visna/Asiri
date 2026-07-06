export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const Y_AXIS_MAX = 1_000_000;
export const Y_AXIS_TICK_INTERVAL = 100_000;
export const Y_AXIS_SECTIONS = Y_AXIS_MAX / Y_AXIS_TICK_INTERVAL;

/**
 * Formats a currency value for compact axis/tooltip display.
 * e.g. 100000 -> "Rs. 100K", 1000000 -> "Rs. 1M"
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `Rs. ${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `Rs. ${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `Rs. ${value}`;
}

/**
 * Formats a currency value with full precision and thousands separators.
 * e.g. 245000 -> "Rs. 245,000"
 */
export function formatCurrencyFull(value: number): string {
  return `Rs. ${value.toLocaleString("en-US")}`;
}

export const Y_AXIS_LABELS = Array.from(
  { length: Y_AXIS_SECTIONS + 1 },
  (_, i) => formatCurrencyCompact(i * Y_AXIS_TICK_INTERVAL)
);

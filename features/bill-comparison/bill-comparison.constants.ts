export const PREVIOUS_MONTH_COLOR = "#94a3b8";
export const CURRENT_MONTH_COLOR = "#16a34a";

export const Y_AXIS_MAX = 10_000;
export const Y_AXIS_SECTIONS = 5;

/**
 * Formats a currency value for compact axis display.
 * e.g. 12500 -> "12.5K", 1000000 -> "1M"
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `${value}`;
}

/**
 * Formats a currency value with full precision and thousands separators.
 * e.g. ("LKR", 12500) -> "LKR 12,500"
 */
export function formatCurrencyFull(currency: string, value: number): string {
  return `${currency} ${value.toLocaleString("en-US")}`;
}

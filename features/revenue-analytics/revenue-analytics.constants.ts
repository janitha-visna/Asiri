export const CHART_LINE_COLOR = "#16a34a";
export const Y_AXIS_SECTIONS = 5;

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
export function formatCurrencyFull(currency: string, value: number): string {
  return `${currency} ${value.toLocaleString("en-US")}`;
}

/**
 * Rounds a max value up to a "nice" number so axis ticks land on round figures.
 */
export function roundUpToNiceMax(value: number, sections: number): number {
  if (value <= 0) return sections;
  const rawStep = value / sections;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude;
  return niceStep * sections;
}

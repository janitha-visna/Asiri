export const CHART_LINE_COLOR = "#2563eb";
export const Y_AXIS_SECTIONS = 5;

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

/**
 * Formats a date as "01 Jul 2026".
 */
export function formatDateLabel(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${day} ${month} ${date.getFullYear()}`;
}

/**
 * Formats a Date object to YYYY-MM-DD string.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

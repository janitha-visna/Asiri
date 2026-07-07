export const REPEAT_COLOR = "#16a34a";
export const NON_REPEAT_COLOR = "#94a3b8";

export const Y_AXIS_SECTIONS = 5;

/**
 * Formats a count for compact axis display. e.g. 1250 -> "1.3K"
 */
export function formatCompactCount(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `${Math.round(value)}`;
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

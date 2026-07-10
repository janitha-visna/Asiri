import type { SelectItem } from "@/components/ui/select";
import type { InventoryUnit } from "./inventory.types";

export const UNIT_OPTIONS: (SelectItem & { value: InventoryUnit })[] = [
  { label: "Liters (L)", value: "L" },
  { label: "Milliliters (mL)", value: "mL" },
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Grams (g)", value: "g" },
  { label: "Pieces (pcs)", value: "pcs" },
  { label: "Bottles", value: "Bottles" },
  { label: "Boxes", value: "Boxes" },
  { label: "Packs", value: "Packs" },
];

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

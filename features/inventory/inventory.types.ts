export type InventoryUnit =
  | "L"
  | "mL"
  | "kg"
  | "g"
  | "pcs"
  | "Bottles"
  | "Boxes"
  | "Packs";

export type InventoryCategory = {
  id: string;
  name: string;
  unit: InventoryUnit;
  hasVariants: boolean;
};

export type InventoryVariant = {
  id: string;
  categoryId: string;
  name: string;
};

/**
 * A single dated stock addition. Owned either by a variant (variants-enabled
 * categories) or directly by a category (non-variant categories) — the
 * `ownerId` is whichever of those two ids applies.
 */
export type StockEntry = {
  id: string;
  ownerId: string;
  date: string;
  dateLabel: string;
  quantity: number;
  purchasePrice?: number;
  sellingPrice?: number;
};

export type CreateCategoryInput = {
  name: string;
  unit: InventoryUnit;
  hasVariants: boolean;
};

export type AddVariantInput = {
  name: string;
  initialStock: number;
  purchasePrice?: number;
  sellingPrice?: number;
};

export type AddStockEntryInput = {
  quantity: number;
  purchasePrice?: number;
  sellingPrice?: number;
};

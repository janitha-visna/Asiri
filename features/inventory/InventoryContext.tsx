import { createContext, useContext, useState, type ReactNode } from "react";
import { formatDateKey, formatDateLabel, generateId } from "./inventory.constants";
import type {
  AddStockEntryInput,
  AddVariantInput,
  CreateCategoryInput,
  InventoryCategory,
  InventoryVariant,
  ReduceStockInput,
  StockEntry,
  StockTransactionType,
} from "./inventory.types";

type InventoryContextValue = {
  categories: InventoryCategory[];
  variantsByCategory: Record<string, InventoryVariant[]>;
  addCategory: (input: CreateCategoryInput) => InventoryCategory;
  addVariant: (categoryId: string, input: AddVariantInput) => InventoryVariant;
  addStockEntry: (ownerId: string, input: AddStockEntryInput) => StockEntry;
  reduceStock: (ownerId: string, input: ReduceStockInput) => StockEntry;
  getCategory: (categoryId: string) => InventoryCategory | undefined;
  getVariant: (variantId: string) => InventoryVariant | undefined;
  getVariants: (categoryId: string) => InventoryVariant[];
  getStockEntries: (ownerId: string) => StockEntry[];
  getTotalStock: (ownerId: string) => number;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

const INITIAL_CATEGORIES: InventoryCategory[] = [
  { id: "engine-oil", name: "Engine Oil", unit: "L", hasVariants: true },
  { id: "air-filter", name: "Air Filter", unit: "pcs", hasVariants: false },
  { id: "kerosene", name: "Kerosene", unit: "L", hasVariants: false },
  { id: "gear-oil", name: "Gear Oil", unit: "L", hasVariants: true },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<InventoryCategory[]>(INITIAL_CATEGORIES);
  const [variantsByCategory, setVariantsByCategory] = useState<
    Record<string, InventoryVariant[]>
  >({});
  const [stockEntriesByOwner, setStockEntriesByOwner] = useState<
    Record<string, StockEntry[]>
  >({});

  function addCategory(input: CreateCategoryInput): InventoryCategory {
    const category: InventoryCategory = { id: generateId(), ...input };
    setCategories((prev) => [...prev, category]);
    return category;
  }

  function recordStockEntry(
    ownerId: string,
    type: StockTransactionType,
    quantity: number,
    date: Date,
    extra?: { purchasePrice?: number; sellingPrice?: number }
  ): StockEntry {
    const entry: StockEntry = {
      id: generateId(),
      ownerId,
      type,
      date: formatDateKey(date),
      dateLabel: formatDateLabel(date),
      quantity,
      purchasePrice: extra?.purchasePrice,
      sellingPrice: extra?.sellingPrice,
    };
    setStockEntriesByOwner((prev) => ({
      ...prev,
      [ownerId]: [entry, ...(prev[ownerId] ?? [])],
    }));
    return entry;
  }

  function addVariant(categoryId: string, input: AddVariantInput): InventoryVariant {
    const { name, initialStock, purchasePrice, sellingPrice } = input;
    const variant: InventoryVariant = { id: generateId(), categoryId, name };
    setVariantsByCategory((prev) => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] ?? []), variant],
    }));
    recordStockEntry(variant.id, "addition", initialStock, new Date(), {
      purchasePrice,
      sellingPrice,
    });
    return variant;
  }

  function addStockEntry(ownerId: string, input: AddStockEntryInput): StockEntry {
    return recordStockEntry(ownerId, "addition", input.quantity, new Date(), {
      purchasePrice: input.purchasePrice,
      sellingPrice: input.sellingPrice,
    });
  }

  function reduceStock(ownerId: string, input: ReduceStockInput): StockEntry {
    return recordStockEntry(ownerId, "usage", input.quantity, input.date);
  }

  function getCategory(categoryId: string) {
    return categories.find((category) => category.id === categoryId);
  }

  function getVariant(variantId: string) {
    return Object.values(variantsByCategory)
      .flat()
      .find((variant) => variant.id === variantId);
  }

  function getVariants(categoryId: string) {
    return variantsByCategory[categoryId] ?? [];
  }

  function getStockEntries(ownerId: string) {
    return stockEntriesByOwner[ownerId] ?? [];
  }

  function getTotalStock(ownerId: string) {
    return getStockEntries(ownerId).reduce(
      (sum, entry) =>
        entry.type === "usage" ? sum - entry.quantity : sum + entry.quantity,
      0
    );
  }

  return (
    <InventoryContext.Provider
      value={{
        categories,
        variantsByCategory,
        addCategory,
        addVariant,
        addStockEntry,
        reduceStock,
        getCategory,
        getVariant,
        getVariants,
        getStockEntries,
        getTotalStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventoryContext must be used within an InventoryProvider");
  }
  return context;
}

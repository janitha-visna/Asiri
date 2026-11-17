// features/data-entry/components/sections/ServiceList.tsx
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ProductBrandDto, ProductDto } from "../../data-entry.types";
import { useDataEntryContext } from "../../DataEntryContext";
import { useProducts } from "../../hooks/queries";
import { ProductQuantityModal } from "./ProductQuantityModal";

type SelectedBrandEntry = {
  brandId: number;
  measurementOptionId: number;
  unit: string;
  quantity: number;
};

const ProductCard = React.memo(function ProductCard({
  product,
  selectedBrands,
  onPressBrand,
}: {
  product: ProductDto;
  selectedBrands?: Record<number, SelectedBrandEntry>;
  onPressBrand: (product: ProductDto, brand: ProductBrandDto) => void;
}) {
  const selectedCount = Object.keys(selectedBrands ?? {}).length;
  const isProductSelected = selectedCount > 0;

  return (
    <View
      className={`rounded-lg border p-3 gap-2.5 ${
        isProductSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-background"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-foreground">{product.name}</Text>
        {isProductSelected && (
          <Text className="text-xs font-semibold text-primary">
            {selectedCount} selected
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2">
        {product.brands.map((brand) => {
          const selectedBrand = selectedBrands?.[brand.id];
          const isBrandSelected = Boolean(selectedBrand);
          const unitLabel = brand.measurementOptions
            .map((m) => m.unit)
            .join(", ");

          return (
            <Pressable
              key={brand.id}
              onPress={() => onPressBrand(product, brand)}
              className={`rounded-md border px-3 py-1.5 ${
                isBrandSelected
                  ? "border-primary bg-primary"
                  : "border-border bg-card"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isBrandSelected
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {brand.name}
                {selectedBrand
                  ? ` • ${selectedBrand.quantity} ${selectedBrand.unit}`
                  : unitLabel
                    ? ` (${unitLabel})`
                    : ""}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

export function ServiceList() {
  const { draft, dispatch } = useDataEntryContext();
  const { data: products = [], isLoading: isProductsLoading } = useProducts();

  const [qtyModalTarget, setQtyModalTarget] = useState<{
    product: ProductDto;
    brand: ProductBrandDto;
  } | null>(null);

  const handlePressBrand = useCallback(
    (product: ProductDto, brand: ProductBrandDto) => {
      setQtyModalTarget({ product, brand });
    },
    [],
  );

  const handleConfirmProductQty = useCallback(
    (payload: {
      productId: number;
      brandId: number;
      measurementOptionId: number;
      unit: string;
      quantity: number;
    }) => {
      dispatch({ type: "PRODUCT_SELECTED", ...payload });
    },
    [dispatch],
  );

  const handleRemoveProduct = useCallback(
    (productId: number, brandId: number) => {
      dispatch({ type: "PRODUCT_REMOVED", productId, brandId });
    },
    [dispatch],
  );

  const handleResetProducts = useCallback(() => {
    dispatch({ type: "PRODUCTS_RESET" });
  }, [dispatch]);

  const selectedProductCount = Object.values(draft.products).reduce(
    (sum, brands) => sum + Object.keys(brands).length,
    0,
  );

  const activeSelection = qtyModalTarget
    ? draft.products[qtyModalTarget.product.id]?.[qtyModalTarget.brand.id]
    : undefined;

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          6. Products & Parts
        </Text>
        <View className="flex-row items-center gap-2">
          {selectedProductCount > 0 && (
            <Pressable
              onPress={handleResetProducts}
              className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5"
            >
              <Text className="text-xs font-semibold text-destructive">
                Reset
              </Text>
            </Pressable>
          )}
          {isProductsLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View className="rounded-full bg-primary/10 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-primary">
                {selectedProductCount} Selected
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedBrands={draft.products[product.id]}
            onPressBrand={handlePressBrand}
          />
        ))}
      </View>

      {/* Product Quantity Modal */}
      <ProductQuantityModal
        visible={Boolean(qtyModalTarget)}
        product={qtyModalTarget?.product ?? null}
        brand={qtyModalTarget?.brand ?? null}
        initialQuantity={activeSelection?.quantity}
        initialMeasurementOptionId={activeSelection?.measurementOptionId}
        onClose={() => setQtyModalTarget(null)}
        onConfirm={handleConfirmProductQty}
        onRemove={handleRemoveProduct}
      />
    </View>
  );
}

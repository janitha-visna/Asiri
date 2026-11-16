// features/data-entry/components/sections/ServiceList.tsx
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ProductBrandDto, ProductDto } from "../../data-entry.types";
import { useDataEntryContext } from "../../DataEntryContext";
import { useProducts } from "../../hooks/queries";
import { ProductQuantityModal } from "./ProductQuantityModal";

const ProductCard = React.memo(function ProductCard({
  product,
  selectedProduct,
  onPressBrand,
}: {
  product: ProductDto;
  selectedProduct?: {
    brandId: number;
    measurementOptionId: number;
    unit: string;
    quantity: number;
  };
  onPressBrand: (product: ProductDto, brand: ProductBrandDto) => void;
}) {
  const isProductSelected = Boolean(selectedProduct);

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
        {selectedProduct && (
          <Text className="text-xs font-semibold text-primary">
            {selectedProduct.quantity} {selectedProduct.unit}
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2">
        {product.brands.map((brand) => {
          const isBrandSelected = selectedProduct?.brandId === brand.id;
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
                {isBrandSelected && selectedProduct
                  ? ` • ${selectedProduct.quantity} ${selectedProduct.unit}`
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
    (productId: number) => {
      dispatch({ type: "PRODUCT_REMOVED", productId });
    },
    [dispatch],
  );

  const selectedProductCount = Object.keys(draft.products).length;

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          6. Products & Parts
        </Text>
        <View className="flex-row items-center gap-2">
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
            selectedProduct={draft.products[product.id]}
            onPressBrand={handlePressBrand}
          />
        ))}
      </View>

      {/* Product Quantity Modal */}
      <ProductQuantityModal
        visible={Boolean(qtyModalTarget)}
        product={qtyModalTarget?.product ?? null}
        brand={qtyModalTarget?.brand ?? null}
        initialQuantity={
          qtyModalTarget &&
          draft.products[qtyModalTarget.product.id]?.brandId ===
            qtyModalTarget.brand.id
            ? draft.products[qtyModalTarget.product.id]?.quantity
            : undefined
        }
        initialMeasurementOptionId={
          qtyModalTarget &&
          draft.products[qtyModalTarget.product.id]?.brandId ===
            qtyModalTarget.brand.id
            ? draft.products[qtyModalTarget.product.id]?.measurementOptionId
            : undefined
        }
        onClose={() => setQtyModalTarget(null)}
        onConfirm={handleConfirmProductQty}
        onRemove={handleRemoveProduct}
      />
    </View>
  );
}

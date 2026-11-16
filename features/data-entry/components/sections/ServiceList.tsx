// features/data-entry/components/sections/ServiceList.tsx
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
//import { Text } from "@/components/ui/text";
import type {
  AvailableServiceDto,
  ComponentDto,
  ProductBrandDto,
  ProductDto,
} from "../../data-entry.types";
import { useDataEntryContext } from "../../DataEntryContext";
import { useAvailableServices, useProducts } from "../../hooks/queries";
import { PartPickerModal } from "./PartPickerModal";
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

  const vehicleTypeId = draft.vehicle.vehicleTypeId;

  const { data: services = [], isLoading } = useAvailableServices(
    vehicleTypeId ?? undefined,
  );

  // State to manage active PartPickerModal
  const [activePicker, setActivePicker] = useState<{
    serviceId: string;
    component: ComponentDto;
  } | null>(null);

  const handleToggleService = (serviceId: string) => {
    dispatch({ type: "SERVICE_TOGGLED", serviceId });
  };

  const selectedCount = Object.keys(draft.services).length;

  // if (!vehicleTypeId) {
  //   return (
  //     <View className="rounded-xl border border-border bg-card p-5 items-center gap-2">
  //       <Text className="text-base font-bold text-muted-foreground">
  //         6. Services Checklist
  //       </Text>
  //       <Text className="text-xs text-center text-muted-foreground">
  //         Please select a vehicle category and type above to see services.
  //       </Text>
  //     </View>
  //   );
  // }
  const { data: products = [], isLoading: isProductsLoading } = useProducts();

  const [qtyModalTarget, setQtyModalTarget] = useState<{
    product: ProductDto;
    brand: ProductBrandDto;
  } | null>(null);

  const handlePressBrand = useCallback(
    (product: ProductDto, brand: ProductBrandDto) => {
      setQtyModalTarget({ product, brand });
    },
    []
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
    [dispatch]
  );

  const handleRemoveProduct = useCallback(
    (productId: number) => {
      dispatch({ type: "PRODUCT_REMOVED", productId });
    },
    [dispatch]
  );

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          6. Services Checklist
        </Text>
        <View className="flex-row items-center gap-2">
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View className="rounded-full bg-primary/10 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-primary">
                {selectedCount} Selected
              </Text>
            </View>
          )}
        </View>
      </View>

      {services.length === 0 && !isLoading ? (
        <Text className="py-4 text-center text-xs text-muted-foreground">
          No services configured for this vehicle type and package.
        </Text>
      ) : (
        <View className="gap-3">
          {services.map((service: AvailableServiceDto) => {
            const isSelected = Boolean(draft.services[service.id]);
            const selectedServiceState = draft.services[service.id];

            return (
              <View
                key={service.id}
                className={`rounded-lg border p-3 gap-2.5 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                {/* Service Header Row */}
                <Pressable
                  onPress={() => handleToggleService(service.id)}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                    {/* Checkbox indicator */}
                    <View
                      className={`h-5 w-5 rounded items-center justify-center border ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-xs font-bold text-primary-foreground">
                          ✓
                        </Text>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">
                        {service.name}
                      </Text>
                    </View>
                  </View>

                  {service.basePrice !== null && (
                    <Text className="text-xs font-semibold text-foreground">
                      Rs. {Number(service.basePrice).toLocaleString()}
                    </Text>
                  )}
                </Pressable>

                {/* If selected and requires parts: Component brand pickers */}
                {isSelected &&
                  service.requiresPartSelection &&
                  service.components.length > 0 && (
                    <View className="gap-2 pt-2 border-t border-border/60">
                      <Text className="text-xs font-medium text-muted-foreground">
                        Required Part Selections:
                      </Text>
                      {service.components.map((comp) => {
                        const selectedPartId =
                          selectedServiceState?.partIdsByComponent[comp.id];

                        return (
                          <View
                            key={comp.id}
                            className="flex-row items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                          >
                            <Text className="text-xs font-semibold text-foreground flex-1 pr-2">
                              {comp.name}
                            </Text>

                            <Pressable
                              onPress={() =>
                                setActivePicker({
                                  serviceId: service.id,
                                  component: comp,
                                })
                              }
                              className={`rounded px-2.5 py-1 border ${
                                selectedPartId
                                  ? "border-emerald-500 bg-emerald-500/10"
                                  : "border-amber-500 bg-amber-500/10"
                              }`}
                            >
                              <Text
                                className={`text-xs font-semibold ${
                                  selectedPartId
                                    ? "text-emerald-700 dark:text-emerald-400"
                                    : "text-amber-700 dark:text-amber-400"
                                }`}
                              >
                                {selectedPartId
                                  ? "Brand Selected ✓"
                                  : "Choose Brand ⚠"}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  )}
              </View>
            );
          })}
        </View>
      )}

      {/* Products / Parts Checklist from GET /products */}
      <View className="gap-3 pt-2 border-t border-border/60">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-foreground">
            Products & Parts
          </Text>
          {isProductsLoading && <ActivityIndicator size="small" />}
        </View>

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

      {/* Part Picker Modal */}
      {activePicker && vehicleTypeId && (
        <PartPickerModal
          visible={Boolean(activePicker)}
          onClose={() => setActivePicker(null)}
          serviceId={activePicker.serviceId}
          component={activePicker.component}
          vehicleTypeId={vehicleTypeId}
        />
      )}
    </View>
  );
}

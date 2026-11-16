// features/data-entry/components/sections/ProductQuantityModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  MeasurementOptionDto,
  ProductBrandDto,
  ProductDto,
} from "../../data-entry.types";

type ProductQuantityModalProps = {
  visible: boolean;
  product: ProductDto | null;
  brand: ProductBrandDto | null;
  initialQuantity?: number;
  initialMeasurementOptionId?: number;
  onClose: () => void;
  onConfirm: (payload: {
    productId: number;
    brandId: number;
    measurementOptionId: number;
    unit: string;
    quantity: number;
  }) => void;
  onRemove?: (productId: number, brandId: number) => void;
};

export function ProductQuantityModal({
  visible,
  product,
  brand,
  initialQuantity,
  initialMeasurementOptionId,
  onClose,
  onConfirm,
  onRemove,
}: ProductQuantityModalProps) {
  const options = brand?.measurementOptions ?? [];
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [qtyInput, setQtyInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && brand) {
      const opts = brand.measurementOptions ?? [];
      const defaultOpt =
        opts.find((o) => o.id === initialMeasurementOptionId) ?? opts[0];
      setSelectedOptionId(defaultOpt?.id ?? null);
      setQtyInput(initialQuantity ? String(initialQuantity) : "");
      setError(null);
    }
  }, [visible, brand, initialQuantity, initialMeasurementOptionId]);

  if (!product || !brand) return null;

  const activeOption: MeasurementOptionDto | undefined =
    options.find((o) => o.id === selectedOptionId) ?? options[0];

  const allowDecimal = activeOption?.allowDecimal ?? false;
  const unitLabel = activeOption?.unit ?? "Units";

  const handleChangeText = (text: string) => {
    setError(null);
    if (allowDecimal) {
      const cleaned = text
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
      setQtyInput(cleaned);
    } else {
      setQtyInput(text.replace(/[^0-9]/g, ""));
    }
  };

  const handleSave = () => {
    if (!activeOption) return;
    const parsed = Number(qtyInput);
    if (!qtyInput.trim() || isNaN(parsed) || parsed <= 0) {
      setError(`Please enter a valid quantity in ${unitLabel}.`);
      return;
    }

    onConfirm({
      productId: product.id,
      brandId: brand.id,
      measurementOptionId: activeOption.id,
      unit: activeOption.unit,
      quantity: parsed,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center bg-black/50 px-5"
      >
        <View className="rounded-2xl border border-border bg-card p-5 gap-4 shadow-lg">
          <View>
            <Text className="text-base font-bold text-foreground">
              {product.name} — {brand.name}
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
              Enter quantity in {unitLabel}
              {allowDecimal
                ? " (decimals allowed, e.g. 3.5)"
                : " (whole numbers)"}
            </Text>
          </View>

          {options.length > 1 && (
            <View className="flex-row flex-wrap gap-2">
              {options.map((opt) => {
                const isActive = opt.id === activeOption?.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => {
                      setSelectedOptionId(opt.id);
                      setQtyInput("");
                      setError(null);
                    }}
                    className={`rounded-md border px-3 py-1.5 ${
                      isActive
                        ? "border-primary bg-primary"
                        : "border-border bg-background"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isActive ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {opt.unit}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View className="gap-1.5">
            <Text className="text-xs font-medium text-muted-foreground">
              Quantity ({unitLabel})
            </Text>
            <Input
              autoFocus
              value={qtyInput}
              onChangeText={handleChangeText}
              keyboardType={allowDecimal ? "decimal-pad" : "number-pad"}
              placeholder={
                allowDecimal ? `e.g. 3.5 ${unitLabel}` : `e.g. 1 ${unitLabel}`
              }
            />
            {error && (
              <Text className="text-xs font-medium text-destructive">
                {error}
              </Text>
            )}
          </View>

          <View className="flex-row items-center justify-end gap-2 pt-1">
            {initialQuantity !== undefined && onRemove && (
              <Button
                variant="destructive"
                size="sm"
                onPress={() => {
                  onRemove(product.id, brand.id);
                  onClose();
                }}
                className="mr-auto"
              >
                <Text className="text-xs font-semibold text-white">Remove</Text>
              </Button>
            )}

            <Button variant="outline" size="sm" onPress={handleClose(onClose)}>
              <Text className="text-xs font-semibold text-foreground">
                Cancel
              </Text>
            </Button>

            <Button size="sm" onPress={handleSave}>
              <Text className="text-xs font-semibold text-primary-foreground">
                Confirm
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function handleClose(onClose: () => void) {
  return onClose;
}

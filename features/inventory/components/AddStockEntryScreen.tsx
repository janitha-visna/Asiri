import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { formatDateLabel } from "../inventory.constants";
import { useInventoryContext } from "../InventoryContext";
import { InventoryScreenHeader } from "./InventoryScreenHeader";

export function AddStockEntryScreen() {
  const { categoryId, variantId } = useLocalSearchParams<{
    categoryId: string;
    variantId?: string;
  }>();
  const { getCategory, getVariant, addStockEntry } = useInventoryContext();

  const category = getCategory(categoryId);
  const variant = variantId ? getVariant(variantId) : undefined;

  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!category || (variantId && !variant)) {
    return (
      <View className="flex-1 bg-background">
        <InventoryScreenHeader title="Not Found" mode="close" />
      </View>
    );
  }

  const ownerId = variant?.id ?? category.id;
  const ownerName = variant?.name ?? category.name;

  const handleSave = () => {
    const quantityValue = Number(quantity);
    if (quantity.trim() === "" || Number.isNaN(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    const purchaseValue =
      purchasePrice.trim() === "" ? undefined : Number(purchasePrice);
    if (purchaseValue !== undefined && Number.isNaN(purchaseValue)) {
      setError("Purchase price must be a valid number.");
      return;
    }

    const sellingValue =
      sellingPrice.trim() === "" ? undefined : Number(sellingPrice);
    if (sellingValue !== undefined && Number.isNaN(sellingValue)) {
      setError("Selling price must be a valid number.");
      return;
    }

    addStockEntry(ownerId, {
      quantity: quantityValue,
      purchasePrice: purchaseValue,
      sellingPrice: sellingValue,
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <InventoryScreenHeader title={`Add Stock — ${ownerName}`} mode="close" />
      <ScrollView className="flex-1 p-4" contentContainerClassName="gap-5">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Date</Text>
          <View className="rounded-md border border-input bg-muted px-3 py-2">
            <Text className="text-base text-muted-foreground">
              {formatDateLabel(new Date())}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Stock Quantity ({category.unit})
          </Text>
          <Input
            placeholder="e.g., 50"
            value={quantity}
            onChangeText={(value) => {
              setQuantity(value);
              setError(null);
            }}
            keyboardType="numeric"
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Purchase Price (Optional)
          </Text>
          <Input
            placeholder="e.g., 4500"
            value={purchasePrice}
            onChangeText={(value) => {
              setPurchasePrice(value);
              setError(null);
            }}
            keyboardType="numeric"
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Selling Price (Optional)
          </Text>
          <Input
            placeholder="e.g., 5000"
            value={sellingPrice}
            onChangeText={(value) => {
              setSellingPrice(value);
              setError(null);
            }}
            keyboardType="numeric"
          />
        </View>

        {error && (
          <Text className="text-sm font-medium text-destructive">{error}</Text>
        )}

        <View className="gap-3">
          <Button
            variant="default"
            size="lg"
            onPress={handleSave}
            className="w-full bg-green-600"
          >
            Save
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onPress={() => router.back()}
            className="w-full bg-red-600"
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

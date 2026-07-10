import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useInventoryContext } from "../InventoryContext";
import { InventoryScreenHeader } from "./InventoryScreenHeader";

export function AddVariantScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { getCategory, addVariant } = useInventoryContext();
  const category = getCategory(categoryId);

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!category) {
    return (
      <View className="flex-1 bg-background">
        <InventoryScreenHeader title="Category Not Found" mode="close" />
      </View>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a variant name.");
      return;
    }
    const stockValue = Number(stock);
    if (stock.trim() === "" || Number.isNaN(stockValue) || stockValue < 0) {
      setError("Please enter a valid initial stock quantity.");
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

    addVariant(category.id, {
      name: name.trim(),
      initialStock: stockValue,
      purchasePrice: purchaseValue,
      sellingPrice: sellingValue,
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <InventoryScreenHeader title={`Add ${category.name} Variant`} mode="close" />
      <ScrollView className="flex-1 p-4" contentContainerClassName="gap-5">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Variant Name
          </Text>
          <Input
            placeholder="e.g., Laugh DS40"
            value={name}
            onChangeText={(value) => {
              setName(value);
              setError(null);
            }}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Initial Stock Quantity ({category.unit})
          </Text>
          <Input
            placeholder="e.g., 50"
            value={stock}
            onChangeText={(value) => {
              setStock(value);
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

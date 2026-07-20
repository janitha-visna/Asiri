import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { formatDateLabel } from "../inventory.constants";
import { useInventoryContext } from "../InventoryContext";
import { InventoryScreenHeader } from "./InventoryScreenHeader";

export function ReduceStockScreen() {
  const { categoryId, variantId } = useLocalSearchParams<{
    categoryId: string;
    variantId?: string;
  }>();
  const { getCategory, getVariant, getTotalStock, reduceStock } =
    useInventoryContext();

  const category = getCategory(categoryId);
  const variant = variantId ? getVariant(variantId) : undefined;

  const [date, setDate] = useState(new Date());
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!category || (variantId && !variant)) {
    return (
      <View className="flex-1 bg-background">
        <InventoryScreenHeader title="Not Found" mode="close" />
      </View>
    );
  }

  const ownerId = variant?.id ?? category.id;
  const ownerName = variant?.name ?? category.name;
  const currentStock = getTotalStock(ownerId);

  const handleReduce = () => {
    setSaved(false);

    const quantityValue = Number(quantity);
    if (quantity.trim() === "" || Number.isNaN(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid quantity used.");
      return;
    }
    if (quantityValue > currentStock) {
      setError(
        `Quantity exceeds available stock. Current stock: ${currentStock.toLocaleString()} ${category.unit}.`
      );
      return;
    }

    reduceStock(ownerId, { quantity: quantityValue, date });
    setQuantity("");
    setError(null);
    setSaved(true);
  };

  return (
    <View className="flex-1 bg-background">
      <InventoryScreenHeader title={`Reduce Stock — ${ownerName}`} mode="close" />
      <ScrollView className="flex-1 p-4" contentContainerClassName="gap-5">
        <View className="rounded-lg bg-primary/10 p-3">
          <Text className="text-xs font-medium text-muted-foreground">
            Current Available Stock
          </Text>
          <Text className="text-lg font-bold text-primary">
            {currentStock.toLocaleString()} {category.unit}
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Date</Text>
          <View className="rounded-lg bg-muted/40 p-3">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              {formatDateLabel(date)}
            </Text>
            <Calendar
              value={date}
              onDateSelect={(selected) => {
                setDate(selected);
                setSaved(false);
              }}
            />
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Quantity Used ({category.unit})
          </Text>
          <Input
            placeholder="e.g., 10"
            value={quantity}
            onChangeText={(value) => {
              setQuantity(value);
              setError(null);
              setSaved(false);
            }}
            keyboardType="numeric"
          />
        </View>

        {error && (
          <Text className="text-sm font-medium text-destructive">{error}</Text>
        )}
        {saved && !error && (
          <Text className="text-sm font-medium text-green-600">
            Stock usage recorded successfully.
          </Text>
        )}

        <View className="gap-3">
          <Button
            variant="default"
            size="lg"
            onPress={handleReduce}
            className="w-full bg-green-600"
          >
            Reduce Stock
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

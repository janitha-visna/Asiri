import { View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { InventoryUnit, StockEntry } from "../inventory.types";

export function StockEntryCard({
  entry,
  unit,
}: {
  entry: StockEntry;
  unit: InventoryUnit;
}) {
  const isUsage = entry.type === "usage";

  return (
    <Card>
      <CardContent className="gap-1 p-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-foreground">
            {entry.dateLabel}
          </Text>
          <Text
            className={
              isUsage
                ? "text-xs font-semibold text-red-600"
                : "text-xs font-semibold text-green-600"
            }
          >
            {isUsage ? "Usage" : "Added"}
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground">
          {isUsage ? "Quantity Used" : "Quantity Added"}:{" "}
          {isUsage ? "-" : "+"}
          {entry.quantity.toLocaleString()} {unit}
        </Text>
        {(entry.purchasePrice !== undefined ||
          entry.sellingPrice !== undefined) && (
          <View className="flex-row flex-wrap gap-x-4">
            {entry.purchasePrice !== undefined && (
              <Text className="text-xs text-muted-foreground">
                Purchase: {entry.purchasePrice.toLocaleString()}
              </Text>
            )}
            {entry.sellingPrice !== undefined && (
              <Text className="text-xs text-muted-foreground">
                Selling: {entry.sellingPrice.toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

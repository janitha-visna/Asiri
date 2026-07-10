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
  return (
    <Card>
      <CardContent className="gap-1 p-3">
        <Text className="text-sm font-semibold text-foreground">
          {entry.dateLabel}
        </Text>
        <Text className="text-xs text-muted-foreground">
          Quantity Added: {entry.quantity.toLocaleString()} {unit}
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

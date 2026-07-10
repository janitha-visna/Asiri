import { Pressable } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useInventoryContext } from "../InventoryContext";
import type { InventoryUnit, InventoryVariant } from "../inventory.types";

export function VariantCard({
  variant,
  unit,
  onPress,
}: {
  variant: InventoryVariant;
  unit: InventoryUnit;
  onPress: () => void;
}) {
  const { getTotalStock } = useInventoryContext();
  const totalStock = getTotalStock(variant.id);

  return (
    <Pressable onPress={onPress}>
      <Card>
        <CardContent className="gap-1 p-3">
          <Text className="text-sm font-semibold text-foreground">
            {variant.name}
          </Text>
          <Text className="text-xs text-muted-foreground">
            Current Stock: {totalStock.toLocaleString()} {unit}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );
}

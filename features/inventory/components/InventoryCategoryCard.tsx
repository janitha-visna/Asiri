import { Pressable } from "react-native";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { InventoryCategory } from "../inventory.types";

export function InventoryCategoryCard({
  category,
  onPress,
}: {
  category: InventoryCategory;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="w-[48%]">
      <Card>
        <CardContent className="gap-1.5 p-4">
          <CardTitle className="text-base font-semibold text-foreground">
            {category.name}
          </CardTitle>
          <Text className="text-xs text-muted-foreground">
            {category.hasVariants ? "Has variants" : "No variants"}
          </Text>
          <Text className="text-xs text-muted-foreground">
            Unit: {category.unit}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );
}

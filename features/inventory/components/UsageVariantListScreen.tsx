import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useInventoryContext } from "../InventoryContext";
import { InventoryScreenHeader } from "./InventoryScreenHeader";
import { VariantCard } from "./VariantCard";

export function UsageVariantListScreen() {
  const insets = useSafeAreaInsets();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { getCategory, getVariants } = useInventoryContext();

  const category = getCategory(categoryId);

  // Non-variant categories reduce stock directly; redirect defensively.
  useEffect(() => {
    if (category && !category.hasVariants) {
      router.replace({
        pathname: "/inventory-usage/[categoryId]/reduce",
        params: { categoryId: category.id },
      });
    }
  }, [category]);

  if (!category) {
    return (
      <View className="flex-1 bg-background">
        <InventoryScreenHeader title="Category Not Found" />
      </View>
    );
  }

  if (!category.hasVariants) {
    return <View className="flex-1 bg-background" />;
  }

  const variants = getVariants(category.id);

  return (
    <View className="flex-1 bg-background">
      <InventoryScreenHeader
        title={category.name}
        subtitle="Select a variant to record usage"
      />
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {variants.length === 0 ? (
          <Text className="text-sm text-muted-foreground">
            No variants available yet. Add one from the Inventory screen
            first.
          </Text>
        ) : (
          <View className="gap-2">
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                unit={category.unit}
                onPress={() =>
                  router.push({
                    pathname: "/inventory-usage/[categoryId]/reduce",
                    params: { categoryId: category.id, variantId: variant.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

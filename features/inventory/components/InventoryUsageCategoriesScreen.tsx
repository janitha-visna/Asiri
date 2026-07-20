import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useInventoryContext } from "../InventoryContext";
import { InventoryCategoryCard } from "./InventoryCategoryCard";

export function InventoryUsageCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { categories } = useInventoryContext();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 p-3"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text className="mb-3 px-1 text-xs text-muted-foreground">
          Select an item to record stock usage.
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {categories.map((category) => (
            <InventoryCategoryCard
              key={category.id}
              category={category}
              onPress={() =>
                category.hasVariants
                  ? router.push({
                      pathname: "/inventory-usage/[categoryId]",
                      params: { categoryId: category.id },
                    })
                  : router.push({
                      pathname: "/inventory-usage/[categoryId]/reduce",
                      params: { categoryId: category.id },
                    })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

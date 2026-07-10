import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInventoryContext } from "../InventoryContext";
import { FloatingAddButton } from "./FloatingAddButton";
import { InventoryCategoryCard } from "./InventoryCategoryCard";

export function InventoryCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { categories } = useInventoryContext();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 p-3"
        contentContainerClassName="pb-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <View className="flex-row flex-wrap gap-3">
          {categories.map((category) => (
            <InventoryCategoryCard
              key={category.id}
              category={category}
              onPress={() =>
                category.hasVariants
                  ? router.push({
                      pathname: "/inventory/[categoryId]",
                      params: { categoryId: category.id },
                    })
                  : router.push({
                      pathname: "/inventory/[categoryId]/stock",
                      params: { categoryId: category.id },
                    })
              }
            />
          ))}
        </View>
      </ScrollView>

      <FloatingAddButton onPress={() => router.push("/inventory/create")} />
    </View>
  );
}

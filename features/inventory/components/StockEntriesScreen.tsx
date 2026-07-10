import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useInventoryContext } from "../InventoryContext";
import { FloatingAddButton } from "./FloatingAddButton";
import { InventoryScreenHeader } from "./InventoryScreenHeader";
import { StockEntryCard } from "./StockEntryCard";

export function StockEntriesScreen() {
  const insets = useSafeAreaInsets();
  const { categoryId, variantId } = useLocalSearchParams<{
    categoryId: string;
    variantId?: string;
  }>();
  const { getCategory, getVariant, getStockEntries, getTotalStock } =
    useInventoryContext();

  const category = getCategory(categoryId);
  const variant = variantId ? getVariant(variantId) : undefined;

  if (!category || (variantId && !variant)) {
    return (
      <View className="flex-1 bg-background">
        <InventoryScreenHeader title="Not Found" />
      </View>
    );
  }

  const ownerId = variant?.id ?? category.id;
  const ownerName = variant?.name ?? category.name;
  const entries = getStockEntries(ownerId);
  const totalStock = getTotalStock(ownerId);

  return (
    <View className="flex-1 bg-background">
      <InventoryScreenHeader
        title={ownerName}
        subtitle={`Current Stock: ${totalStock.toLocaleString()} ${category.unit}`}
      />
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <Text className="mb-3 text-xs font-medium uppercase text-muted-foreground">
          Stock Entries
        </Text>

        {entries.length === 0 ? (
          <Text className="text-sm text-muted-foreground">
            No stock entries recorded yet. Tap + to record the initial stock
            entry.
          </Text>
        ) : (
          <View className="gap-2">
            {entries.map((entry) => (
              <StockEntryCard key={entry.id} entry={entry} unit={category.unit} />
            ))}
          </View>
        )}
      </ScrollView>

      <FloatingAddButton
        onPress={() =>
          router.push({
            pathname: "/inventory/[categoryId]/add-stock",
            params: variantId ? { categoryId, variantId } : { categoryId },
          })
        }
      />
    </View>
  );
}

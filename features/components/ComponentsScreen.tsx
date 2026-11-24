import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useProducts } from "@/features/data-entry/hooks/queries";

export function ComponentsScreen() {
  const insets = useSafeAreaInsets();
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="gap-1">
        <Text className="text-lg font-bold text-foreground">
          Components & Brands
        </Text>
        <Text className="text-xs text-muted-foreground">
          Available product categories, brands, and measurement units
        </Text>
      </View>

      {isLoading && (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-xs text-muted-foreground">
            Loading components...
          </Text>
        </View>
      )}

      {isError && (
        <View className="items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
          <Text className="text-sm font-semibold text-destructive">
            Failed to load components.
          </Text>
          <Button variant="outline" size="sm" onPress={() => refetch()}>
            <Text className="text-xs font-semibold text-foreground">Retry</Text>
          </Button>
        </View>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <View className="items-center rounded-xl border border-border bg-card p-6 shadow-sm">
          <Text className="text-sm text-muted-foreground">
            No components found.
          </Text>
        </View>
      )}

      {!isLoading &&
        !isError &&
        products.map((category) => (
          <View
            key={category.id}
            className="rounded-xl border border-border bg-card p-4 gap-3 shadow-sm"
          >
            <View className="flex-row items-center justify-between border-b border-border pb-2">
              <Text className="text-base font-bold text-foreground">
                {category.name}
              </Text>
              <View className="rounded-full bg-primary/10 px-2.5 py-0.5">
                <Text className="text-xs font-semibold text-primary">
                  {category.brands.length}{" "}
                  {category.brands.length === 1 ? "Brand" : "Brands"}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              {category.brands.map((brand) => (
                <View
                  key={brand.id}
                  className="flex-row items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5"
                >
                  <Text className="text-sm font-semibold text-foreground">
                    {brand.name}
                  </Text>

                  <View className="flex-row flex-wrap gap-1.5">
                    {brand.measurementOptions.map((opt) => (
                      <View
                        key={opt.id}
                        className="rounded-md bg-muted px-2 py-0.5"
                      >
                        <Text className="text-xs font-medium text-muted-foreground">
                          {opt.unit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

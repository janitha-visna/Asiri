// features/service-pricing/components/ServicePricingMaster.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MOCK_PRICING_CATEGORIES,
  MOCK_PRICING_VEHICLE_TYPES,
  MOCK_SERVICE_PACKAGES,
  INITIAL_PACKAGE_PRICES,
} from "../service-pricing.mocks";

// Vehicle Category Icons/Emojis helper
function getCategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("motorcycle")) return "🏍️";
  if (lower.includes("car")) return "🚗";
  if (lower.includes("cab")) return "🚕";
  if (lower.includes("van")) return "🚐";
  if (lower.includes("bus")) return "🚌";
  if (lower.includes("lorry")) return "🚛";
  if (lower.includes("tipper")) return "🚜";
  if (lower.includes("commercial")) return "🚚";
  return "🚘";
}

export function ServicePricingMaster() {
  const insets = useSafeAreaInsets();

  // Active Category (defaults to "Car" or first category)
  const defaultCategory =
    MOCK_PRICING_CATEGORIES.find((c) => c.name.toLowerCase() === "car") ??
    MOCK_PRICING_CATEGORIES[0];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    defaultCategory.id
  );

  // In-memory base price state map: Key = `${vehicleTypeId}:${servicePackageId}` -> basePrice (string | null)
  const [prices, setPrices] = useState<Record<string, string | null>>(
    () => ({ ...INITIAL_PACKAGE_PRICES })
  );

  // Modal edit state
  const [editingItem, setEditingItem] = useState<{
    vehicleTypeId: string;
    vehicleTypeName: string;
    packageId: string;
    packageName: string;
    currentPrice: string | null;
  } | null>(null);

  const [editPriceInput, setEditPriceInput] = useState<string>("");

  // Filter vehicle types by active category
  const filteredVehicleTypes = MOCK_PRICING_VEHICLE_TYPES.filter(
    (vt) => vt.categoryId === selectedCategoryId
  );

  const handleOpenEdit = (
    vehicleTypeId: string,
    vehicleTypeName: string,
    packageId: string,
    packageName: string,
    currentPrice: string | null
  ) => {
    setEditingItem({
      vehicleTypeId,
      vehicleTypeName,
      packageId,
      packageName,
      currentPrice,
    });
    setEditPriceInput(currentPrice ?? "");
  };

  const handleSavePrice = () => {
    if (!editingItem) return;
    const cleanPrice = editPriceInput.trim();
    if (cleanPrice && !isNaN(Number(cleanPrice))) {
      const formatted = Number(cleanPrice).toFixed(2);
      setPrices((prev) => ({
        ...prev,
        [`${editingItem.vehicleTypeId}:${editingItem.packageId}`]: formatted,
      }));
    } else if (cleanPrice === "") {
      // If cleared, mark as unspecified
      setPrices((prev) => ({
        ...prev,
        [`${editingItem.vehicleTypeId}:${editingItem.packageId}`]: null,
      }));
    }
    setEditingItem(null);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Screen Header */}
      <View className="border-b border-border bg-card px-4 py-3">
        <Text className="text-xl font-black tracking-tight text-foreground">
          Service Pricing Master
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">
          Base package rates per vehicle type (in LKR)
        </Text>
      </View>

      {/* Horizontal Category Tabs */}
      <View className="border-b border-border bg-card/60">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-3 py-2.5 gap-2 items-center"
        >
          {MOCK_PRICING_CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${
                  isSelected
                    ? "bg-primary border-primary shadow-sm"
                    : "bg-card border-border active:bg-muted"
                }`}
              >
                <Text className="text-sm">{getCategoryEmoji(cat.name)}</Text>
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? "text-primary-foreground font-bold" : "text-foreground"
                  }`}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Vehicle Types and Pricing Tables */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {filteredVehicleTypes.length === 0 ? (
          <View className="rounded-xl border border-dashed border-border bg-card p-8 items-center justify-center">
            <Text className="text-muted-foreground text-sm">
              No vehicle types registered under this category.
            </Text>
          </View>
        ) : (
          filteredVehicleTypes.map((vt) => {
            const categoryObj = MOCK_PRICING_CATEGORIES.find(
              (c) => c.id === vt.categoryId
            );
            const emoji = getCategoryEmoji(categoryObj?.name ?? "");

            return (
              <View
                key={vt.id}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
              >
                {/* Vehicle Type Card Header */}
                <View className="flex-row items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xl">{emoji}</Text>
                    <View>
                      <Text className="text-sm font-black tracking-wide text-foreground uppercase">
                        {vt.name}
                      </Text>
                      {vt.description ? (
                        <Text className="text-[11px] text-muted-foreground mt-0.5">
                          {vt.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View className="rounded-md bg-secondary px-2 py-0.5">
                    <Text className="text-[10px] font-semibold text-secondary-foreground">
                      {MOCK_SERVICE_PACKAGES.length} Packages
                    </Text>
                  </View>
                </View>

                {/* Table Header */}
                <View className="flex-row items-center border-b border-border bg-muted/20 px-4 py-2">
                  <Text className="flex-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Service Package
                  </Text>
                  <Text className="w-36 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Base Price (LKR)
                  </Text>
                </View>

                {/* Service Package Pricing Rows */}
                <View className="divide-y divide-border">
                  {MOCK_SERVICE_PACKAGES.map((pkg) => {
                    const priceKey = `${vt.id}:${pkg.id}`;
                    const currentPrice = prices[priceKey] ?? null;
                    const hasPrice = currentPrice !== null && currentPrice !== undefined;
                    const numPrice = hasPrice ? Number(currentPrice) : null;

                    return (
                      <View
                        key={pkg.id}
                        className="flex-row items-center justify-between px-4 py-3"
                      >
                        {/* Package Title & Description */}
                        <View className="flex-1 pr-3">
                          <Text className="text-sm font-semibold text-foreground">
                            {pkg.name}
                          </Text>
                          <Text className="text-[11px] text-muted-foreground mt-0.5">
                            {pkg.description}
                          </Text>
                        </View>

                        {/* Price Badge / Edit Action */}
                        <Pressable
                          onPress={() =>
                            handleOpenEdit(
                              vt.id,
                              vt.name,
                              pkg.id,
                              pkg.name,
                              currentPrice
                            )
                          }
                          className={`flex-row items-center justify-end gap-1.5 rounded-lg border px-3 py-1.5 active:opacity-80 ${
                            hasPrice
                              ? "border-border bg-muted/50"
                              : "border-dashed border-amber-500/50 bg-amber-500/10"
                          }`}
                        >
                          {hasPrice ? (
                            <Text className="text-sm font-bold text-foreground">
                              Rs.{" "}
                              {numPrice !== null && !isNaN(numPrice)
                                ? numPrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : currentPrice}
                            </Text>
                          ) : (
                            <Text className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                              To be defined
                            </Text>
                          )}
                          <Text className="text-xs text-primary font-bold ml-1">
                            ✎
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Edit Base Price Modal */}
      <Modal
        visible={editingItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingItem(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 items-center justify-center bg-black/60 p-4"
        >
          <View className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl gap-4">
            <View className="flex-row items-center justify-between border-b border-border pb-3">
              <View>
                <Text className="text-base font-bold text-foreground">
                  Edit Package Base Price
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5">
                  {editingItem?.vehicleTypeName}
                </Text>
              </View>
              <Pressable
                onPress={() => setEditingItem(null)}
                className="rounded-full p-1 active:bg-muted"
              >
                <Text className="text-base text-muted-foreground font-bold">✕</Text>
              </Pressable>
            </View>

            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted-foreground">
                Service Package
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {editingItem?.packageName}
              </Text>
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-muted-foreground">
                Base Price (LKR)
              </Text>
              <Input
                keyboardType="numeric"
                value={editPriceInput}
                onChangeText={setEditPriceInput}
                placeholder="Leave empty for 'To be defined'"
                className="h-11"
                autoFocus
              />
              <Text className="text-[10px] text-muted-foreground">
                Enter price in LKR or leave blank to mark as unspecified.
              </Text>
            </View>

            <View className="flex-row justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                onPress={() => setEditingItem(null)}
                className="px-4 h-9"
              >
                <Text className="text-xs font-semibold">Cancel</Text>
              </Button>
              <Button
                onPress={handleSavePrice}
                className="px-4 h-9"
              >
                <Text className="text-xs font-bold text-primary-foreground">
                  Save Price
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}


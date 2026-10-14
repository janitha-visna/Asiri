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
  MOCK_CATEGORIES,
  MOCK_VEHICLE_TYPES,
  getServicesForVehicle,
} from "@/features/data-entry/data-entry.mocks";

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
    MOCK_CATEGORIES.find((c) => c.name.toLowerCase() === "car") ??
    MOCK_CATEGORIES[0];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    defaultCategory.id
  );

  // In-memory base price state map: Key = `${vehicleTypeId}:${serviceId}` -> basePrice
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    for (const vt of MOCK_VEHICLE_TYPES) {
      const services = getServicesForVehicle(vt.id);
      for (const s of services) {
        initialMap[`${vt.id}:${s.id}`] = s.basePrice ?? "0.00";
      }
    }
    return initialMap;
  });

  // Modal edit state
  const [editingItem, setEditingItem] = useState<{
    vehicleTypeId: string;
    vehicleTypeName: string;
    serviceId: string;
    serviceName: string;
    currentPrice: string;
  } | null>(null);

  const [editPriceInput, setEditPriceInput] = useState<string>("");

  // Filter vehicle types by active category
  const filteredVehicleTypes = MOCK_VEHICLE_TYPES.filter(
    (vt) => vt.categoryId === selectedCategoryId
  );

  const handleOpenEdit = (
    vehicleTypeId: string,
    vehicleTypeName: string,
    serviceId: string,
    serviceName: string,
    currentPrice: string
  ) => {
    setEditingItem({
      vehicleTypeId,
      vehicleTypeName,
      serviceId,
      serviceName,
      currentPrice,
    });
    setEditPriceInput(currentPrice);
  };

  const handleSavePrice = () => {
    if (!editingItem) return;
    const cleanPrice = editPriceInput.trim();
    if (cleanPrice && !isNaN(Number(cleanPrice))) {
      const formatted = Number(cleanPrice).toFixed(2);
      setPrices((prev) => ({
        ...prev,
        [`${editingItem.vehicleTypeId}:${editingItem.serviceId}`]: formatted,
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
          Configure default service base rates for each vehicle type
        </Text>
      </View>

      {/* Horizontal Category Tabs */}
      <View className="border-b border-border bg-card/60">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-3 py-2.5 gap-2 items-center"
        >
          {MOCK_CATEGORIES.map((cat) => {
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
            const vehicleServices = getServicesForVehicle(vt.id);
            const categoryObj = MOCK_CATEGORIES.find((c) => c.id === vt.categoryId);
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
                      {vehicleServices.length} Services
                    </Text>
                  </View>
                </View>

                {/* Table Header */}
                <View className="flex-row items-center border-b border-border bg-muted/20 px-4 py-2">
                  <Text className="flex-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Service Name
                  </Text>
                  <Text className="w-32 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Base Rate
                  </Text>
                </View>

                {/* Services Pricing Rows */}
                <View className="divide-y divide-border">
                  {vehicleServices.map((service) => {
                    const priceKey = `${vt.id}:${service.id}`;
                    const currentPrice = prices[priceKey] ?? service.basePrice ?? "0.00";
                    const numPrice = Number(currentPrice);

                    return (
                      <View
                        key={service.id}
                        className="flex-row items-center justify-between px-4 py-3"
                      >
                        {/* Service Title & Info */}
                        <View className="flex-1 pr-3">
                          <Text className="text-sm font-semibold text-foreground">
                            {service.name}
                          </Text>
                          {service.requiresPartSelection && (
                            <Text className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                              • Requires part selection ({service.components.length} components)
                            </Text>
                          )}
                        </View>

                        {/* Price Badge / Edit Action */}
                        <Pressable
                          onPress={() =>
                            handleOpenEdit(
                              vt.id,
                              vt.name,
                              service.id,
                              service.name,
                              currentPrice
                            )
                          }
                          className="flex-row items-center justify-end gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 active:bg-muted"
                        >
                          <Text className="text-sm font-bold text-foreground">
                            Rs.{" "}
                            {!isNaN(numPrice)
                              ? numPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : currentPrice}
                          </Text>
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
                  Edit Base Price
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
                Service
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {editingItem?.serviceName}
              </Text>
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-muted-foreground">
                Base Price (Rs.)
              </Text>
              <Input
                keyboardType="numeric"
                value={editPriceInput}
                onChangeText={setEditPriceInput}
                placeholder="Enter base price"
                className="h-11"
                autoFocus
              />
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

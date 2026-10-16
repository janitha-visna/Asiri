// features/service-pricing/components/ServicePricingMaster.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useServicePricesMatrix,
  useUpdateServicePrices,
} from "../hooks/useServicePricing";
import type {
  MatrixCategory,
  MatrixVehicleType,
  MatrixService,
} from "../service-pricing.types";

// Vehicle Category Icons/Emojis helper
function getCategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("bike") || lower.includes("motorcycle")) return "🏍️";
  if (lower.includes("car")) return "🚗";
  if (lower.includes("cab")) return "🚕";
  if (lower.includes("van")) return "🚐";
  if (lower.includes("bus")) return "🚌";
  if (lower.includes("lorry")) return "🚛";
  if (lower.includes("tipper")) return "🚜";
  if (lower.includes("commercial")) return "🚚";
  return "🚘";
}

type EditingTarget = {
  vehicleType: MatrixVehicleType;
  service: MatrixService;
  categoryName: string;
  currentPrice: number | null;
};

export function ServicePricingMaster() {
  const insets = useSafeAreaInsets();

  // Queries & Mutations
  const {
    data: matrix,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useServicePricesMatrix();

  const updateMutation = useUpdateServicePrices();

  // Active Category state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Edit Modal State
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);

  const categories = matrix?.categories ?? [];
  const services = matrix?.services ?? [];
  const prices = matrix?.prices ?? {};

  // Resolve currently active category (defaults to Car or first available)
  const activeCategory: MatrixCategory | undefined = useMemo(() => {
    if (categories.length === 0) return undefined;
    if (selectedCategoryId) {
      const found = categories.find((c) => c.categoryId === selectedCategoryId);
      if (found) return found;
    }
    // Default to "Car" if available, else first category
    const defaultCat =
      categories.find((c) => c.categoryName.toLowerCase() === "car") ??
      categories[0];
    return defaultCat;
  }, [categories, selectedCategoryId]);

  const handleOpenEdit = (
    vt: MatrixVehicleType,
    srv: MatrixService,
    catName: string,
    currentPrice: number | null
  ) => {
    setEditingTarget({
      vehicleType: vt,
      service: srv,
      categoryName: catName,
      currentPrice,
    });
    setEditPriceInput(currentPrice !== null ? currentPrice.toString() : "");
    setInputError(null);
  };

  const handleSavePrice = async () => {
    if (!editingTarget) return;

    const trimmed = editPriceInput.trim();
    if (!trimmed) {
      setInputError("Please enter a valid price.");
      return;
    }

    const parsedPrice = parseFloat(trimmed);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setInputError("Please enter a valid positive number.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        prices: [
          {
            serviceId: editingTarget.service.id,
            vehicleTypeId: editingTarget.vehicleType.id,
            price: parsedPrice,
          },
        ],
      });
      setEditingTarget(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update price";
      Alert.alert("Update Failed", message);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Screen Header */}
      <View className="border-b border-border bg-card px-4 py-3">
        <Text className="text-xl font-black tracking-tight text-foreground">
          Service Pricing Master
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">
          Base service prices per vehicle type in Sri Lankan rupees (LKR)
        </Text>
      </View>

      {/* Horizontal Category Tabs */}
      {categories.length > 0 && (
        <View className="border-b border-border bg-card/60">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-3 py-2.5 gap-2 items-center"
          >
            {categories.map((cat) => {
              const isSelected = cat.categoryId === activeCategory?.categoryId;
              return (
                <Pressable
                  key={cat.categoryId}
                  onPress={() => setSelectedCategoryId(cat.categoryId)}
                  className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${
                    isSelected
                      ? "bg-primary border-primary shadow-sm"
                      : "bg-card border-border active:bg-muted"
                  }`}
                >
                  <Text className="text-sm">{getCategoryEmoji(cat.categoryName)}</Text>
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected
                        ? "text-primary-foreground font-bold"
                        : "text-foreground"
                    }`}
                  >
                    {cat.categoryName}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center p-8 gap-3">
          <ActivityIndicator size="large" />
          <Text className="text-sm font-medium text-muted-foreground">
            Loading pricing matrix...
          </Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-8 gap-3">
          <Text className="text-base font-bold text-destructive">
            Failed to load service pricing
          </Text>
          <Text className="text-xs text-center text-muted-foreground max-w-xs">
            {error instanceof Error ? error.message : "Network error occurred"}
          </Text>
          <Button onPress={() => refetch()} variant="outline" className="mt-2">
            <Text className="text-xs font-semibold">Try Again</Text>
          </Button>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 gap-5"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          {activeCategory?.vehicleTypes.length === 0 ? (
            <View className="rounded-xl border border-dashed border-border bg-card p-8 items-center justify-center">
              <Text className="text-muted-foreground text-sm">
                No vehicle types registered under {activeCategory?.categoryName}.
              </Text>
            </View>
          ) : (
            activeCategory?.vehicleTypes.map((vt) => {
              const emoji = getCategoryEmoji(activeCategory.categoryName);

              return (
                <View
                  key={vt.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
                >
                  {/* Vehicle Type Card Header */}
                  <View className="flex-row items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl">{emoji}</Text>
                      <Text className="text-sm font-black tracking-wide text-foreground uppercase">
                        {vt.name}
                      </Text>
                    </View>
                    <View className="rounded-md bg-secondary px-2.5 py-0.5">
                      <Text className="text-[10px] font-semibold text-secondary-foreground">
                        {services.length} Services
                      </Text>
                    </View>
                  </View>

                  {/* Table Header */}
                  <View className="flex-row items-center border-b border-border bg-muted/20 px-4 py-2">
                    <Text className="flex-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Service Name
                    </Text>
                    <Text className="w-36 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Base Price (LKR)
                    </Text>
                  </View>

                  {/* Services Pricing Rows */}
                  <View className="divide-y divide-border">
                    {services.map((srv) => {
                      // Lookup key is `${serviceId}_${vehicleTypeId}`
                      const priceKey = `${srv.id}_${vt.id}`;
                      const priceVal = prices[priceKey] ?? null;
                      const hasPrice =
                        priceVal !== null &&
                        priceVal !== undefined &&
                        !isNaN(Number(priceVal));

                      return (
                        <View
                          key={srv.id}
                          className="flex-row items-center justify-between px-4 py-3"
                        >
                          {/* Service Name */}
                          <View className="flex-1 pr-3">
                            <Text className="text-sm font-semibold text-foreground">
                              {srv.name}
                            </Text>
                          </View>

                          {/* Price Badge / Edit Action */}
                          <Pressable
                            onPress={() =>
                              handleOpenEdit(
                                vt,
                                srv,
                                activeCategory.categoryName,
                                priceVal
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
                                {Number(priceVal).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
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
      )}

      {/* Edit Base Price Modal */}
      <Modal
        visible={editingTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingTarget(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 items-center justify-center bg-black/60 p-4"
        >
          <View className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl gap-4">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b border-border pb-3">
              <View>
                <Text className="text-base font-bold text-foreground">
                  Edit Base Price
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5">
                  {editingTarget?.categoryName} • {editingTarget?.vehicleType.name}
                </Text>
              </View>
              <Pressable
                onPress={() => setEditingTarget(null)}
                className="rounded-full p-1 active:bg-muted"
              >
                <Text className="text-base text-muted-foreground font-bold">✕</Text>
              </Pressable>
            </View>

            {/* Service Info */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-muted-foreground">
                Service
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {editingTarget?.service.name}
              </Text>
            </View>

            {/* Price Input */}
            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-muted-foreground">
                Base Price (LKR)
              </Text>
              <Input
                keyboardType="decimal-pad"
                value={editPriceInput}
                onChangeText={(val) => {
                  setEditPriceInput(val);
                  if (inputError) setInputError(null);
                }}
                placeholder="e.g. 1500.00"
                className="h-11"
                autoFocus
              />
              {inputError ? (
                <Text className="text-[11px] font-semibold text-destructive">
                  {inputError}
                </Text>
              ) : (
                <Text className="text-[10px] text-muted-foreground">
                  Enter amount in Sri Lankan rupees (LKR).
                </Text>
              )}
            </View>

            {/* Modal Actions */}
            <View className="flex-row justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                onPress={() => setEditingTarget(null)}
                disabled={updateMutation.isPending}
                className="px-4 h-9"
              >
                <Text className="text-xs font-semibold">Cancel</Text>
              </Button>
              <Button
                onPress={handleSavePrice}
                disabled={updateMutation.isPending}
                className="px-4 h-9 min-w-[90px] flex-row items-center justify-center gap-1.5"
              >
                {updateMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-xs font-bold text-primary-foreground">
                    Save Price
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

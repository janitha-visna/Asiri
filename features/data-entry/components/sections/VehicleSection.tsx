// features/data-entry/components/sections/VehicleSection.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import { Input } from "@/components/ui/input";
import { Select, type SelectItem } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useDataEntryContext } from "../../DataEntryContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import {
  useVehicleLookup,
  useVehicleCategories,
  useVehicleTypes,
} from "../../hooks/queries";
import type { VehicleDto } from "../../data-entry.types";

export function VehicleSection() {
  const { draft, dispatch } = useDataEntryContext();
  const debouncedPlate = useDebouncedValue(draft.vehicle.numberPlate, 300);

  const {
    data: lookupData,
    isLoading: isLookupLoading,
  } = useVehicleLookup(debouncedPlate);

  const { data: categories = [] } = useVehicleCategories();
  const { data: vehicleTypes = [] } = useVehicleTypes(
    draft.vehicle.categoryId ?? undefined
  );

  // When exact match is detected from the lookup, auto-fill vehicle & customer if not already registered
  useEffect(() => {
    if (
      lookupData?.exactMatch &&
      draft.vehicle.mode !== "registered" &&
      draft.vehicle.id !== lookupData.exactMatch.id
    ) {
      dispatch({
        type: "VEHICLE_MATCHED",
        vehicle: lookupData.exactMatch,
      });
    } else if (
      debouncedPlate.length >= 2 &&
      !isLookupLoading &&
      !lookupData?.exactMatch &&
      draft.vehicle.mode !== "new"
    ) {
      dispatch({ type: "VEHICLE_NOT_FOUND" });
    }
  }, [lookupData, debouncedPlate, isLookupLoading, draft.vehicle.mode, draft.vehicle.id, dispatch]);

  const categoryItems: SelectItem[] = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const typeItems: SelectItem[] = vehicleTypes.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  const handleSelectSuggestion = (plate: string) => {
    dispatch({ type: "PLATE_CHANGED", plate });
  };

  const handleResetVehicle = () => {
    dispatch({ type: "PLATE_CHANGED", plate: "" });
  };

  const isRegistered = draft.vehicle.mode === "registered";

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          1. Vehicle Details
        </Text>
        {isRegistered && (
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-emerald-500/15 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-emerald-600">
                Registered Vehicle
              </Text>
            </View>
            <Button
              variant="outline"
              size="sm"
              onPress={handleResetVehicle}
              className="h-7 px-2"
            >
              <Text className="text-xs font-medium text-muted-foreground">
                Change
              </Text>
            </Button>
          </View>
        )}
        {draft.vehicle.mode === "new" && (
          <View className="rounded-full bg-amber-500/15 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-amber-600">
              New Vehicle
            </Text>
          </View>
        )}
      </View>

      {/* Number Plate Input */}
      <View className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-muted-foreground">
            Number Plate
          </Text>
          {isLookupLoading && (
            <ActivityIndicator size="small" className="h-4 w-4" />
          )}
        </View>
        <Input
          placeholder="e.g., CB-1234 or WP-CAD-5544"
          value={draft.vehicle.numberPlate}
          onChangeText={(plate) =>
            dispatch({ type: "PLATE_CHANGED", plate })
          }
          autoCapitalize="characters"
          editable={!isRegistered}
        />
      </View>

      {/* Lookup Suggestions */}
      {!isRegistered &&
        lookupData?.suggestions &&
        lookupData.suggestions.length > 0 && (
          <View className="gap-1.5 rounded-lg bg-muted/40 p-2.5">
            <Text className="text-xs font-medium text-muted-foreground">
              Suggested Registered Vehicles:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {lookupData.suggestions.map((v) => (
                <Pressable
                  key={v.id}
                  onPress={() => handleSelectSuggestion(v.numberPlate)}
                  className="rounded-md border border-border bg-background px-2.5 py-1.5 active:bg-accent"
                >
                  <Text className="text-xs font-semibold text-foreground">
                    {v.numberPlate}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

      {/* Category and Type Selectors */}
      <View className="gap-3">
        <View className="gap-1.5">
          <Text className="text-xs font-medium text-muted-foreground">
            Vehicle Category
          </Text>
          {isRegistered ? (
            <View className="rounded-md border border-input bg-muted/30 px-3 py-2.5">
              <Text className="text-sm font-medium text-foreground">
                {categories.find((c) => c.id === draft.vehicle.categoryId)?.name ??
                  "Registered Category"}
              </Text>
            </View>
          ) : (
            <Select
              items={categoryItems}
              value={draft.vehicle.categoryId ?? ""}
              onValueChange={(categoryId) =>
                dispatch({ type: "CATEGORY_SELECTED", categoryId })
              }
              placeholder="Select Category (e.g., Cars & Light Vehicles)"
            />
          )}
        </View>

        <View className="gap-1.5">
          <Text className="text-xs font-medium text-muted-foreground">
            Vehicle Type
          </Text>
          {isRegistered ? (
            <View className="rounded-md border border-input bg-muted/30 px-3 py-2.5">
              <Text className="text-sm font-medium text-foreground">
                {vehicleTypes.find((t) => t.id === draft.vehicle.vehicleTypeId)?.name ??
                  "Registered Type"}
              </Text>
            </View>
          ) : (
            <Select
              items={typeItems}
              value={draft.vehicle.vehicleTypeId ?? ""}
              onValueChange={(vehicleTypeId) =>
                dispatch({ type: "TYPE_SELECTED", vehicleTypeId })
              }
              placeholder={
                draft.vehicle.categoryId
                  ? "Select Vehicle Type (e.g., Sedan, SUV)"
                  : "Select a Category first"
              }
              disabled={!draft.vehicle.categoryId}
            />
          )}
        </View>
      </View>
    </View>
  );
}

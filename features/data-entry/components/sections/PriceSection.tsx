// features/data-entry/components/sections/PriceSection.tsx
import React from "react";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useDataEntryContext } from "../../DataEntryContext";
import { useAvailableServices } from "../../hooks/queries";
import { estimateCost } from "../../data-entry.utils";

export function PriceSection() {
  const { draft, dispatch } = useDataEntryContext();

  const { data: services = [] } = useAvailableServices(
    draft.vehicle.vehicleTypeId ?? undefined,
    draft.servicePackageId ?? undefined
  );

  const estimatedCost = estimateCost(draft, services);

  const handlePriceChange = (value: string) => {
    dispatch({ type: "PRICE_EDITED", value });
  };

  const handleResetPrice = () => {
    dispatch({ type: "PRICE_RESET" });
  };

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          7. Pricing & Override
        </Text>
        {draft.isPriceEdited && (
          <View className="rounded-full bg-amber-500/15 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-amber-600">
              Custom Override
            </Text>
          </View>
        )}
      </View>

      {/* Calculated Estimate Box */}
      <View className="rounded-lg bg-primary/10 p-3.5 flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-medium text-muted-foreground">
            Estimated Total
          </Text>
          <Text className="text-xl font-bold text-primary">
            {estimatedCost !== null
              ? `Rs. ${estimatedCost.toLocaleString()}`
              : "Calculated on Save"}
          </Text>
        </View>

        {draft.isPriceEdited && (
          <Button
            variant="outline"
            size="sm"
            onPress={handleResetPrice}
            className="h-8 px-2.5"
          >
            <Text className="text-xs font-semibold text-primary">
              Reset to Estimate
            </Text>
          </Button>
        )}
      </View>

      {/* Optional Price Override Input */}
      <View className="gap-1.5">
        <Text className="text-xs font-medium text-muted-foreground">
          Final Charge / Custom Override (LKR)
        </Text>
        <Input
          placeholder={
            estimatedCost !== null
              ? `e.g., ${estimatedCost}`
              : "Enter final amount"
          }
          value={draft.totalCost}
          onChangeText={handlePriceChange}
          keyboardType="decimal-pad"
        />
        <Text className="text-[11px] text-muted-foreground">
          Leave blank to automatically charge the calculated service cost.
        </Text>
      </View>
    </View>
  );
}

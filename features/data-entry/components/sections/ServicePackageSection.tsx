// features/data-entry/components/sections/ServicePackageSection.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { ToggleButton } from "@/components/ui/toggle-button";
import { useDataEntryContext } from "../../DataEntryContext";
import { useServicePackages } from "../../hooks/queries";

export function ServicePackageSection() {
  const { draft, dispatch } = useDataEntryContext();
  const { data: packages = [], isLoading } = useServicePackages();

  const handleSelectPackage = (packageId: string) => {
    dispatch({ type: "PACKAGE_SELECTED", packageId });
  };

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          5. Service Package
        </Text>
        {isLoading && <ActivityIndicator size="small" className="h-4 w-4" />}
      </View>

      <Text className="text-xs text-muted-foreground">
        Select the primary service package for this vehicle:
      </Text>

      <View className="flex-row flex-wrap gap-2 pt-1">
        {packages.map((pkg) => (
          <ToggleButton
            key={pkg.id}
            label={pkg.name}
            selected={draft.servicePackageId === pkg.id}
            onPress={() => handleSelectPackage(pkg.id)}
          />
        ))}
      </View>
    </View>
  );
}

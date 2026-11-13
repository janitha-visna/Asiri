// features/data-entry/components/sections/ServicePackageSection.tsx
import React from "react";
import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { ToggleButton } from "@/components/ui/toggle-button";
import { useDataEntryContext } from "../../DataEntryContext";
import { useServicePackages } from "../../hooks/queries";

export function ServicePackageSection() {
  const { draft, dispatch } = useDataEntryContext();
  const vehicleTypeId = draft.vehicle.vehicleTypeId ?? undefined;
  const isDark = useColorScheme() === "dark";

  const colors = {
    border: isDark ? "hsl(240, 3.7%, 15.9%)" : "hsl(240, 5.9%, 90%)",
    card: isDark ? "hsl(240, 10%, 3.9%)" : "hsl(0, 0%, 100%)",
    foreground: isDark ? "hsl(0, 0%, 98%)" : "hsl(240, 10%, 3.9%)",
    mutedForeground: isDark ? "hsl(240, 5%, 64.9%)" : "hsl(240, 3.8%, 46.1%)",
  };

  const { data: packages = [], isLoading } = useServicePackages(vehicleTypeId);

  const handleSelectPackage = (packageId: string) => {
    dispatch({ type: "PACKAGE_SELECTED", packageId });
  };

  if (!vehicleTypeId) {
    return (
      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          padding: 20,
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.mutedForeground,
          }}
        >
          5. Service Package
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: colors.mutedForeground,
          }}
        >
          Please select a vehicle category and type above to see available service packages.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        padding: 16,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.foreground,
          }}
        >
          5. Service Package
        </Text>
        {isLoading && (
          <ActivityIndicator size="small" style={{ height: 16, width: 16 }} />
        )}
      </View>

      <Text
        style={{
          fontSize: 12,
          color: colors.mutedForeground,
        }}
      >
        Select the primary service package for this vehicle:
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          paddingTop: 4,
        }}
      >
        {packages.map((pkg) => (
          <ToggleButton
            key={pkg.id}
            label={
              pkg.price !== undefined
                ? `${pkg.name} • Rs. ${pkg.price.toLocaleString()}`
                : pkg.name
            }
            selected={draft.servicePackageId === pkg.id}
            onPress={() => handleSelectPackage(pkg.id)}
          />
        ))}
      </View>
    </View>
  );
}

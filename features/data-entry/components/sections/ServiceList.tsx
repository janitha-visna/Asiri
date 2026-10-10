// features/data-entry/components/sections/ServiceList.tsx
import React, { useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";
import { useAvailableServices } from "../../hooks/queries";
import { PartPickerModal } from "./PartPickerModal";
import type {
  AvailableServiceDto,
  ComponentDto,
} from "../../data-entry.types";

export function ServiceList() {
  const { draft, dispatch } = useDataEntryContext();

  const vehicleTypeId = draft.vehicle.vehicleTypeId;
  const packageId = draft.servicePackageId;

  const {
    data: services = [],
    isLoading,
  } = useAvailableServices(vehicleTypeId ?? undefined, packageId ?? undefined);

  // State to manage active PartPickerModal
  const [activePicker, setActivePicker] = useState<{
    serviceId: string;
    component: ComponentDto;
  } | null>(null);

  const handleToggleService = (serviceId: string) => {
    dispatch({ type: "SERVICE_TOGGLED", serviceId });
  };

  const selectedCount = Object.keys(draft.services).length;

  if (!vehicleTypeId || !packageId) {
    return (
      <View className="rounded-xl border border-dashed border-border bg-card/60 p-5 items-center gap-2">
        <Text className="text-base font-bold text-muted-foreground">
          6. Services Checklist
        </Text>
        <Text className="text-xs text-center text-muted-foreground">
          {!vehicleTypeId
            ? "Please select a vehicle category and type above to see services."
            : "Please select a service package to load available services."}
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          6. Services Checklist
        </Text>
        <View className="flex-row items-center gap-2">
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View className="rounded-full bg-primary/10 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-primary">
                {selectedCount} Selected
              </Text>
            </View>
          )}
        </View>
      </View>

      {services.length === 0 && !isLoading ? (
        <Text className="py-4 text-center text-xs text-muted-foreground">
          No services configured for this vehicle type and package.
        </Text>
      ) : (
        <View className="gap-3">
          {services.map((service: AvailableServiceDto) => {
            const isSelected = Boolean(draft.services[service.id]);
            const selectedServiceState = draft.services[service.id];

            return (
              <View
                key={service.id}
                className={`rounded-lg border p-3 gap-2.5 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                {/* Service Header Row */}
                <Pressable
                  onPress={() => handleToggleService(service.id)}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                    {/* Checkbox indicator */}
                    <View
                      className={`h-5 w-5 rounded items-center justify-center border ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-xs font-bold text-primary-foreground">
                          ✓
                        </Text>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">
                        {service.name}
                      </Text>
                    </View>
                  </View>

                  {service.basePrice !== null && (
                    <Text className="text-xs font-semibold text-foreground">
                      Rs. {Number(service.basePrice).toLocaleString()}
                    </Text>
                  )}
                </Pressable>

                {/* If selected and requires parts: Component brand pickers */}
                {isSelected &&
                  service.requiresPartSelection &&
                  service.components.length > 0 && (
                    <View className="gap-2 pt-2 border-t border-border/60">
                      <Text className="text-xs font-medium text-muted-foreground">
                        Required Part Selections:
                      </Text>
                      {service.components.map((comp) => {
                        const selectedPartId =
                          selectedServiceState?.partIdsByComponent[comp.id];

                        return (
                          <View
                            key={comp.id}
                            className="flex-row items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                          >
                            <Text className="text-xs font-semibold text-foreground flex-1 pr-2">
                              {comp.name}
                            </Text>

                            <Pressable
                              onPress={() =>
                                setActivePicker({
                                  serviceId: service.id,
                                  component: comp,
                                })
                              }
                              className={`rounded px-2.5 py-1 border ${
                                selectedPartId
                                  ? "border-emerald-500 bg-emerald-500/10"
                                  : "border-amber-500 bg-amber-500/10"
                              }`}
                            >
                              <Text
                                className={`text-xs font-semibold ${
                                  selectedPartId
                                    ? "text-emerald-700 dark:text-emerald-400"
                                    : "text-amber-700 dark:text-amber-400"
                                }`}
                              >
                                {selectedPartId
                                  ? "Brand Selected ✓"
                                  : "Choose Brand ⚠"}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  )}
              </View>
            );
          })}
        </View>
      )}

      {/* Part Picker Modal */}
      {activePicker && vehicleTypeId && (
        <PartPickerModal
          visible={Boolean(activePicker)}
          onClose={() => setActivePicker(null)}
          serviceId={activePicker.serviceId}
          component={activePicker.component}
          vehicleTypeId={vehicleTypeId}
        />
      )}
    </View>
  );
}

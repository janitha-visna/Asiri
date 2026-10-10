// features/data-entry/components/sections/PartPickerModal.tsx
import React from "react";
import { Modal, Pressable, View, ScrollView, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useCompatibleParts } from "../../hooks/queries";
import { useDataEntryContext } from "../../DataEntryContext";
import type { ComponentDto } from "../../data-entry.types";

interface PartPickerModalProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string;
  component: ComponentDto;
  vehicleTypeId: string;
}

export function PartPickerModal({
  visible,
  onClose,
  serviceId,
  component,
  vehicleTypeId,
}: PartPickerModalProps) {
  const { draft, dispatch } = useDataEntryContext();

  const { data: parts = [], isLoading } = useCompatibleParts(
    vehicleTypeId,
    component.id
  );

  const selectedPartId =
    draft.services[serviceId]?.partIdsByComponent[component.id];

  const handleSelectPart = (partId: string) => {
    dispatch({
      type: "PART_SELECTED",
      serviceId,
      componentId: component.id,
      partId,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 p-4"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-sm rounded-xl bg-card p-4 gap-4"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-border pb-3">
            <View>
              <Text className="text-base font-bold text-foreground">
                Select Part Brand
              </Text>
              <Text className="text-xs text-muted-foreground">
                Compatible parts for: {component.name}
              </Text>
            </View>
            <Button variant="ghost" size="sm" onPress={onClose} className="h-8 w-8 p-0">
              <Text className="text-sm font-bold text-muted-foreground">✕</Text>
            </Button>
          </View>

          {isLoading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="small" />
              <Text className="mt-2 text-xs text-muted-foreground">
                Loading compatible parts...
              </Text>
            </View>
          ) : parts.length === 0 ? (
            <View className="py-6 items-center">
              <Text className="text-sm text-muted-foreground">
                No compatible parts found for this component.
              </Text>
            </View>
          ) : (
            <ScrollView className="max-h-72 gap-2">
              {parts.map((part) => {
                const isSelected = selectedPartId === part.id;
                return (
                  <Pressable
                    key={part.id}
                    onPress={() => handleSelectPart(part.id)}
                    className={`flex-row items-center justify-between rounded-lg border p-3 mb-2 active:bg-accent ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background"
                    }`}
                  >
                    <View className="flex-1 pr-2">
                      <Text
                        className={`text-sm font-bold ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {part.brand} {part.name}
                      </Text>
                      {part.partNumber && (
                        <Text className="text-xs text-muted-foreground">
                          PN: {part.partNumber}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <Button variant="outline" onPress={onClose} className="w-full">
            <Text className="font-semibold text-foreground">Close</Text>
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

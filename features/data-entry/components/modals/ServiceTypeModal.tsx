import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ToggleButton } from "@/components/ui/toggle-button";
import type { DataEntryModalContentProps } from "./ModalContent.types";

const SERVICE_TYPES = [
  "Air Filter Change",
  "Engine Oil Change",
  "Brake Oil Change",
  "Apply Grease",
];

const QUICK_SELECT_OPTIONS = ["Full Service", "Body Wash", "Nil"];

export function ServiceTypeModal({
  value,
  onSave,
  onClose,
}: DataEntryModalContentProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    value ? value.split(",").filter(Boolean) : []
  );
  const [selectedQuickSelect, setSelectedQuickSelect] = useState<string | null>(null);

  const handleToggleService = (service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service);
      }
      return [...prev, service];
    });
  };

  const handleSelectQuickSelect = (option: string) => {
    setSelectedQuickSelect((prev) => (prev === option ? null : option));
  };

  const handleSave = () => {
    onSave(selectedServices.join(","));
  };

  return (
    <View className="flex-1 gap-4">
      {/* Top Quick Select Buttons */}
      <View className="gap-2">
        <Text className="text-xs font-medium text-muted-foreground">
          Quick Select
        </Text>
        <View className="flex-row gap-2">
          {QUICK_SELECT_OPTIONS.map((option) => (
            <ToggleButton
              key={option}
              label={option}
              selected={selectedQuickSelect === option}
              onPress={() => handleSelectQuickSelect(option)}
            />
          ))}
        </View>
      </View>

      {/* Service Count Display */}
      <View className="rounded-lg bg-primary/10 p-3">
        <Text className="text-center text-sm font-medium text-foreground">
          Services Selected:{" "}
          <Text className="font-bold text-primary">
            {selectedServices.length}
          </Text>
        </Text>
      </View>

      {/* Available Services */}
      <View className="gap-2">
        <Text className="text-xs font-medium text-muted-foreground">
          Service Types
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {SERVICE_TYPES.map((service) => (
            <ToggleButton
              key={service}
              label={service}
              selected={selectedServices.includes(service)}
              onPress={() => handleToggleService(service)}
            />
          ))}
        </View>
      </View>

      {/* Spacer */}
      <View className="flex-1" />

      {/* Action Buttons */}
      <View className="gap-3">
        <Button
          variant="default"
          size="lg"
          onPress={handleSave}
          className="w-full bg-green-600"
        >
          Save
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onPress={onClose}
          className="w-full bg-red-600"
        >
          Cancel
        </Button>
      </View>
    </View>
  );
}

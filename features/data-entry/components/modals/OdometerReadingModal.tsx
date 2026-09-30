import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function OdometerReadingModal({
  value,
  onSave,
  onClose,
}: DataEntryModalContentProps) {
  const { values, saveField } = useDataEntryContext();

  const [currentReading, setCurrentReading] = useState(
    value || values.odometerReading || ""
  );
  const [nextReading, setNextReading] = useState(
    values.nextOdometerReading || ""
  );

  const handleSave = () => {
    const trimmedCurrent = currentReading.trim();
    const trimmedNext = nextReading.trim();

    if (!trimmedCurrent) {
      alert("Please enter the current odometer reading");
      return;
    }

    if (isNaN(Number(trimmedCurrent)) || Number(trimmedCurrent) < 0) {
      alert("Please enter a valid number for the current reading");
      return;
    }

    if (trimmedNext) {
      if (isNaN(Number(trimmedNext)) || Number(trimmedNext) < 0) {
        alert("Please enter a valid number for the next reading");
        return;
      }

      if (Number(trimmedNext) <= Number(trimmedCurrent)) {
        alert("Next reading must be greater than current reading");
        return;
      }

      // Save next odometer reading to context
      saveField("nextOdometerReading", trimmedNext);
    } else {
      saveField("nextOdometerReading", "");
    }

    // Save current odometer reading to context
    saveField("odometerReading", trimmedCurrent);

    // Dismiss the modal
    onClose();
  };

  return (
    <View className="flex-1 gap-5">
      {/* Current Meter Reading */}
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Current Meter Reading (km)
        </Text>
        <Input
          placeholder="e.g., 45000"
          value={currentReading}
          onChangeText={setCurrentReading}
          keyboardType="number-pad"
          editable
        />
      </View>

      {/* Next Meter Reading */}
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Next Service Meter Reading (km)
        </Text>
        <Input
          placeholder="e.g., 50000"
          value={nextReading}
          onChangeText={setNextReading}
          keyboardType="number-pad"
          editable
        />
      </View>

      {/* Spacer to push buttons to the bottom */}
      <View className="flex-1" />

      {/* Save Button */}
      <Button
        variant="default"
        size="lg"
        onPress={handleSave}
        className="w-full bg-green-600"
      >
        Save Meter Readings
      </Button>

      {/* Cancel Button */}
      <Button
        variant="destructive"
        size="lg"
        onPress={onClose}
        className="w-full bg-red-600"
      >
        Cancel
      </Button>
    </View>
  );
}

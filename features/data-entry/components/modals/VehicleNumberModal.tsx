import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectItem } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import type { DataEntryModalContentProps } from "./ModalContent.types";

const VEHICLE_TYPES: SelectItem[] = [
  { label: "Car", value: "car" },
  { label: "Van", value: "van" },
  { label: "Bike", value: "bike" },
];

export function VehicleNumberModal({
  value,
  onSave,
  onClose,
}: DataEntryModalContentProps) {
  const [vehicleNumber, setVehicleNumber] = useState(value || "");
  const [vehicleType, setVehicleType] = useState<string>("");

  const handleRegister = () => {
    if (!vehicleNumber.trim()) {
      alert("Please enter a vehicle number");
      return;
    }
    if (!vehicleType) {
      alert("Please select a vehicle type");
      return;
    }

    // Save the vehicle number; vehicle type can be extended later
    onSave(vehicleNumber);
  };

  return (
    <View className="flex-1 gap-5">
      {/* Vehicle Number Input */}
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Vehicle Number
        </Text>
        <Input
          placeholder="Enter vehicle number (e.g., ABC-123)"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          editable
        />
      </View>

      {/* Vehicle Type Select */}
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Vehicle Type
        </Text>
        <Select
          items={VEHICLE_TYPES}
          value={vehicleType}
          onValueChange={setVehicleType}
          placeholder="Select vehicle type"
        />
      </View>

      {/* Spacer to push button to bottom */}
      <View className="flex-1" />

      {/* Register Vehicle Button */}
      <Button
        variant="default"
        size="lg"
        onPress={handleRegister}
        className="w-full bg-green-600"
      >
        Register Vehicle
      </Button>

      {/* Cancel Button */}
      <Button
        variant="secondary"
        size="lg"
        onPress={onClose}
        className="w-full"
      >
        Cancel
      </Button>
    </View>
  );
}

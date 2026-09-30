import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function TotalPriceModal({
  value,
  onSave,
  onClose,
}: DataEntryModalContentProps) {
  const [price, setPrice] = useState(value || "");
  const { saveField } = useDataEntryContext();

  const handleSave = () => {
    const trimmedPrice = price.trim();

    if (!trimmedPrice) {
      alert("Please enter a total price");
      return;
    }

    if (isNaN(Number(trimmedPrice)) || Number(trimmedPrice) < 0) {
      alert("Please enter a valid price amount");
      return;
    }

    // 1. Save total price into global context using saveField
    saveField("totalPrice", trimmedPrice);

    // 2. Go back / dismiss the modal
    onClose();
  };

  return (
    <View className="flex-1 gap-5">
      {/* Total Price Input */}
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Total Price (LKR)
        </Text>
        <Input
          placeholder="e.g., 5500.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
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
        Save Total Price
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

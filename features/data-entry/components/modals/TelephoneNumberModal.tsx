import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function TelephoneNumberModal({
  value,
  onSave,
  onClose,
}: DataEntryModalContentProps) {
  const [phone, setPhone] = useState(value || "");
  const { saveField } = useDataEntryContext();

  const handleSave = () => {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      alert("Please enter a telephone number");
      return;
    }

    // 1. Save the telephone number into global context using saveField
    saveField("telephoneNumber", trimmedPhone);

    // 2. Go back / dismiss the modal
    onClose();
  };

  return (
    <View className="flex-1 gap-5">
      {/* Telephone Number Input */}
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Telephone Number
        </Text>
        <Input
          placeholder="e.g., 0771234567"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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
        Save Telephone Number
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

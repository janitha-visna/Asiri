import { Text } from "react-native";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function OdometerReadingModal({ value }: DataEntryModalContentProps) {
  return (
    <Text className="text-gray-500">
      Odometer Reading content coming soon. Current value: {value || "none"}
    </Text>
  );
}

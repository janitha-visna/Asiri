import { Text } from "react-native";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function TotalPriceModal({ value }: DataEntryModalContentProps) {
  return (
    <Text className="text-gray-500">
      Total Price content coming soon. Current value: {value || "none"}
    </Text>
  );
}

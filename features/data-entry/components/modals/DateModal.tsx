import { Text } from "react-native";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function DateModal({ value }: DataEntryModalContentProps) {
  return (
    <Text className="text-gray-500">
      Date content coming soon. Current value: {value || "none"}
    </Text>
  );
}
